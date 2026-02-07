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

// Message channel
export type MessageChannel = 'whatsapp' | 'sms'

// Result of a send operation
export interface SendResult {
  success: boolean
  messageId: string | null
  channel: MessageChannel
  status: MessageStatus
  error?: {
    code: string
    message: string
  }
  // Cost in EUR cents for monitoring
  estimatedCostCents?: number
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
