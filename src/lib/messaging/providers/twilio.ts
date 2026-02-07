/**
 * Twilio Messaging Provider
 *
 * Implements WhatsApp Business API + SMS via Twilio.
 * Handles WhatsApp → SMS fallback for OTP delivery.
 *
 * Council decision (2026-02-07): Unified provider over fragmented stack
 * Constraints: Pay-as-you-go only, no long-term contracts
 */

import type {
  MessagingProvider,
  MessagingConfig,
  SendResult,
  OTPRequest,
  WhatsAppTemplateRequest,
  SMSRequest,
  DeliveryStatusWebhook,
  MessageStatus,
  WhatsAppTemplate,
} from '../types'
import { TEMPLATE_COSTS, SMS_COST_CENTS, isValidFrenchPhone } from '../types'

// Twilio SDK types (loaded dynamically)
type TwilioClient = {
  messages: {
    create: (params: TwilioMessageParams) => Promise<TwilioMessage>
  }
}

interface TwilioMessageParams {
  from: string
  to: string
  body?: string
  contentSid?: string // For WhatsApp templates
  contentVariables?: string // JSON string of template variables
}

interface TwilioMessage {
  sid: string
  status: string
  errorCode?: number
  errorMessage?: string
}

// WhatsApp template Content SIDs (configured in Twilio Console)
// These are created when you submit templates to Meta via Twilio
const TEMPLATE_CONTENT_SIDS: Record<WhatsAppTemplate, string> = {
  otp_verification: process.env.TWILIO_TEMPLATE_OTP || '',
  welcome: process.env.TWILIO_TEMPLATE_WELCOME || '',
  visit_confirmation: process.env.TWILIO_TEMPLATE_VISIT || '',
  reward_earned: process.env.TWILIO_TEMPLATE_REWARD_EARNED || '',
  reward_redeemed: process.env.TWILIO_TEMPLATE_REWARD_REDEEMED || '',
  marketing: process.env.TWILIO_TEMPLATE_MARKETING || '',
}

// Map Twilio status to our status
function mapTwilioStatus(status: string): MessageStatus {
  const statusMap: Record<string, MessageStatus> = {
    queued: 'queued',
    sending: 'queued',
    sent: 'sent',
    delivered: 'delivered',
    read: 'read',
    failed: 'failed',
    undelivered: 'undelivered',
  }
  return statusMap[status] || 'queued'
}

// WhatsApp-specific error codes that should trigger SMS fallback
const WHATSAPP_FALLBACK_ERRORS = [
  63001, // WhatsApp: User is not on WhatsApp
  63003, // WhatsApp: Message failed to send
  63016, // WhatsApp: Message undeliverable
  63024, // WhatsApp: Recipient phone number is not valid
]

export class TwilioProvider implements MessagingProvider {
  readonly name = 'twilio'
  private client: TwilioClient
  private phoneNumber: string
  private whatsAppNumber: string
  private authToken: string

  constructor(config: MessagingConfig) {
    if (!config.twilioAccountSid || !config.twilioAuthToken) {
      throw new Error('Twilio credentials required')
    }
    if (!config.twilioPhoneNumber) {
      throw new Error('Twilio phone number required')
    }

    // Initialize Twilio client
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const twilio = require('twilio')
    this.client = twilio(config.twilioAccountSid, config.twilioAuthToken)

    this.phoneNumber = config.twilioPhoneNumber
    // WhatsApp number format: whatsapp:+33...
    this.whatsAppNumber =
      config.twilioWhatsAppNumber || `whatsapp:${config.twilioPhoneNumber}`
    this.authToken = config.twilioAuthToken
  }

