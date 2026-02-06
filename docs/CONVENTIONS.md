# Loyeo — Coding Conventions

## Language & Framework

- **TypeScript** — strict mode, no `any` types unless absolutely necessary
- **Next.js 14** — App Router (not Pages Router)
- **React** — Server Components by default, `"use client"` only when needed
- **Tailwind CSS** — utility-first, no custom CSS unless unavoidable
- **shadcn/ui** — for all standard UI components (buttons, inputs, dialogs, etc.)

## File Naming

- **Components:** PascalCase (`MerchantCard.tsx`, `StampGrid.tsx`)
- **Pages/routes:** lowercase with hyphens via Next.js folder conventions (`app/dashboard/page.tsx`)
- **Utilities:** camelCase (`formatPhone.ts`, `calculateCooldown.ts`)
- **Types:** PascalCase, suffix with type kind (`Merchant`, `ProgramConfig`, `VisitRecord`)
- **Supabase migrations:** timestamp prefix (`20260206_001_create_merchants.sql`)

## Component Structure

```tsx
// 1. Imports (external, then internal, then types)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Merchant } from '@/types'

// 2. Types (if component-specific)
interface Props {
  merchant: Merchant
  onSave: (data: Merchant) => void
}

// 3. Component
export function MerchantCard({ merchant, onSave }: Props) {
  // hooks first
  // derived state
  // handlers
  // render
}
```

## Import Aliases

```
@/components → src/components
@/lib        → src/lib
@/types      → src/types
@/styles     → src/styles
```

## Supabase Patterns

### Client usage
```tsx
// Browser client (for client components)
import { createBrowserClient } from '@supabase/ssr'

// Server client (for server components, API routes)
import { createServerClient } from '@supabase/ssr'
```

### Database queries
- Always use typed queries with generated types from Supabase CLI
- Always handle errors explicitly (no silent failures)
- Use `.single()` when expecting one row, `.maybeSingle()` when row might not exist

### Edge Functions
- Used for operations requiring service role (cross-boundary operations)
- Named with kebab-case: `record-visit`, `generate-pass`, `send-otp`

## API Routes

- Located in `src/app/api/`
- Use Next.js Route Handlers (`route.ts`)
- Always validate input (use Zod)
- Always return proper HTTP status codes
- Always handle errors with try/catch

## Phone Numbers

- **Storage:** Always E.164 format (`+33612345678`)
- **Display:** French format (`06 12 34 56 78`)
- **Input:** Accept any French format, normalize to E.164 before storage
- **Validation:** Must be valid French mobile number (+336... or +337...)

## Dates & Times

- **Storage:** UTC (TIMESTAMPTZ in Postgres)
- **Display:** French locale (`DD/MM/YYYY`, `HH:mm`)
- **Cooldown calculation:** Compare UTC timestamps, not local time

## Internationalization

- All user-facing text in **French** by default
- Use constants/translations file, not hardcoded strings in components
- Error messages in French for consumer-facing, English acceptable for merchant dashboard (but French preferred)

## Git Conventions

- **Branches:** `feature/{task-id}-short-description` (e.g. `feature/ts-002-supabase-setup`)
- **Commits:** Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **PR titles:** `[TASK-ID] Description` (e.g. `[TS-002] Setup Supabase project with auth and schema`)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_KEY=
GOOGLE_WALLET_ISSUER_ID=3388000000023081993
APPLE_PASS_TYPE_ID=
APPLE_TEAM_ID=
```

`NEXT_PUBLIC_` prefix = exposed to browser. Everything else = server-only.

## Performance Rules

- Lighthouse score target: 90+ on all metrics
- Images: Use `next/image` with proper sizing
- Fonts: Load via `next/font/google` (Sora, DM Sans, Space Mono)
- No client-side data fetching for initial page loads — use Server Components
