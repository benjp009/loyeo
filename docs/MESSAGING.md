# Loyeo — Messaging Infrastructure

> **Task:** TS-004 WhatsApp Business API + SMS fallback
> **Decision:** Council debate 2026-02-07 — Twilio as unified provider
> **Status:** Implementation complete, pending Twilio account setup

## Overview

Loyeo uses **Twilio** for all messaging: WhatsApp Business API (primary) and SMS (fallback for OTP). This provides a unified API, single phone number, and simplified operations.

### Why Twilio?

Council debate concluded:
1. **Unified provider** over fragmented stack (Meta + BSP + SMS provider)
2. **Supabase SMS is OTP-only** — can't send loyalty notifications
3. **Same Meta verification timeline** — Twilio doesn't add delay
4. **Cost delta negligible** — ~€30/month in Phase 1

Constraints:
- Pay-as-you-go only (no annual contracts)
- Cost alerts at €50/€100/€200 monthly
- Revisit at 25+ merchants or €500/month messaging cost

## Architecture

```
src/lib/messaging/
├── types.ts              # MessagingProvider interface, templates, costs
├── index.ts              # Provider factory (MESSAGING_PROVIDER env var)
└── providers/
    └── twilio.ts         # Twilio implementation with WhatsApp→SMS fallback

supabase/functions/
├── send-message/         # Edge function for sending (OTP, templates, SMS)
└── messaging-webhook/    # Twilio delivery status webhook handler

supabase/migrations/
└── 20260207000000_messaging_events.sql  # Cost monitoring table
```

## Environment Variables

Add to `.env.local` (and Vercel/Supabase dashboard):

```bash
# Messaging provider selection
MESSAGING_PROVIDER=twilio  # or 'mock' for testing

# Twilio credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+337xxxxxxxx  # French mobile number
TWILIO_WHATSAPP_NUMBER=whatsapp:+337xxxxxxxx

# WhatsApp template Content SIDs (created in Twilio Console after Meta approval)
TWILIO_TEMPLATE_OTP=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_WELCOME=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_VISIT=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_REWARD_EARNED=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_REWARD_REDEEMED=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TEMPLATE_MARKETING=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook verification
TWILIO_WEBHOOK_URL=https://loyeo.fr/api/messaging-webhook
```

## WhatsApp Message Templates

Templates must be pre-approved by Meta via Twilio Console.

| Template Name | Category | Variables | French Text | Cost |
|---------------|----------|-----------|-------------|------|
| `otp_verification` | Authentication | `{{1}}` = code | "Votre code Loyeo: {{1}}" | €0.04 |
| `welcome` | Utility | `{{1}}` = merchant name | "Bienvenue chez {{1}}! Vous avez gagné votre premier tampon." | €0.04 |
| `visit_confirmation` | Session | `{{1}}` = current, `{{2}}` = threshold | "Tampon enregistré! {{1}}/{{2}} tampons" | FREE |
| `reward_earned` | Utility | `{{1}}` = reward description | "Bravo! Vous avez gagné: {{1}}" | €0.04 |
| `reward_redeemed` | Session | `{{1}}` = reward description | "Récompense utilisée: {{1}}" | FREE |
| `marketing` | Marketing | `{{1}}` = message | Custom promotional message | €0.07 |

**Session messages** (free) only work within 24h of consumer's last message.

## Usage

### From Next.js (client-side abstraction)

```typescript
import { getMessagingProvider } from '@/lib/messaging'

const provider = getMessagingProvider()

// Send OTP (WhatsApp first, SMS fallback)
const result = await provider.sendOTP({
  phone: '+33612345678',
  code: '123456',
  preferWhatsApp: true, // default
})

// Send template message
const result = await provider.sendWhatsAppTemplate({
  phone: '+33612345678',
  template: 'welcome',
  variables: { '1': 'Boulangerie Martin' },
})

// Send direct SMS
const result = await provider.sendSMS({
  phone: '+33612345678',
  message: 'Your custom message',
})
```

