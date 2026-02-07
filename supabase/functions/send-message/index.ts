/**
 * Supabase Edge Function: send-message
 *
 * Sends messages via the messaging provider (Twilio).
 * Uses service role for cross-boundary operations.
 * Logs to messaging_events table for cost monitoring.
 *
 * Endpoints:
 *   POST /send-message/otp - Send OTP verification
 *   POST /send-message/template - Send WhatsApp template
 *   POST /send-message/sms - Send direct SMS
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers - restricted to production domain
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || 'https://loyeo.fr',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

// Message types
type MessageType = 'otp' | 'template' | 'sms'

interface OTPRequest {
  phone: string
  code: string
  preferWhatsApp?: boolean
}

interface TemplateRequest {
  phone: string
  template: string
  variables: Record<string, string>
  isSessionMessage?: boolean
}

interface SMSRequest {
  phone: string
  message: string
}

interface SendResult {
  success: boolean
  messageId: string | null
  channel: 'whatsapp' | 'sms'
  status: string
  error?: { code: string; message: string }
  estimatedCostCents?: number
}

// Validate French phone number (E.164 format)
function isValidFrenchPhone(phone: string): boolean {
  return /^\+33[67]\d{8}$/.test(phone)
}

// Normalize phone to E.164
function normalizePhone(phone: string): string {
  let normalized = phone.replace(/[\s\-\.]/g, '')
  if (/^0[67]\d{8}$/.test(normalized)) {
    normalized = '+33' + normalized.slice(1)
  }
  if (/^33[67]\d{8}$/.test(normalized)) {
    normalized = '+' + normalized
  }
  return normalized
}

// Send OTP via Twilio
async function sendOTP(request: OTPRequest): Promise<SendResult> {
  const phone = normalizePhone(request.phone)

  if (!isValidFrenchPhone(phone)) {
    return {
      success: false,
      messageId: null,
      channel: 'whatsapp',
      status: 'failed',
      error: { code: 'INVALID_PHONE', message: 'Invalid French phone number' },
    }
  }

  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const phoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')
  const whatsAppNumber =
    Deno.env.get('TWILIO_WHATSAPP_NUMBER') || `whatsapp:${phoneNumber}`

  if (!accountSid || !authToken || !phoneNumber) {
    return {
      success: false,
      messageId: null,
      channel: 'whatsapp',
      status: 'failed',
      error: { code: 'CONFIG_ERROR', message: 'Twilio not configured' },
    }
  }

  const auth = btoa(`${accountSid}:${authToken}`)

  // Try WhatsApp first
  if (request.preferWhatsApp !== false) {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: whatsAppNumber,
            To: `whatsapp:${phone}`,
            Body: `Votre code de vérification Loyeo : ${request.code}`,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          messageId: data.sid,
          channel: 'whatsapp',
          status: data.status,
          estimatedCostCents: 4,
        }
      }

      // Check if we should fall back to SMS
      // Only fall back for specific WhatsApp-unavailable errors
      const fallbackErrors = [63001, 63003, 63016, 63024]
      if (fallbackErrors.includes(data.code)) {
        console.log('[send-message] WhatsApp failed for user, falling back to SMS', {
          errorCode: data.code,
          phone: phone.substring(0, 6) + '***',
          timestamp: new Date().toISOString(),
        })
      } else {
        // Non-fallback errors should propagate, not silently fall back
        return {
          success: false,
          messageId: null,
          channel: 'whatsapp',
          status: 'failed',
          error: { code: String(data.code), message: data.message },
        }
      }
    } catch (error) {
      // Only fall back for network errors, not auth/config errors
      console.error('[send-message] WhatsApp network error:', {
        error: error instanceof Error ? error.message : 'Unknown',
        phone: phone.substring(0, 6) + '***',
        timestamp: new Date().toISOString(),
      })
      // For network errors, we can attempt SMS fallback
      // For other errors (like TypeError), propagate them
      if (!(error instanceof TypeError)) {
        // Network error - continue to SMS fallback
      } else {
        // Programming error - propagate
        return {
          success: false,
          messageId: null,
          channel: 'whatsapp',
          status: 'failed',
          error: {
            code: 'INTERNAL_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        }
      }
    }
  }

  // SMS fallback
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: phoneNumber,
          To: phone,
          Body: `Votre code de vérification Loyeo : ${request.code}`,
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        messageId: data.sid,
        channel: 'sms',
        status: data.status,
        estimatedCostCents: 5,
      }
    }

    return {
      success: false,
      messageId: null,
      channel: 'sms',
      status: 'failed',
      error: { code: String(data.code), message: data.message },
    }
  } catch (error) {
    return {
      success: false,
      messageId: null,
      channel: 'sms',
      status: 'failed',
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

// Send WhatsApp template message
async function sendTemplate(request: TemplateRequest): Promise<SendResult> {
  const phone = normalizePhone(request.phone)

  if (!isValidFrenchPhone(phone)) {
    return {
      success: false,
      messageId: null,
      channel: 'whatsapp',
      status: 'failed',
      error: { code: 'INVALID_PHONE', message: 'Invalid French phone number' },
    }
  }

  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const whatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER')

  if (!accountSid || !authToken || !whatsAppNumber) {
    return {
      success: false,
      messageId: null,
      channel: 'whatsapp',
      status: 'failed',
      error: { code: 'CONFIG_ERROR', message: 'Twilio not configured' },
    }
  }

  // Template cost mapping
  const templateCosts: Record<string, number> = {
    otp_verification: 4,
    welcome: 4,
    visit_confirmation: 0,
    reward_earned: 4,
    reward_redeemed: 0,
    marketing: 7,
  }

  // For session messages, send direct body
  if (request.isSessionMessage) {
    const templates: Record<string, string> = {
      visit_confirmation: `Tampon enregistré ! ${request.variables['1'] || ''}/${request.variables['2'] || ''} tampons`,
      reward_redeemed: `Récompense utilisée : ${request.variables['1'] || ''}`,
    }

    const body = templates[request.template]
    if (!body) {
      console.warn('[send-message] Unknown session template requested:', request.template)
    }

    const auth = btoa(`${accountSid}:${authToken}`)
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: whatsAppNumber,
          To: `whatsapp:${phone}`,
          Body: body,
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        messageId: data.sid,
        channel: 'whatsapp',
        status: data.status,
        estimatedCostCents: 0, // Session messages are free
      }
    }

    return {
      success: false,
      messageId: null,
      channel: 'whatsapp',
      status: 'failed',
      error: { code: String(data.code), message: data.message },
    }
  }

  // Template messages require Content SID (configured in Twilio Console)
  const templateSid = Deno.env.get(`TWILIO_TEMPLATE_${request.template.toUpperCase()}`)

  if (!templateSid) {
    return {
      success: false,
      messageId: null,
      channel: 'whatsapp',
      status: 'failed',
      error: {
        code: 'TEMPLATE_NOT_CONFIGURED',
        message: `Template not configured: ${request.template}`,
      },
    }
  }

  const auth = btoa(`${accountSid}:${authToken}`)
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: whatsAppNumber,
        To: `whatsapp:${phone}`,
        ContentSid: templateSid,
        ContentVariables: JSON.stringify(request.variables),
      }),
    }
  )

  const data = await response.json()

  if (response.ok) {
    return {
      success: true,
      messageId: data.sid,
      channel: 'whatsapp',
      status: data.status,
      estimatedCostCents: templateCosts[request.template] || 4,
    }
  }

  return {
    success: false,
    messageId: null,
    channel: 'whatsapp',
    status: 'failed',
    error: { code: String(data.code), message: data.message },
  }
}

// Send SMS
async function sendSMS(request: SMSRequest): Promise<SendResult> {
  const phone = normalizePhone(request.phone)

  if (!isValidFrenchPhone(phone)) {
    return {
      success: false,
      messageId: null,
      channel: 'sms',
      status: 'failed',
      error: { code: 'INVALID_PHONE', message: 'Invalid French phone number' },
    }
  }

  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const phoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

  if (!accountSid || !authToken || !phoneNumber) {
    return {
      success: false,
      messageId: null,
      channel: 'sms',
      status: 'failed',
      error: { code: 'CONFIG_ERROR', message: 'Twilio not configured' },
    }
  }

  const auth = btoa(`${accountSid}:${authToken}`)
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: phoneNumber,
        To: phone,
        Body: request.message,
      }),
    }
  )

  const data = await response.json()

  if (response.ok) {
    return {
      success: true,
      messageId: data.sid,
      channel: 'sms',
      status: data.status,
      estimatedCostCents: 5,
    }
  }

  return {
    success: false,
    messageId: null,
    channel: 'sms',
    status: 'failed',
    error: { code: String(data.code), message: data.message },
  }
}

// Log message event to database
// Returns logging status - non-fatal but tracked
async function logMessageEvent(
  supabase: ReturnType<typeof createClient>,
  result: SendResult,
  messageType: MessageType,
  phone: string
): Promise<{ logged: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('messaging_events').insert({
      message_id: result.messageId,
      message_type: messageType,
      channel: result.channel,
      status: result.status,
      phone_hash: await hashPhone(phone), // Store hash for privacy
      cost_cents: result.estimatedCostCents || 0,
      error_code: result.error?.code,
      error_message: result.error?.message,
    })

    if (error) {
      console.error('[send-message] Failed to log message event:', {
        messageId: result.messageId,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
      return { logged: false, error: error.message }
    }

    return { logged: true }
  } catch (error) {
    console.error('[send-message] Exception logging message event:', {
      messageId: result.messageId,
      error: error instanceof Error ? error.message : 'Unknown',
      timestamp: new Date().toISOString(),
    })
    return { logged: false, error: String(error) }
  }
}

// Hash phone number for privacy
async function hashPhone(phone: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(phone + Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()

    // Initialize Supabase client with validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[send-message] Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let result: SendResult
    let messageType: MessageType
    let phone: string

    switch (path) {
      case 'otp':
        messageType = 'otp'
        phone = body.phone
        result = await sendOTP(body as OTPRequest)
        break

      case 'template':
        messageType = 'template'
        phone = body.phone
        result = await sendTemplate(body as TemplateRequest)
        break

      case 'sms':
        messageType = 'sms'
        phone = body.phone
        result = await sendSMS(body as SMSRequest)
        break

      default:
        return new Response(
          JSON.stringify({ error: `Unknown endpoint: ${path}` }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }

    // Log to messaging_events table (non-fatal, but tracked)
    const logResult = await logMessageEvent(supabase, result, messageType, phone)
    if (!logResult.logged) {
      console.warn('[send-message] Message sent but logging failed:', logResult.error)
    }

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
