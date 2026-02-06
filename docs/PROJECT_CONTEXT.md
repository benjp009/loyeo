# Loyeo — Project Context

## What Is Loyeo

Loyeo is a B2B SaaS digital loyalty platform for French independent merchants (boulangeries, restaurants, salons, retail). Merchants subscribe monthly, set up a stamp/points-based loyalty program, and their customers earn rewards by scanning a QR code at the point of sale. Loyalty cards live in Apple Wallet / Google Wallet — no app download required.

## Business Model

- **Target:** Independent French merchants (700K+ proximity businesses in France)
- **Primary vertical:** Boulangeries (43,723 establishments), then restaurants (117K), salons (126K)
- **Pricing:** €29/month Starter, €49/month Pro — 3-month billing cycles, no long-term commitment
- **Revenue model:** SaaS subscription only. No transaction fees, no per-message charges to merchants.
- **Growth mechanics:** Uncapped merchant referral program (10% stacking discounts). Viral consumer acquisition through wallet passes.
- **Success metric:** 100 merchants + €3K MRR within 24-week timeline
- **Financial projections:** Break-even at Month 2, €75K ARR by Month 12 with 223 merchants

## Key Competitive Differentiators vs Zerosix (€49/mo) and Beefid (€25/mo)

1. Lower price point with comprehensive features (€29-49 vs Zerosix €49+€190 setup)
2. WhatsApp-first notifications (cheaper, higher engagement than SMS)
3. Apple + Google Wallet integration (not all competitors have both)
4. Zero-friction enrollment (QR scan → phone number → wallet pass in under 30 seconds)
5. No merchant app or hardware required (web dashboard only)

## Project Timeline — 24 Weeks, 6 Phases

### Phase 0 — Foundation & Branding (Weeks 1-2) ← CURRENT PHASE (~70% complete)
**Completed:**
- [BR-001] Brand name & domain ✅
- [BR-002] Logo & visual identity ✅
- [BR-003] Brand guidelines document ✅
- [LG-001] Company registration / UGITECH scope update ✅
- [LG-002] CGV / CGU / Privacy Policy drafts ✅
- [LG-003] Apple Developer Program enrollment ✅
- [LG-004] Google Wallet API access setup ✅
- [TS-001] GitHub repo & project structure ✅

**Remaining:**
- [TS-002] Setup Supabase project (auth, schema, RLS)
- [TS-003] Setup Vercel deployment (domains, env vars)
- [TS-004] Setup WhatsApp Business API + SMS fallback
- [TS-005] Design & implement database schema
- [BR-004] Merchant-facing pitch deck
- Domain issue: loyeo.com expired, needs resolution

### Phase 1 — MVP Build (Weeks 3-6)
**Landing Page:**
- [LP-001] Design landing page wireframe
- [LP-002] Build landing page (Next.js)
- [LP-003] Implement merchant signup flow
- [LP-004] SEO & meta tags setup

**Merchant Dashboard (8 tasks):**
- [MD-001] Merchant auth flow (login/signup)
- [MD-002] Dashboard home / overview page (KPI cards)
- [MD-003] Program configuration page
- [MD-004] QR code generation & display
- [MD-005] Customer list view
- [MD-006] Redemption validation PIN setup
- [MD-007] Activity feed / recent events
- [MD-008] Merchant profile & settings

**Consumer Scan Flow (7 tasks):**
- [CS-001] Merchant public page (QR landing)
- [CS-002] New consumer registration (WhatsApp/SMS OTP)
- [CS-003] Return consumer recognition
- [CS-004] Visit stamp recording logic
- [CS-005] Reward earned celebration screen
- [CS-006] Reward redemption flow (PIN entry)
- [CS-007] New merchant enrollment (existing consumer)

**Wallet Integration (6 tasks):**
- [WI-001] Apple Wallet pass template design
- [WI-002] Apple Wallet pass generation API
- [WI-003] Apple Wallet pass update (push)
- [WI-004] Google Wallet pass generation
- [WI-005] Google Wallet pass update
- [WI-006] "Add to Wallet" button on consumer pages

### Phase 2 — Consumer Portal & Polish (Weeks 7-8)
- [CP-001] Consumer login page (phone OTP)
- [CP-002] My Rewards dashboard
- [CP-003] Individual program detail view
- [CP-004] Nearby merchants discovery (map/list)
- [CP-005] Push notification opt-in
- [QA-001] End-to-end flow testing (new consumer)
- [QA-002] End-to-end flow testing (multi-merchant)
- [QA-003] Mobile responsive QA pass

### Phase 3 — Pilot Launch (Weeks 9-12)
- [S5-001] Build merchant prospect list
- [S5-002] Wave 1 sales outreach (5-10 merchants)
- [S5-003] Print QR stands & leave-behind materials
- [S6-001] Wave 2 pilot expansion (15+ merchants)
- [S6-002] Collect pilot metrics & draft case study

### Phase 4 — Monetization (Weeks 13-16)
- [S7-001] Stripe subscription integration
- [S7-002] Build pricing page
- [S7-003] Feature gating by subscription tier
- [S7-004] Convert pilots to paid customers 🎯
- [S8-001] Wave 3 outreach (50 merchants)
- [S8-002] Implement merchant referral program
- [S8-003] Social presence & content marketing

### Phase 5 — Growth & Scale (Weeks 17-24)
- [S9-001] Build promo boost system (paid promotions)
- [S9-002] Automated marketing campaigns
- [S9-003] Distributor partnership outreach
- [S10-001] Points-based loyalty system
- [S10-002] Receipt digitization (AGEC compliance)
- [S10-003] Multi-location merchant support
- [S11] 100 merchants & €3K MRR milestone 🎯

## Core User Flows

### Flow 1: New consumer, first scan ever
1. Consumer scans QR code at merchant → opens `loyeo.com/{merchant-slug}`
2. Merchant public page loads: logo, program info, "Rejoindre" CTA
3. Consumer enters phone number → receives WhatsApp OTP (SMS fallback)
4. Consumer verifies OTP → account created, enrolled in merchant's program
5. First stamp recorded automatically
6. "Add to Apple/Google Wallet" prompt → pass saved to phone wallet
7. Welcome WhatsApp message sent

### Flow 2: Returning consumer, same merchant
1. Consumer scans same QR code OR opens wallet pass → recognized by phone/pass
2. Stamp recorded (if outside cooldown window, default 4 hours)
3. Wallet pass updates automatically (stamp count increments)
4. If threshold reached → reward earned celebration + WhatsApp notification

### Flow 3: Existing consumer, new merchant
1. Consumer scans new merchant's QR → recognized by phone number
2. Auto-enrolled in new merchant's program (no re-registration)
3. First stamp recorded, new wallet pass generated for this merchant
4. Existing account, new program added to consumer portal

## Taglines (approved French)
- "Vos clients reviennent, votre commerce grandit."
- "Scannez, cumulez, profitez."
- "La fidélité, simplifiée."
