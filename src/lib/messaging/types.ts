/**
 * Messaging Provider Abstraction Layer
 *
 * This interface enables future migration between messaging providers
 * (Twilio, Meta Cloud API, MessageBird, etc.) without changing application code.
 *
 * Current implementation: Twilio (WhatsApp Business API + Programmable SMS)
 * Decision rationale: Council debate 2026-02-07 - unified provider vs fragmented stack
 */

// Message delivery status
export type MessageStatus =
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'undelivered'

// Success vs failure status for type narrowing
export type SuccessStatus = 'queued' | 'sent' | 'delivered' | 'read'
export type FailureStatus = 'failed' | 'undelivered'

// Message channel
export type MessageChannel = 'whatsapp' | 'sms'

// Branded type for E.164 phone numbers
declare const E164PhoneBrand: unique symbol
export type E164PhoneNumber = string & { readonly [E164PhoneBrand]: true }

/**
 * Result of a send operation - discriminated union
 *
 * When success is true:
 * - messageId is guaranteed to be a string
 * - estimatedCostCents is guaranteed to be a number
 *
 * When success is false:
 * - error is guaranteed to be present
 * - messageId is null
 */
export type SendResult =
  | {
      success: true
      messageId: string
      channel: MessageChannel
      status: SuccessStatus
      estimatedCostCents: number
    }
  | {
      success: false
      messageId: null
      channel: MessageChannel
      status: FailureStatus
      error: {
        code: string
        message: string
      }
    }

// WhatsApp template variables
export type TemplateVariables = Record<string, string>

// Supported WhatsApp message templates
// These must be pre-approved by Meta via Twilio console
export type WhatsAppTemplate =
  | 'otp_verification' // Authentication: "Votre code Loyeo: {{1}}"
  | 'welcome' // Utility: "Bienvenue chez {{1}}! Vous avez gagné votre premier tampon."
  | 'visit_confirmation' // Session (free): "Tampon enregistré! {{1}}/{{2}} tampons"
  | 'reward_earned' // Utility: "Bravo! Vous avez gagné: {{1}}"
  | 'reward_redeemed' // Session (free): "Récompense utilisée: {{1}}"
  | 'marketing' // Marketing: Custom promotional messages

// Template metadata for cost estimation
export const TEMPLATE_COSTS: Record<WhatsAppTemplate, number> = {
  otp_verification: 4, // €0.04 - Authentication
  welcome: 4, // €0.04 - Utility
  visit_confirmation: 0, // FREE - Session (within 24h)
  reward_earned: 4, // €0.04 - Utility
  reward_redeemed: 0, // FREE - Session (within 24h)
  marketing: 7, // €0.07 - Marketing
}

// SMS cost (fallback)
export const SMS_COST_CENTS = 5 // €0.05 per SMS

/**
 * Template message content (French)
 *
 * IMPORTANT: Keep in sync with:
 * - src/lib/messaging/providers/twilio.ts (renderTemplate)
 * - supabase/functions/send-message/index.ts (templates object)
 *
 * These are used for session messages (within 24h window).
 * For template messages outside the session window, Meta-approved
 * templates via Content SID are required.
 */
export const TEMPLATE_MESSAGES: Record<WhatsAppTemplate, string> = {
  otp_verification: 'Votre code de vérification Loyeo : {{1}}',
  welcome: 'Bienvenue chez {{1}} ! Vous avez gagné votre premier tampon.',
  visit_confirmation: 'Tampon enregistré ! {{1}}/{{2}} tampons',
  reward_earned: 'Bravo ! Vous avez gagné : {{1}}',
  reward_redeemed: 'Récompense utilisée : {{1}}',
  marketing: '{{1}}',
}

/**
 * Render a template message with variables
 *
 * @param template - Template name
 * @param variables - Variables to substitute (keys: '1', '2', etc.)
 * @returns Rendered message string
 */
export function renderTemplateMessage(
  template: WhatsAppTemplate,
  variables: Record<string, string>
): string {
  let message = TEMPLATE_MESSAGES[template]
  if (!message) {
    console.error('[Messaging] Unknown template:', template)
    return ''
  }

  // Replace {{1}}, {{2}}, etc. with actual values
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(`{{${key}}}`, value)
  })

  return message
}

