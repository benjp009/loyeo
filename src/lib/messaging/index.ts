/**
 * Messaging Provider Factory
 *
 * Selects the messaging provider based on MESSAGING_PROVIDER environment variable.
 * Default: 'twilio' (Council decision 2026-02-07)
 *
 * Usage:
 *   import { getMessagingProvider } from '@/lib/messaging'
 *   const provider = getMessagingProvider()
 *   await provider.sendOTP({ phone: '+33612345678', code: '123456' })
 */

import type { MessagingProvider, MessagingConfig } from './types'

// Lazy-loaded provider instances
let twilioProvider: MessagingProvider | null = null

/**
 * Get the configured messaging provider
 *
 * Provider selection order:
 * 1. MESSAGING_PROVIDER env var
 * 2. Default: 'twilio'
 *
 * @throws Error if provider is not configured correctly
 */
export function getMessagingProvider(): MessagingProvider {
  const providerName = process.env.MESSAGING_PROVIDER || 'twilio'

  switch (providerName) {
    case 'twilio':
      return getTwilioProvider()

    case 'mock':
      // For testing - returns a mock provider that logs but doesn't send
      return getMockProvider()

    default:
      throw new Error(
        `Unknown messaging provider: ${providerName}. ` +
          `Supported: twilio, mock`
      )
  }
}

/**
 * Get Twilio provider (singleton)
 */
function getTwilioProvider(): MessagingProvider {
  if (twilioProvider) {
    return twilioProvider
  }

  // Validate required env vars
  const config: MessagingConfig = {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    twilioWhatsAppNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  }

  if (!config.twilioAccountSid || !config.twilioAuthToken) {
    throw new Error(
      'Twilio not configured. Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN'
    )
  }

  if (!config.twilioPhoneNumber) {
    throw new Error('Twilio not configured. Required: TWILIO_PHONE_NUMBER')
  }

  // Import lazily to avoid loading Twilio SDK when not needed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TwilioProvider } = require('./providers/twilio')
  const provider = new TwilioProvider(config) as MessagingProvider
  twilioProvider = provider
  return provider
}

/**
 * Mock provider for testing
 * Logs all messages but doesn't actually send them
 */
function getMockProvider(): MessagingProvider {
  return {
    name: 'mock',

    async sendOTP(request) {
      console.log('[MockMessaging] sendOTP:', request)
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        channel: 'whatsapp',
        status: 'sent',
        estimatedCostCents: 4,
      }
    },

    async sendWhatsAppTemplate(request) {
      console.log('[MockMessaging] sendWhatsAppTemplate:', request)
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        channel: 'whatsapp',
        status: 'sent',
        estimatedCostCents: 4,
      }
    },

    async sendSMS(request) {
      console.log('[MockMessaging] sendSMS:', request)
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        channel: 'sms',
        status: 'sent',
        estimatedCostCents: 5,
      }
    },

    parseDeliveryWebhook() {
      return null
    },

    verifyWebhookSignature() {
      return true
    },
  }
}

// Re-export types for convenience
export * from './types'
