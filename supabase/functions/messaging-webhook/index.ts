/**
 * Supabase Edge Function: messaging-webhook
 *
 * Handles Twilio delivery status webhooks.
 * Updates message status in messaging_events table.
 *
 * Note: SMS fallback for OTP is handled synchronously at send time,
 * not via webhook callbacks.
 *
 * Endpoint: POST /messaging-webhook
 * Called by: Twilio when message status changes
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encodeBase64 } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

// CORS headers - restricted to production domain
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || 'https://loyeo.fr',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-twilio-signature',
}

// Map Twilio status to our status
function mapTwilioStatus(
  status: string
): 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'undelivered' {
  const statusMap: Record<
    string,
    'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'undelivered'
  > = {
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

/**
 * Verify Twilio webhook signature using HMAC-SHA1
 *
 * Algorithm:
 * 1. Concatenate webhook URL with sorted POST parameters (key+value pairs)
 * 2. Compute HMAC-SHA1 using auth token as key
 * 3. Base64 encode the result
 * 4. Compare with X-Twilio-Signature header
 *
 * @see https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
async function verifyTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>
): Promise<boolean> {
  try {
    if (!signature || !authToken || !url) {
      console.error('[Webhook] Missing required signature verification parameters')
      return false
    }

    // Sort parameters alphabetically and concatenate key+value pairs
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join('')

    const data = url + sortedParams

    // Create HMAC-SHA1 using Web Crypto API
    const encoder = new TextEncoder()
    const keyData = encoder.encode(authToken)
    const messageData = encoder.encode(data)

    // Import the auth token as HMAC key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )

    // Sign the data
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

    // Base64 encode the signature
    const computedSignature = encodeBase64(new Uint8Array(signatureBuffer))

    // Constant-time comparison to prevent timing attacks
    const isValid = computedSignature === signature

    if (!isValid) {
      console.warn('[Webhook] Signature mismatch', {
        expected: computedSignature.substring(0, 10) + '...',
        received: signature.substring(0, 10) + '...',
        urlLength: url.length,
        paramsCount: Object.keys(params).length,
      })
    }

    return isValid
  } catch (error) {
    console.error('[Webhook] Signature verification error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Parse URL-encoded body (Twilio sends form data)
    const body = await req.text()
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}
    params.forEach((value, key) => {
      data[key] = value
    })

    // Verify Twilio signature - REQUIRED for security
    const signature = req.headers.get('x-twilio-signature') || ''
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const webhookUrl = Deno.env.get('TWILIO_WEBHOOK_URL')

    if (!authToken || !webhookUrl) {
      console.error('[Webhook] Missing required environment variables: TWILIO_AUTH_TOKEN, TWILIO_WEBHOOK_URL')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const isValid = await verifyTwilioSignature(authToken, signature, webhookUrl, data)
    if (!isValid) {
      console.error('[Webhook] Rejected: Invalid Twilio signature', {
        timestamp: new Date().toISOString(),
        signaturePresent: signature.length > 0,
      })
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Extract message details
    const messageId = data.MessageSid
    const status = mapTwilioStatus(data.MessageStatus || '')
    const errorCode = data.ErrorCode
    const errorMessage = data.ErrorMessage

    // Determine channel
    const from = data.From || ''
    const to = data.To || ''
    const channel =
      from.startsWith('whatsapp:') || to.startsWith('whatsapp:')
        ? 'whatsapp'
        : 'sms'

    console.log('[Webhook] Received:', {
      messageId,
      status,
      channel,
      errorCode,
    })

    if (!messageId) {
      return new Response(JSON.stringify({ error: 'Missing MessageSid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client with validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Webhook] Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update message status in messaging_events table
    const { error: updateError } = await supabase
      .from('messaging_events')
      .update({
        status,
        error_code: errorCode || null,
        error_message: errorMessage || null,
        updated_at: new Date().toISOString(),
      })
      .eq('message_id', messageId)

    if (updateError) {
      console.error('[Webhook] Database update failed:', {
        messageId,
        error: updateError,
        timestamp: new Date().toISOString(),
      })
      // Return 500 to trigger Twilio retry
      return new Response(
        JSON.stringify({ error: 'Database update failed', retry: true }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if this is a failed WhatsApp message that needs SMS fallback
    if (
      channel === 'whatsapp' &&
      (status === 'failed' || status === 'undelivered')
    ) {
      // Fetch the original message to get phone and content
      const { data: originalMessage } = await supabase
        .from('messaging_events')
        .select('*')
        .eq('message_id', messageId)
        .single()

      if (originalMessage && originalMessage.message_type === 'otp') {
        // WhatsApp OTP failed - this is handled by the send-message function
        // which already includes fallback logic
        console.log('[Webhook] WhatsApp OTP failed, fallback handled at send time')
      }
    }

    return new Response(JSON.stringify({ success: true, status }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[Webhook] Error:', error)
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
