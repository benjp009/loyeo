-- Loyeo seed data for development and testing
-- Task: TS-005 Database Schema Implementation
-- Date: 2026-02-07

-- ============================================================================
-- MERCHANTS (3 sample businesses)
-- ============================================================================

INSERT INTO merchants (id, email, business_name, slug, vertical, address, city, postal_code, phone, redemption_pin, plan) VALUES
    ('11111111-1111-1111-1111-111111111111', 'contact@boulangerie-martin.fr', 'Boulangerie Martin', 'boulangerie-martin', 'boulangerie', '12 Rue du Pain', 'Paris', '75011', '+33145678901', '1234', 'starter'),
    ('22222222-2222-2222-2222-222222222222', 'hello@le-petit-bistrot.fr', 'Le Petit Bistrot', 'le-petit-bistrot', 'restaurant', '45 Avenue de la Republique', 'Lyon', '69003', '+33478901234', '5678', 'pro'),
    ('33333333-3333-3333-3333-333333333333', 'info@salon-beaute-marie.fr', 'Salon Beaute Marie', 'salon-beaute-marie', 'salon', '8 Place du Marche', 'Marseille', '13001', '+33491234567', '9012', 'free');

-- ============================================================================
-- PROGRAMS (1 per merchant)
-- ============================================================================

INSERT INTO programs (id, merchant_id, type, threshold, reward_description, program_name, is_active, cooldown_hours) VALUES
    ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'stamps', 10, '1 croissant offert', 'Carte Fidelite Boulangerie Martin', true, 4),
    ('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'stamps', 8, '1 dessert offert', 'Programme Gourmand Le Petit Bistrot', true, 24),
    ('aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'stamps', 5, '1 soin visage offert', 'Club Beaute Marie', true, 48);

-- ============================================================================
-- CONSUMERS (5 sample customers)
-- ============================================================================

INSERT INTO consumers (id, phone, first_name) VALUES
    ('cccc1111-1111-1111-1111-111111111111', '+33612345678', 'Sophie'),
    ('cccc2222-2222-2222-2222-222222222222', '+33623456789', 'Pierre'),
    ('cccc3333-3333-3333-3333-333333333333', '+33634567890', 'Marie'),
    ('cccc4444-4444-4444-4444-444444444444', '+33645678901', 'Lucas'),
    ('cccc5555-5555-5555-5555-555555555555', '+33656789012', 'Emma');

-- ============================================================================
-- ENROLLMENTS (consumers enrolled in various programs)
-- ============================================================================

INSERT INTO enrollments (id, consumer_id, program_id, merchant_id, current_stamps, total_visits, total_rewards_earned, last_visit_at, wallet_pass_serial) VALUES
    -- Sophie: enrolled at boulangerie (7 stamps, close to reward!)
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 7, 17, 1, NOW() - INTERVAL '2 days', 'loyeo.boulangerie-martin.a1b2c3'),
    -- Sophie: also enrolled at restaurant (3 stamps)
    ('eeee1112-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 3, 3, 0, NOW() - INTERVAL '1 week', 'loyeo.le-petit-bistrot.a1b2c3'),
    -- Pierre: enrolled at boulangerie (2 stamps)
    ('eeee2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 2, 2, 0, NOW() - INTERVAL '5 days', 'loyeo.boulangerie-martin.d4e5f6'),
    -- Marie: enrolled at salon (4 stamps, close to reward!)
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', 'aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 4, 9, 1, NOW() - INTERVAL '3 days', 'loyeo.salon-beaute-marie.g7h8i9'),
    -- Lucas: enrolled at restaurant (full card, ready to redeem!)
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', 'aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 8, 8, 0, NOW() - INTERVAL '1 day', 'loyeo.le-petit-bistrot.j1k2l3'),
    -- Emma: just enrolled at boulangerie (1 stamp)
    ('eeee5555-5555-5555-5555-555555555555', 'cccc5555-5555-5555-5555-555555555555', 'aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 1, 1, 0, NOW() - INTERVAL '1 hour', 'loyeo.boulangerie-martin.m4n5o6');

-- ============================================================================
-- VISITS (sample visit history)
-- ============================================================================

-- Sophie's visits at boulangerie (17 visits total, 1 reward earned = 10 stamped + 7 current)
INSERT INTO visits (enrollment_id, consumer_id, merchant_id, stamped, created_at) VALUES
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '30 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '28 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '25 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '22 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '20 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '18 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '15 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '12 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '10 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '8 days'), -- 10th stamp, reward earned!
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '7 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '6 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '5 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '4 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '3 days'),
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '3 days' + INTERVAL '2 hours'), -- Within cooldown!
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '2 days');

-- Pierre's visits at boulangerie
INSERT INTO visits (enrollment_id, consumer_id, merchant_id, stamped, created_at) VALUES
    ('eeee2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '10 days'),
    ('eeee2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '5 days');

-- Marie's visits at salon
INSERT INTO visits (enrollment_id, consumer_id, merchant_id, stamped, created_at) VALUES
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '60 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '50 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '40 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '30 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '20 days'), -- 5th stamp, reward earned!
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '15 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '10 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '5 days'),
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '3 days');

-- Lucas's visits at restaurant
INSERT INTO visits (enrollment_id, consumer_id, merchant_id, stamped, created_at) VALUES
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '21 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '18 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '15 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '12 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '9 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '6 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '3 days'),
    ('eeee4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '1 day'); -- 8th stamp, card full!

-- Emma's first visit at boulangerie
INSERT INTO visits (enrollment_id, consumer_id, merchant_id, stamped, created_at) VALUES
    ('eeee5555-5555-5555-5555-555555555555', 'cccc5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', true, NOW() - INTERVAL '1 hour');

-- Sophie's visits at restaurant
INSERT INTO visits (enrollment_id, consumer_id, merchant_id, stamped, created_at) VALUES
    ('eeee1112-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '14 days'),
    ('eeee1112-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '10 days'),
    ('eeee1112-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', true, NOW() - INTERVAL '7 days');

-- ============================================================================
-- REDEMPTIONS (past rewards claimed)
-- ============================================================================

INSERT INTO redemptions (enrollment_id, consumer_id, merchant_id, reward_description, created_at) VALUES
    -- Sophie's reward at boulangerie
    ('eeee1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '1 croissant offert', NOW() - INTERVAL '8 days'),
    -- Marie's reward at salon
    ('eeee3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '1 soin visage offert', NOW() - INTERVAL '20 days');

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Merchants: 3 (boulangerie, restaurant, salon)
-- Programs: 3 (one per merchant)
-- Consumers: 5 (Sophie, Pierre, Marie, Lucas, Emma)
-- Enrollments: 6 (some consumers at multiple merchants)
-- Visits: 34 (mix of stamped and cooldown-blocked)
-- Redemptions: 2 (Sophie and Marie each claimed 1 reward)