  /**
   * Send OTP via WhatsApp with SMS fallback
   */
  async sendOTP(request: OTPRequest): Promise<SendResult> {
    const { phone, code, preferWhatsApp = true } = request

    // Validate phone number
    if (!isValidFrenchPhone(phone)) {
      return {
        success: false,
        messageId: null,
        channel: 'whatsapp',
        status: 'failed',
        error: {
          code: 'INVALID_PHONE',
          message: `Invalid French phone number: ${phone}`,
        },
      }
    }

    // Try WhatsApp first if preferred
    if (preferWhatsApp) {
      const whatsappResult = await this.sendWhatsAppOTP(phone, code)
      if (whatsappResult.success) {
        return whatsappResult
      }

      // Check if we should fallback to SMS
      if (
        whatsappResult.error &&
        WHATSAPP_FALLBACK_ERRORS.includes(
          parseInt(whatsappResult.error.code, 10)
        )
      ) {
        console.log(
          `[Twilio] WhatsApp failed for ${phone}, falling back to SMS`
        )
        return this.sendSMSOTP(phone, code)
      }

      // Non-recoverable WhatsApp error
      return whatsappResult
    }

    // SMS only
    return this.sendSMSOTP(phone, code)
  }

  /**
   * Send OTP via WhatsApp template
   */
  private async sendWhatsAppOTP(
    phone: string,
    code: string
  ): Promise<SendResult> {
    const templateSid = TEMPLATE_CONTENT_SIDS.otp_verification

    // If template not configured, fall back to direct message
    // (only works if user has messaged within 24h - session window)
    if (!templateSid) {
      return this.sendWhatsAppDirect(
        phone,
        `Votre code de verification Loyeo: ${code}`
      )
    }

    try {
      const message = await this.client.messages.create({
        from: this.whatsAppNumber,
        to: `whatsapp:${phone}`,
        contentSid: templateSid,
        contentVariables: JSON.stringify({ '1': code }),
      })

      return {
        success: true,
        messageId: message.sid,
        channel: 'whatsapp',
        status: mapTwilioStatus(message.status),
        estimatedCostCents: TEMPLATE_COSTS.otp_verification,
      }
    } catch (error) {
      return this.handleTwilioError(error, 'whatsapp')
    }
  }

  /**
   * Send OTP via SMS
   */
  private async sendSMSOTP(phone: string, code: string): Promise<SendResult> {
    try {
      const message = await this.client.messages.create({
        from: this.phoneNumber,
        to: phone,
        body: `Votre code Loyeo: ${code}`,
      })

      return {
        success: true,
        messageId: message.sid,
        channel: 'sms',
        status: mapTwilioStatus(message.status),
        estimatedCostCents: SMS_COST_CENTS,
      }
    } catch (error) {
      return this.handleTwilioError(error, 'sms')
    }
  }

  /**
   * Send WhatsApp template message
   */
  async sendWhatsAppTemplate(
    request: WhatsAppTemplateRequest
  ): Promise<SendResult> {
    const { phone, template, variables, isSessionMessage } = request

    if (!isValidFrenchPhone(phone)) {
      return {
        success: false,
        messageId: null,
        channel: 'whatsapp',
        status: 'failed',
        error: {
          code: 'INVALID_PHONE',
          message: `Invalid French phone number: ${phone}`,
        },
      }
    }

    // Session messages (free) can use direct body
    if (isSessionMessage) {
      const body = this.renderTemplate(template, variables)
      return this.sendWhatsAppDirect(phone, body)
    }

    // Template messages require Content SID
    const templateSid = TEMPLATE_CONTENT_SIDS[template]
    if (!templateSid) {
      return {
        success: false,
        messageId: null,
        channel: 'whatsapp',
        status: 'failed',
        error: {
          code: 'TEMPLATE_NOT_CONFIGURED',
          message: `WhatsApp template not configured: ${template}`,
        },
      }
    }

    try {
      const message = await this.client.messages.create({
        from: this.whatsAppNumber,
        to: `whatsapp:${phone}`,
        contentSid: templateSid,
        contentVariables: JSON.stringify(variables),
      })

      return {
        success: true,
        messageId: message.sid,
        channel: 'whatsapp',
        status: mapTwilioStatus(message.status),
        estimatedCostCents: TEMPLATE_COSTS[template],
      }
    } catch (error) {
      return this.handleTwilioError(error, 'whatsapp')
    }
  }

