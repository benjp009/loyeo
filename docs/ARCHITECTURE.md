# Loyeo — Architecture & Technical Reference

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui | Web app (merchant dashboard, consumer pages, landing page) |
| Backend | Supabase (Auth, PostgreSQL, Storage, Edge Functions) | BaaS — no separate backend server |
| Hosting | Vercel | Deployment (cdg1 region), preview deploys on PR, loyeo.fr domain |
| Payments | Stripe | Subscription billing (€29/€49 monthly, 3-month cycles) |
| Messaging | WhatsApp Business API (primary) + SMS fallback (OTP only) | OTP verification, notifications, marketing |
| Wallet | Apple PassKit + Google Wallet API | Loyalty card passes |
| Maps | Leaflet + OpenStreetMap | Consumer portal nearby merchants |
| Analytics | Plausible or Umami | RGPD-compliant, cookie-free |

## Google Cloud / Wallet Credentials

- **Project ID:** loyeo-486521
- **Project Number:** 570550821495
- **Merchant ID:** BCR2DN5T53AZFVRX
- **Service Account:** loyeo-wallet-sa@loyeo-486521.iam.gserviceaccount.com
- **Issuer ID:** 3388000000023081993

## Database Schema (Supabase PostgreSQL)

### `merchants`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique merchant ID |
| email | TEXT | UNIQUE, NOT NULL | Login email |
| business_name | TEXT | NOT NULL | Display name (e.g. "Boulangerie Martin") |
| slug | TEXT | UNIQUE, NOT NULL | URL slug (e.g. "boulangerie-martin") |
| vertical | TEXT | NOT NULL | boulangerie / restaurant / salon / retail / other |
| address | TEXT | — | Street address |
| city | TEXT | — | City name |
| postal_code | TEXT | — | Code postal |
| latitude | DECIMAL | — | For geo features |
| longitude | DECIMAL | — | For geo features |
| phone | TEXT | — | Contact phone |
| logo_url | TEXT | — | Logo image (Supabase Storage) |
| redemption_pin | TEXT | NOT NULL, DEFAULT '0000' | 4-digit PIN for reward validation |
| plan | TEXT | DEFAULT 'free' | free / starter / pro |
| stripe_customer_id | TEXT | — | Stripe customer reference |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | — |

### `programs`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique program ID |
| merchant_id | UUID | FK → merchants.id, NOT NULL | Owning merchant |
| type | TEXT | NOT NULL, DEFAULT 'stamps' | stamps / points |
| threshold | INTEGER | NOT NULL, DEFAULT 10 | Stamps/points needed for reward |
| reward_description | TEXT | NOT NULL | e.g. "1 croissant offert" |
| program_name | TEXT | — | e.g. "Carte Fidélité Boulangerie Martin" |
| is_active | BOOLEAN | DEFAULT TRUE | — |
| cooldown_hours | INTEGER | DEFAULT 4 | Min hours between stamps per consumer |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | — |

### `consumers`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique consumer ID |
| phone | TEXT | UNIQUE, NOT NULL | Phone number (E.164 format, e.g. +33612345678) |
| first_name | TEXT | — | Optional |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | — |

### `enrollments`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Consumer × Program join |
| consumer_id | UUID | FK → consumers.id, NOT NULL | — |
| program_id | UUID | FK → programs.id, NOT NULL | — |
| merchant_id | UUID | FK → merchants.id, NOT NULL | Denormalized for query speed |
| current_stamps | INTEGER | DEFAULT 0 | Current stamp count toward reward |
| total_visits | INTEGER | DEFAULT 0 | Lifetime visits to this merchant |
| total_rewards_earned | INTEGER | DEFAULT 0 | Lifetime rewards earned |
| last_visit_at | TIMESTAMPTZ | — | For cooldown enforcement & analytics |
| wallet_pass_serial | TEXT | — | Apple/Google Wallet pass ID |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Enrollment date |

**Unique constraint:** (consumer_id, program_id)

### `visits`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Individual visit record |
| enrollment_id | UUID | FK → enrollments.id, NOT NULL | — |
| consumer_id | UUID | FK → consumers.id, NOT NULL | — |
| merchant_id | UUID | FK → merchants.id, NOT NULL | Denormalized |
| stamped | BOOLEAN | DEFAULT TRUE | FALSE if within cooldown window |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Visit timestamp |

### `redemptions`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Reward redemption record |
| enrollment_id | UUID | FK → enrollments.id, NOT NULL | — |
| consumer_id | UUID | FK → consumers.id, NOT NULL | — |
| merchant_id | UUID | FK → merchants.id, NOT NULL | — |
| reward_description | TEXT | NOT NULL | Snapshot of reward at time of redemption |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | — |

## RLS (Row Level Security) Policies

All tables must have RLS enabled. Key rules:
- **Merchants** can only read/write their own row and their related programs, enrollments, visits, redemptions.
- **Consumers** can read their own enrollments, visits, redemptions. Cannot modify stamp counts directly.
- **Edge Functions** use service role key for operations that cross merchant/consumer boundaries (e.g. recording a visit).
- **Public access** to merchant public pages (slug-based lookup) — read-only on merchant name, logo, program info.

## WhatsApp Message Templates & Costs

| Template | Category | Cost per message |
|----------|----------|-----------------|
| OTP verification | Authentication | €0.04 (SMS fallback: €0.05) |
| Welcome message | Utility | €0.04 |
| Visit confirmation | Session (within 24h) | FREE |
| Reward earned | Utility | €0.04 |
| Reward redeemed | Session | FREE |
| Marketing (inactive, birthday, promo) | Marketing | €0.07 |

**Typical consumer lifecycle cost:** ~€0.12 to first reward (vs €0.20+ with SMS only)

## URL Structure

- `loyeo.fr` — Landing page (marketing site)
- `loyeo.fr/{merchant-slug}` — Merchant public page (QR landing)
- `loyeo.fr/dashboard` — Merchant dashboard (authenticated)
- `loyeo.fr/my` — Consumer portal (authenticated)
- `loyeo.fr/api/*` — Next.js API routes

## Project Structure (Monorepo)

```
loyeo/
├── docs/                    # ← These reference docs
│   ├── CLAUDE.md
│   ├── PROJECT_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── BRAND_GUIDE.md
│   ├── TASK_TRACKER.md
│   └── CONVENTIONS.md
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (marketing)/     # Landing page, pricing
│   │   ├── (merchant)/      # Dashboard pages (protected)
│   │   ├── (consumer)/      # Consumer portal (protected)
│   │   ├── [slug]/          # Merchant public pages
│   │   └── api/             # API routes
│   ├── components/          # Shared UI components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ...
│   ├── lib/                 # Utilities, Supabase client, helpers
│   ├── styles/              # Global styles, Tailwind config
│   └── types/               # TypeScript types
├── supabase/
│   ├── migrations/          # SQL migrations
│   └── seed.sql             # Seed data
├── public/                  # Static assets, logos
├── .env.local               # Environment variables (not committed)
├── CLAUDE.md                # → Symlink or copy of docs/CLAUDE.md
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