// OTP request
export interface OTPRequest {
  phone: string // E.164 format (+33...)
  code: string // 6-digit code
  preferWhatsApp?: boolean // Default: true
}

// WhatsApp template request
export interface WhatsAppTemplateRequest {
  phone: string // E.164 format
  template: WhatsAppTemplate
  variables: TemplateVariables
  // For session messages (visit_confirmation, reward_redeemed),
  // the consumer must have messaged within 24h
  isSessionMessage?: boolean
}

// SMS request (direct, not template)
export interface SMSRequest {
  phone: string // E.164 format
  message: string
}

// Webhook payload for delivery status updates
export interface DeliveryStatusWebhook {
  messageId: string
  status: MessageStatus
  channel: MessageChannel
  errorCode?: string
  errorMessage?: string
  timestamp: string
}

/**
 * Messaging Provider Interface
 *
 * Implement this interface for each messaging provider.
 * The factory (index.ts) selects the provider based on MESSAGING_PROVIDER env var.
 */
export interface MessagingProvider {
  /**
   * Send OTP code via WhatsApp (primary) with SMS fallback
   * Uses the otp_verification template for WhatsApp
   */
  sendOTP(request: OTPRequest): Promise<SendResult>

  /**
   * Send a WhatsApp template message
   * Template must be pre-approved by Meta
   */
  sendWhatsAppTemplate(request: WhatsAppTemplateRequest): Promise<SendResult>

  /**
   * Send a direct SMS message
   * Use sparingly - more expensive than WhatsApp
   */
  sendSMS(request: SMSRequest): Promise<SendResult>

  /**
   * Parse incoming webhook for delivery status
   * Returns null if the webhook is not from this provider
   */
  parseDeliveryWebhook(payload: unknown): DeliveryStatusWebhook | null

  /**
   * Verify webhook signature for security
   */
  verifyWebhookSignature(payload: string, signature: string): boolean

  /**
   * Provider name for logging
   */
  readonly name: string
}

// Provider configuration
export interface MessagingConfig {
  // Twilio
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioPhoneNumber?: string // +33...
  twilioWhatsAppNumber?: string // whatsapp:+33...

  // Future: Meta Cloud API direct
  metaAccessToken?: string
  metaPhoneNumberId?: string

  // Webhook verification
  webhookSecret?: string
}

// Phone number validation (E.164 format for France)
export function isValidFrenchPhone(phone: string): boolean {
  // French numbers: +33 followed by 9 digits
  // Mobile: +33 6... or +33 7...
  return /^\+33[67]\d{8}$/.test(phone)
}

// Normalize phone number to E.164
export function normalizePhone(phone: string): string {
  // Remove spaces, dashes, dots
  let normalized = phone.replace(/[\s\-\.]/g, '')

  // Handle French local format (06/07...)
  if (/^0[67]\d{8}$/.test(normalized)) {
    normalized = '+33' + normalized.slice(1)
  }

  // Handle missing + prefix
  if (/^33[67]\d{8}$/.test(normalized)) {
    normalized = '+' + normalized
  }

  return normalized
}

/**
 * Parse and validate a phone number, returning a branded E164 type
 *
 * @param input - Raw phone number string
 * @returns E164PhoneNumber if valid, null otherwise
 *
 * @example
 * const phone = parseE164Phone('06 12 34 56 78')
 * if (phone) {
 *   // phone is now typed as E164PhoneNumber
 *   await sendOTP({ phone, code: '123456' })
 * }
 */
export function parseE164Phone(input: string): E164PhoneNumber | null {
  const normalized = normalizePhone(input)
  if (isValidFrenchPhone(normalized)) {
    return normalized as E164PhoneNumber
  }
  return null
}

/**
 * Type guard to check if a string is a valid E164 phone number
 */
export function isE164Phone(phone: string): phone is E164PhoneNumber {
  return isValidFrenchPhone(normalizePhone(phone))
}
