-- Migration: Create messaging_events table for cost monitoring
-- Task: TS-004 WhatsApp Business API + SMS fallback
-- Date: 2026-02-07
-- Decision: Council debate - Twilio as unified provider with cost monitoring

-- Create messaging_events table
-- Tracks all sent messages for cost analysis and debugging
CREATE TABLE IF NOT EXISTS messaging_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Message identification
    message_id TEXT, -- Twilio SID (e.g., SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)

    -- Message metadata
    message_type TEXT NOT NULL CHECK (message_type IN ('otp', 'template', 'sms')),
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms')),
    template_name TEXT, -- For template messages: otp_verification, welcome, etc.

    -- Status tracking
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'sent', 'delivered', 'read', 'failed', 'undelivered'
    )),

    -- Privacy-safe phone tracking (hashed)
    phone_hash TEXT NOT NULL,

    -- Cost tracking (in EUR cents)
    cost_cents INTEGER NOT NULL DEFAULT 0,

    -- Error details
    error_code TEXT,
    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for looking up by message_id (webhook updates)
CREATE INDEX IF NOT EXISTS idx_messaging_events_message_id
    ON messaging_events(message_id)
    WHERE message_id IS NOT NULL;

-- Index for status queries (debugging failed messages)
CREATE INDEX IF NOT EXISTS idx_messaging_events_status
    ON messaging_events(status, created_at DESC);

-- Index for cost analysis queries
CREATE INDEX IF NOT EXISTS idx_messaging_events_cost_analysis
    ON messaging_events(created_at, channel, message_type);

-- Enable RLS
ALTER TABLE messaging_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only service role can read/write
-- This table is internal for cost monitoring, not exposed to users
CREATE POLICY "Service role only" ON messaging_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messaging_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_messaging_events_updated_at
    BEFORE UPDATE ON messaging_events
    FOR EACH ROW
    EXECUTE FUNCTION update_messaging_events_updated_at();

-- Create view for daily cost summary (for monitoring alerts)
CREATE OR REPLACE VIEW messaging_cost_daily AS
SELECT
    DATE(created_at) as date,
    channel,
    message_type,
    COUNT(*) as message_count,
    SUM(cost_cents) as total_cost_cents,
    ROUND(SUM(cost_cents) / 100.0, 2) as total_cost_eur,
    COUNT(*) FILTER (WHERE status = 'delivered') as delivered_count,
    COUNT(*) FILTER (WHERE status IN ('failed', 'undelivered')) as failed_count
FROM messaging_events
GROUP BY DATE(created_at), channel, message_type
ORDER BY date DESC, channel, message_type;

-- Create view for monthly cost summary (for budget tracking)
CREATE OR REPLACE VIEW messaging_cost_monthly AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    channel,
    COUNT(*) as message_count,
    SUM(cost_cents) as total_cost_cents,
    ROUND(SUM(cost_cents) / 100.0, 2) as total_cost_eur
FROM messaging_events
GROUP BY DATE_TRUNC('month', created_at), channel
ORDER BY month DESC, channel;

-- Add comment for documentation
COMMENT ON TABLE messaging_events IS 'Tracks all WhatsApp and SMS messages for cost monitoring and debugging. Created as part of TS-004 (Council decision 2026-02-07).';
COMMENT ON COLUMN messaging_events.phone_hash IS 'SHA-256 hash of phone number for privacy-compliant tracking';
COMMENT ON COLUMN messaging_events.cost_cents IS 'Estimated cost in EUR cents. WhatsApp OTP: 4, Utility: 4, Session: 0, Marketing: 7, SMS: 5';