### From Supabase Edge Function

```typescript
// POST /send-message/otp
const response = await fetch(`${SUPABASE_URL}/functions/v1/send-message/otp`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    phone: '+33612345678',
    code: '123456',
  }),
})

// POST /send-message/template
const response = await fetch(`${SUPABASE_URL}/functions/v1/send-message/template`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    phone: '+33612345678',
    template: 'reward_earned',
    variables: { '1': '1 croissant offert' },
    isSessionMessage: false,
  }),
})
```

## Cost Monitoring

### Database Table: `messaging_events`

All messages are logged for cost tracking:

```sql
SELECT * FROM messaging_cost_daily;
-- date | channel | message_type | message_count | total_cost_eur | delivered_count | failed_count

SELECT * FROM messaging_cost_monthly;
-- month | channel | message_count | total_cost_eur
```

### Alert Thresholds

| Monthly Cost | Action |
|--------------|--------|
| €50 | Warning — review usage patterns |
| €100 | Alert — check for anomalies |
| €200 | Critical — investigate immediately |
| €500+ (3 months) | Revisit provider decision |

## Twilio Setup Checklist

### 1. Create Twilio Account
- [ ] Sign up at twilio.com (pay-as-you-go)
- [ ] Verify business email
- [ ] Add payment method (credit card)

### 2. Get Phone Number
- [ ] Buy French mobile number (+33 7...)
- [ ] Enable SMS capability
- [ ] Enable WhatsApp capability

### 3. WhatsApp Business Profile
- [ ] Request WhatsApp sender in Twilio Console
- [ ] Submit business documents (Kbis)
- [ ] Wait for Meta verification (2-7 days)

### 4. Create Message Templates
- [ ] Submit each template for Meta approval
- [ ] Wait for approval (24-48h per template)
- [ ] Copy Content SIDs to environment variables

### 5. Configure Webhooks
- [ ] Set status callback URL: `https://loyeo.fr/api/messaging-webhook`
- [ ] Enable webhook signature validation

### 6. Test
- [ ] Send test OTP via WhatsApp
- [ ] Force WhatsApp failure, verify SMS fallback
- [ ] Check `messaging_events` table for cost logging

## Fallback Logic

```
sendOTP(phone, code)
  │
  ├─→ Try WhatsApp template
  │     │
  │     ├─→ Success → Return (cost: €0.04)
  │     │
  │     └─→ Fail with error 63001/63003/63016/63024
  │           │
  │           └─→ Try SMS fallback
  │                 │
  │                 ├─→ Success → Return (cost: €0.05)
  │                 │
  │                 └─→ Fail → Return error
  │
  └─→ Fail with other error → Return error (no fallback)
```

## Migration Path

If we need to switch providers (cost, reliability issues):

1. **Abstraction layer in place** — `MessagingProvider` interface
2. **Implement new provider** — e.g., `providers/meta-cloud.ts`
3. **Change env var** — `MESSAGING_PROVIDER=meta-cloud`
4. **Update templates** — Same format, different submission UI
5. **Estimated effort** — 2-3 days

WhatsApp Business Account stays the same — only the BSP routing changes.

## Troubleshooting

### WhatsApp not delivering

1. Check Meta Business verification status in Twilio Console
2. Verify template is approved (not pending/rejected)
3. Check phone number format (must be E.164: `+33612345678`)
4. Review `messaging_events` table for error codes

### SMS not delivering

1. Verify phone number can send SMS (Twilio Console)
2. Check for carrier filtering (common with short codes)
3. Review error codes in `messaging_events`

### High costs

1. Query `messaging_cost_daily` for usage patterns
2. Check for failed message retries (loop detection)
3. Verify session messages are being used within 24h window
4. Consider if marketing messages can be batched

---

**Last updated:** 2026-02-07 (TS-004 implementation)
