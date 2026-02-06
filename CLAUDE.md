# LOYEO — Claude Code Project Instructions

You are working on **Loyeo**, a B2B SaaS loyalty platform for French independent merchants (boulangeries, restaurants, salons, retail). Before writing any code, **read all files in the `/docs` directory**.

## Required Reading Before Any Work

- `/docs/PROJECT_CONTEXT.md` — Always read first. Project scope, current phase, business rules.
- `/docs/ARCHITECTURE.md` — Tech stack, database schema, API structure, service accounts.
- `/docs/BRAND_GUIDE.md` — Colors, fonts, logo rules. Read before any UI/frontend work.
- `/docs/TASK_TRACKER.md` — Current sprint tasks from ClickUp. Check before starting work.
- `/docs/CONVENTIONS.md` — Coding standards, file structure, naming rules.

## Critical Rules

1. **Never guess business logic.** If a decision isn't documented, ask. Key examples: pricing tiers (€29 Starter / €49 Pro, 3-month billing), cooldown hours (4h default between stamps), redemption PIN (4-digit).
2. **French market first.** All user-facing text defaults to French. Phone numbers in E.164 format. RGPD compliance mandatory. Dates in DD/MM/YYYY for display.
3. **WhatsApp first, SMS fallback.** WhatsApp Business API is the primary notification channel. SMS is only for OTP fallback when WhatsApp is unavailable.
4. **Brand compliance.** Coral Red (#FF4D4D) for CTAs. Navy Dark (#1A1A2E) for text. Warm Cream (#FFF8F0) for backgrounds. Never use pure black (#000000). Never use pure white backgrounds for pages (use #FFF8F0).
5. **Supabase is the backend.** Auth, DB, Storage, Edge Functions — all through Supabase. No separate backend server.
6. **Wallet passes are core.** Apple Wallet + Google Wallet integration is not optional — it's central to the product.
