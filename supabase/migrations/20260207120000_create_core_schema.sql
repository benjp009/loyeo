-- Migration: Create core Loyeo schema
-- Task: TS-005 Database Schema Implementation
-- Date: 2026-02-07
-- Description: Creates merchants, programs, consumers, enrollments, visits, and redemptions tables
--              with full RLS policies, indexes, and triggers

-- ============================================================================
-- PART 1: BASE TABLES
-- ============================================================================

-- merchants: Business accounts for loyalty programs
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication & Identity
    email TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,

    -- Business classification
    vertical TEXT NOT NULL CHECK (vertical IN ('boulangerie', 'restaurant', 'salon', 'retail', 'other')),

    -- Location
    address TEXT,
    city TEXT,
    postal_code TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),

    -- Contact & Branding
    phone TEXT,
    logo_url TEXT,

    -- Program settings
    redemption_pin TEXT NOT NULL DEFAULT '0000',

    -- Subscription
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
    stripe_customer_id TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE merchants IS 'Business accounts that run loyalty programs. Links to auth.users via email.';
COMMENT ON COLUMN merchants.slug IS 'URL-friendly identifier for merchant public pages (e.g., boulangerie-martin)';
COMMENT ON COLUMN merchants.redemption_pin IS '4-digit PIN for validating reward redemptions at POS';
COMMENT ON COLUMN merchants.vertical IS 'Business type: boulangerie, restaurant, salon, retail, or other';

-- consumers: End-users who earn loyalty rewards
CREATE TABLE consumers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication & Identity (phone-based auth)
    phone TEXT UNIQUE NOT NULL CHECK (phone ~ '^\+33[67]\d{8}$'),
    first_name TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE consumers IS 'End-users who participate in loyalty programs. Links to auth.users via phone (OTP auth).';
COMMENT ON COLUMN consumers.phone IS 'Phone number in E.164 format (French mobile: +33[67]XXXXXXXX)';

-- programs: Loyalty program configurations
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Ownership
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

    -- Program type
    type TEXT NOT NULL DEFAULT 'stamps' CHECK (type IN ('stamps', 'points')),

    -- Reward settings
    threshold INTEGER NOT NULL DEFAULT 10 CHECK (threshold > 0),
    reward_description TEXT NOT NULL,
    program_name TEXT,

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Anti-abuse
    cooldown_hours INTEGER NOT NULL DEFAULT 4 CHECK (cooldown_hours >= 0),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE programs IS 'Loyalty program configurations. Each merchant can have one active program.';
COMMENT ON COLUMN programs.threshold IS 'Number of stamps/points required to earn a reward';
COMMENT ON COLUMN programs.cooldown_hours IS 'Minimum hours between stamps for same consumer (anti-abuse)';

-- ============================================================================
-- PART 2: ACTIVITY TABLES
-- ============================================================================

-- enrollments: Consumer participation in programs
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    consumer_id UUID NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, -- Denormalized for query speed

    -- Progress tracking
    current_stamps INTEGER NOT NULL DEFAULT 0 CHECK (current_stamps >= 0),
    total_visits INTEGER NOT NULL DEFAULT 0 CHECK (total_visits >= 0),
    total_rewards_earned INTEGER NOT NULL DEFAULT 0 CHECK (total_rewards_earned >= 0),

    -- Cooldown tracking
    last_visit_at TIMESTAMPTZ,

    -- Wallet integration
    wallet_pass_serial TEXT UNIQUE,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate enrollments
    UNIQUE(consumer_id, program_id)
);

COMMENT ON TABLE enrollments IS 'Consumer participation in merchant loyalty programs. Tracks stamp progress and wallet pass ID.';
COMMENT ON COLUMN enrollments.merchant_id IS 'Denormalized from programs.merchant_id for faster dashboard queries';
COMMENT ON COLUMN enrollments.wallet_pass_serial IS 'Apple/Google Wallet pass identifier for push updates';

