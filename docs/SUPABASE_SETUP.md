# Loyeo — Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose your organization
4. **Project name:** `loyeo`
5. **Database password:** generate a strong password and save it
6. **Region:** EU West (Paris) — required for RGPD compliance
7. **Plan:** Free tier (sufficient for MVP)
8. Click **Create new project** and wait for provisioning

## 2. Configure Environment Variables

1. Go to **Project Settings > API**
2. Copy the following values into `.env.local` (create from `.env.example`):

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY` — `service_role` `secret` key (never expose to browser)

## 3. Enable Phone Auth (OTP)

1. Go to **Authentication > Providers**
2. Enable **Phone** provider
3. Supabase provides built-in phone OTP on the free tier (limited messages)
4. For production, configure a custom SMS provider (Twilio/MessageBird) under **Authentication > Providers > Phone > SMS Provider**

## 4. Configure Auth Settings

1. Go to **Authentication > URL Configuration**
2. Set **Site URL** to `http://localhost:3000` (update for production later)
3. Add redirect URLs:
   - `http://localhost:3000/**` (development)
   - `https://loyeo.com/**` (production, when domain is active)

## 5. Run Database Migrations (TS-005)

Once TS-005 migrations are written:

```bash
# Option A: Via Supabase CLI (recommended)
npx supabase db push

# Option B: Via Dashboard SQL Editor
# Copy each migration file and run in order:
# 1. 20260206_001_create_tables.sql
# 2. 20260206_002_create_indexes.sql
# 3. 20260206_003_enable_rls.sql
# 4. 20260206_004_create_triggers.sql
```

## 6. Generate TypeScript Types

After schema is deployed:

```bash
# Set your project ID
export SUPABASE_PROJECT_ID=your-project-ref

# Generate types
pnpm db:types
```

This overwrites `src/types/database.types.ts` with types matching your live schema.

## 7. Configure Storage Buckets (Later)

When needed for merchant logos and wallet passes:

1. Go to **Storage**
2. Create bucket `merchant-logos` (public)
3. Create bucket `wallet-passes` (private)
4. Add image domain to `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```