  /**
   * Send direct WhatsApp message (session window only)
   */
  private async sendWhatsAppDirect(
    phone: string,
    body: string
  ): Promise<SendResult> {
    try {
      const message = await this.client.messages.create({
        from: this.whatsAppNumber,
        to: `whatsapp:${phone}`,
        body,
      })

      return {
        success: true,
        messageId: message.sid,
        channel: 'whatsapp',
        status: mapTwilioStatus(message.status),
        estimatedCostCents: 0, // Session messages are free
      }
    } catch (error) {
      return this.handleTwilioError(error, 'whatsapp')
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(request: SMSRequest): Promise<SendResult> {
    const { phone, message } = request

    if (!isValidFrenchPhone(phone)) {
      return {
        success: false,
        messageId: null,
        channel: 'sms',
        status: 'failed',
        error: {
          code: 'INVALID_PHONE',
          message: `Invalid French phone number: ${phone}`,
        },
      }
    }

    try {
      const result = await this.client.messages.create({
        from: this.phoneNumber,
        to: phone,
        body: message,
      })

      return {
        success: true,
        messageId: result.sid,
        channel: 'sms',
        status: mapTwilioStatus(result.status),
        estimatedCostCents: SMS_COST_CENTS,
      }
    } catch (error) {
      return this.handleTwilioError(error, 'sms')
    }
  }

  /**
   * Parse Twilio webhook payload
   */
  parseDeliveryWebhook(payload: unknown): DeliveryStatusWebhook | null {
    if (!payload || typeof payload !== 'object') {
      return null
    }

    const data = payload as Record<string, string>

    // Check for Twilio webhook signature
    if (!data.MessageSid || !data.MessageStatus) {
      return null
    }

    // Determine channel from From/To fields
    const channel =
      data.From?.startsWith('whatsapp:') || data.To?.startsWith('whatsapp:')
        ? 'whatsapp'
        : 'sms'

    return {
      messageId: data.MessageSid,
      status: mapTwilioStatus(data.MessageStatus),
      channel,
      errorCode: data.ErrorCode,
      errorMessage: data.ErrorMessage,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Verify Twilio webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const twilio = require('twilio')
    const webhookUrl = process.env.TWILIO_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('[Twilio] TWILIO_WEBHOOK_URL not configured for validation')
      return false
    }

    try {
      // Parse URL-encoded body
      const params = new URLSearchParams(payload)
      const data: Record<string, string> = {}
      params.forEach((value, key) => {
        data[key] = value
      })

      return twilio.validateRequest(
        this.authToken,
        signature,
        webhookUrl,
        data
      )
    } catch (error) {
      console.error('[Twilio] Webhook signature verification failed:', {
        error: error instanceof Error ? error.message : 'Unknown',
        payloadLength: payload.length,
        timestamp: new Date().toISOString(),
      })
      return false
    }
  }

  /**
   * Render template message (for session messages)
   */
  private renderTemplate(
    template: WhatsAppTemplate,
    variables: Record<string, string>
  ): string {
    const templates: Record<WhatsAppTemplate, string> = {
      otp_verification: `Votre code de vérification Loyeo: ${variables['1'] || ''}`,
      welcome: `Bienvenue chez ${variables['1'] || ''} ! Vous avez gagné votre premier tampon.`,
      visit_confirmation: `Tampon enregistré ! ${variables['1'] || ''}/${variables['2'] || ''} tampons`,
      reward_earned: `Bravo ! Vous avez gagné : ${variables['1'] || ''}`,
      reward_redeemed: `Récompense utilisée : ${variables['1'] || ''}`,
      marketing: variables['1'] || '',
    }

    const rendered = templates[template]
    if (!rendered && template !== 'marketing') {
      console.error('[Twilio] Unknown template requested:', template)
    }
    return rendered || ''
  }

  /**
   * Handle Twilio API errors
   */
  private handleTwilioError(
    error: unknown,
    channel: 'whatsapp' | 'sms'
  ): SendResult {
    const twilioError = error as {
      code?: number
      message?: string
      status?: number
    }

    console.error('[Twilio] Error:', {
      code: twilioError.code,
      message: twilioError.message,
      status: twilioError.status,
    })

    return {
      success: false,
      messageId: null,
      channel,
      status: 'failed',
      error: {
        code: String(twilioError.code || 'UNKNOWN'),
        message: twilioError.message || 'Unknown error',
      },
    }
  }
}