-- visits: Individual visit records
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    consumer_id UUID NOT NULL REFERENCES consumers(id) ON DELETE CASCADE, -- Denormalized
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, -- Denormalized

    -- Visit outcome
    stamped BOOLEAN NOT NULL DEFAULT TRUE,

    -- Timestamp (immutable record)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE visits IS 'Individual visit records. stamped=false when visit occurs within cooldown window.';
COMMENT ON COLUMN visits.stamped IS 'FALSE if visit was within cooldown period (visit recorded but no stamp given)';

-- redemptions: Reward redemption records
CREATE TABLE redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    consumer_id UUID NOT NULL REFERENCES consumers(id) ON DELETE CASCADE, -- Denormalized
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, -- Denormalized

    -- Snapshot of reward at redemption time
    reward_description TEXT NOT NULL,

    -- Timestamp (immutable record)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE redemptions IS 'Reward redemption records. reward_description is a snapshot (program may change later).';

-- ============================================================================
-- PART 3: INDEXES
-- ============================================================================

-- Consumer scan flow: Look up merchant by slug
CREATE INDEX idx_merchants_slug ON merchants(slug);

-- Consumer scan flow: Look up consumer by phone
CREATE INDEX idx_consumers_phone ON consumers(phone);

-- Consumer scan flow: Find existing enrollment
CREATE INDEX idx_enrollments_consumer_program ON enrollments(consumer_id, program_id);

-- Wallet pass updates: Find enrollment by pass serial
CREATE INDEX idx_enrollments_wallet_pass_serial
    ON enrollments(wallet_pass_serial)
    WHERE wallet_pass_serial IS NOT NULL;

-- Cooldown check: Get most recent visit for enrollment
CREATE INDEX idx_visits_enrollment_created ON visits(enrollment_id, created_at DESC);

-- Merchant dashboard: List enrollments
CREATE INDEX idx_enrollments_merchant ON enrollments(merchant_id, created_at DESC);

-- Merchant dashboard: List visits
CREATE INDEX idx_visits_merchant ON visits(merchant_id, created_at DESC);

-- Merchant dashboard: List redemptions
CREATE INDEX idx_redemptions_merchant ON redemptions(merchant_id, created_at DESC);

-- Consumer portal: List enrollments
CREATE INDEX idx_enrollments_consumer ON enrollments(consumer_id, created_at DESC);

-- Consumer portal: List visits
CREATE INDEX idx_visits_consumer ON visits(consumer_id, created_at DESC);

-- Consumer portal: List redemptions
CREATE INDEX idx_redemptions_consumer ON redemptions(consumer_id, created_at DESC);

-- Program management: Active programs for merchant
CREATE INDEX idx_programs_merchant_active
    ON programs(merchant_id)
    WHERE is_active = TRUE;

-- ============================================================================
-- PART 4: RLS POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumers ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- merchants policies
-- -----------------------------------------------------------------------------

-- Merchants can view their own profile
CREATE POLICY "Merchants can view own profile"
    ON merchants FOR SELECT
    TO authenticated
    USING (email = auth.jwt()->>'email');

-- Merchants can update their own profile
CREATE POLICY "Merchants can update own profile"
    ON merchants FOR UPDATE
    TO authenticated
    USING (email = auth.jwt()->>'email')
    WITH CHECK (email = auth.jwt()->>'email');

-- Public can view merchant public info (for merchant pages)
CREATE POLICY "Public can view merchant public info"
    ON merchants FOR SELECT
    TO anon
    USING (true);

-- Service role has full access
CREATE POLICY "Service role full access on merchants"
    ON merchants FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- consumers policies
-- -----------------------------------------------------------------------------

-- Consumers can view their own profile
CREATE POLICY "Consumers can view own profile"
    ON consumers FOR SELECT
    TO authenticated
    USING (phone = auth.jwt()->>'phone');

