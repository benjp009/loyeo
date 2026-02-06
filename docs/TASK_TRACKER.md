# Loyeo — Task Tracker

> **Last synced from ClickUp:** 2026-02-06
> **Current phase:** Phase 0 — Foundation & Branding (finishing up)
> **Next phase:** Phase 1 — MVP Build

## 🔴 Active Sprint — Phase 0 Remaining Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| TS-002 | Setup Supabase project | Critical | DONE ✅ | Supabase project created (EU West), phone OTP + email auth enabled, client utilities + middleware configured. Schema deferred to TS-005. |
| TS-003 | Setup Vercel deployment | High | TO DO | Connect GitHub, configure domains, env vars, preview deploys on PR. Depends on TS-001 + BR-001 (domain). |
| TS-004 | Setup WhatsApp Business API + SMS fallback | High | TO DO | WhatsApp Business API primary. SMS fallback for OTP only. Depends on TS-002. |
| TS-005 | Design & implement database schema | Critical | TO DO | Full schema (see ARCHITECTURE.md). Indexes, RLS policies. Depends on TS-002. |
| BR-004 | Design merchant-facing pitch deck | Medium | TO DO | For sales outreach in Phase 3. |
| — | Loyeo.com domain expired | Blocker | TO DO | Domain needs renewal or re-purchase. |
| — | REF: Database Schema & Tech Stack Reference | Low | TO DO | Reference task in ClickUp with schema details. |

## ⬜ Next Up — Phase 1 Tasks (Weeks 3-6)

### Landing Page
| ID | Task | Depends On |
|----|------|-----------|
| LP-001 | Design landing page wireframe | BR-002 ✅ |
| LP-002 | Build landing page (Next.js) | LP-001, TS-003 |
| LP-003 | Implement merchant signup flow | LP-002, TS-002 |
| LP-004 | SEO & meta tags setup | LP-002 |

### Merchant Dashboard
| ID | Task | Depends On |
|----|------|-----------|
| MD-001 | Merchant auth flow (login/signup) | TS-002 |
| MD-002 | Dashboard home / overview page | MD-001 |
| MD-003 | Program configuration page | MD-001 |
| MD-004 | QR code generation & display | MD-001 |
| MD-005 | Customer list view | MD-001 |
| MD-006 | Redemption validation PIN setup | MD-001 |
| MD-007 | Activity feed / recent events | MD-001 |
| MD-008 | Merchant profile & settings | MD-001 |

### Consumer Scan Flow
| ID | Task | Depends On |
|----|------|-----------|
| CS-001 | Merchant public page (QR landing) | TS-002 |
| CS-002 | New consumer registration (WhatsApp/SMS OTP) | CS-001, TS-004 |
| CS-003 | Return consumer recognition | CS-002 |
| CS-004 | Visit stamp recording logic | CS-003 |
| CS-005 | Reward earned celebration screen | CS-004 |
| CS-006 | Reward redemption flow (PIN entry) | CS-005 |
| CS-007 | New merchant enrollment (existing consumer) | CS-002 |

### Wallet Integration
| ID | Task | Depends On |
|----|------|-----------|
| WI-001 | Apple Wallet pass template design | BR-002 ✅ |
| WI-002 | Apple Wallet pass generation API | WI-001, LG-003 ✅ |
| WI-003 | Apple Wallet pass update (push) | WI-002 |
| WI-004 | Google Wallet pass generation | LG-004 ✅ |
| WI-005 | Google Wallet pass update | WI-004 |
| WI-006 | "Add to Wallet" button on consumer pages | WI-002, WI-004 |

## ✅ Completed (Phase 0)

- [BR-001] Define brand name & domain ✅
- [BR-002] Design logo & visual identity ✅
- [BR-003] Create brand guidelines document ✅
- [LG-001] Register company / update UGITECH scope ✅
- [LG-002] Draft CGV / CGU / Privacy Policy ✅
- [LG-003] Apple Developer Program enrollment ✅
- [LG-004] Google Wallet API access setup ✅
- [TS-001] Setup GitHub repo & project structure ✅
- [TS-002] Setup Supabase project (auth, client utilities, middleware) ✅

---

## How to Update This File

Before each Claude Code session:
1. Check ClickUp for any status changes
2. Update the status column for completed tasks
3. Move newly active tasks to the Active Sprint section
4. Note any new blockers or decisions
