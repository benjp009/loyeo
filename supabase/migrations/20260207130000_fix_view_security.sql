-- Migration: Fix SECURITY DEFINER warning on messaging views
-- Task: TS-004 fix
-- Date: 2026-02-07
-- Description: Recreates views with SECURITY INVOKER to address Supabase security warnings

-- Drop and recreate views with security_invoker = true
DROP VIEW IF EXISTS messaging_cost_daily;
DROP VIEW IF EXISTS messaging_cost_monthly;

-- Recreate daily cost view with SECURITY INVOKER
CREATE VIEW messaging_cost_daily
WITH (security_invoker = true)
AS
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

-- Recreate monthly cost view with SECURITY INVOKER
CREATE VIEW messaging_cost_monthly
WITH (security_invoker = true)
AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    channel,
    COUNT(*) as message_count,
    SUM(cost_cents) as total_cost_cents,
    ROUND(SUM(cost_cents) / 100.0, 2) as total_cost_eur
FROM messaging_events
GROUP BY DATE_TRUNC('month', created_at), channel
ORDER BY month DESC, channel;

-- Add comments
COMMENT ON VIEW messaging_cost_daily IS 'Daily messaging cost breakdown by channel and type. Uses SECURITY INVOKER - requires service_role for access.';
COMMENT ON VIEW messaging_cost_monthly IS 'Monthly messaging cost summary by channel. Uses SECURITY INVOKER - requires service_role for access.';