-- Consumers can update their own profile
CREATE POLICY "Consumers can update own profile"
    ON consumers FOR UPDATE
    TO authenticated
    USING (phone = auth.jwt()->>'phone')
    WITH CHECK (phone = auth.jwt()->>'phone');

-- Service role has full access (for OTP flow creating consumers)
CREATE POLICY "Service role full access on consumers"
    ON consumers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- programs policies
-- -----------------------------------------------------------------------------

-- Merchants can manage their own programs
CREATE POLICY "Merchants can manage own programs"
    ON programs FOR ALL
    TO authenticated
    USING (
        merchant_id IN (
            SELECT id FROM merchants WHERE email = auth.jwt()->>'email'
        )
    )
    WITH CHECK (
        merchant_id IN (
            SELECT id FROM merchants WHERE email = auth.jwt()->>'email'
        )
    );

-- Public can view active programs (for merchant public pages)
CREATE POLICY "Public can view active programs"
    ON programs FOR SELECT
    TO anon
    USING (is_active = true);

-- Service role has full access
CREATE POLICY "Service role full access on programs"
    ON programs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- enrollments policies
-- -----------------------------------------------------------------------------

-- Merchants can view enrollments for their programs
CREATE POLICY "Merchants can view own enrollments"
    ON enrollments FOR SELECT
    TO authenticated
    USING (
        merchant_id IN (
            SELECT id FROM merchants WHERE email = auth.jwt()->>'email'
        )
    );

-- Consumers can view their own enrollments
CREATE POLICY "Consumers can view own enrollments"
    ON enrollments FOR SELECT
    TO authenticated
    USING (
        consumer_id IN (
            SELECT id FROM consumers WHERE phone = auth.jwt()->>'phone'
        )
    );

-- Service role has full access (for visit recording, wallet pass creation)
CREATE POLICY "Service role full access on enrollments"
    ON enrollments FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- visits policies
-- -----------------------------------------------------------------------------

-- Merchants can view visits for their programs
CREATE POLICY "Merchants can view own visits"
    ON visits FOR SELECT
    TO authenticated
    USING (
        merchant_id IN (
            SELECT id FROM merchants WHERE email = auth.jwt()->>'email'
        )
    );

-- Consumers can view their own visits
CREATE POLICY "Consumers can view own visits"
    ON visits FOR SELECT
    TO authenticated
    USING (
        consumer_id IN (
            SELECT id FROM consumers WHERE phone = auth.jwt()->>'phone'
        )
    );

-- Service role has full access (for visit recording)
CREATE POLICY "Service role full access on visits"
    ON visits FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- redemptions policies
-- -----------------------------------------------------------------------------

-- Merchants can view redemptions for their programs
CREATE POLICY "Merchants can view own redemptions"
    ON redemptions FOR SELECT
    TO authenticated
    USING (
        merchant_id IN (
            SELECT id FROM merchants WHERE email = auth.jwt()->>'email'
        )
    );

-- Consumers can view their own redemptions
CREATE POLICY "Consumers can view own redemptions"
    ON redemptions FOR SELECT
    TO authenticated
    USING (
        consumer_id IN (
            SELECT id FROM consumers WHERE phone = auth.jwt()->>'phone'
        )
    );

-- Service role has full access (for redemption recording)
CREATE POLICY "Service role full access on redemptions"
    ON redemptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- PART 5: TRIGGERS
-- ============================================================================

-- Generic updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER trigger_merchants_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_consumers_updated_at
    BEFORE UPDATE ON consumers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 6: HELPER FUNCTIONS
-- ============================================================================

-- Function to generate a URL-safe slug from business name
CREATE OR REPLACE FUNCTION generate_slug(business_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Normalize: lowercase, replace spaces with hyphens, remove special chars
    base_slug := lower(trim(business_name));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '[^a-z0-9-]', '', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);

    -- Check for uniqueness, append number if needed
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM merchants WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_slug IS 'Generates a unique URL-safe slug from a business name';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
