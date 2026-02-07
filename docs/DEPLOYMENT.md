# Loyeo — Deployment Guide

## Production URL

**https://loyeo.fr**

- Hosted on Vercel (cdg1 region — Paris)
- SSL automatically managed by Vercel
- DNS managed via Hostinger

## Preview Deploys

Every pull request automatically gets a preview deployment:
- URL pattern: `loyeo-git-{branch-name}-{team}.vercel.app`
- Uses development Supabase credentials (safe for testing)
- Automatically deleted when PR is merged/closed

## Environment Variables

### Scoping Rules

| Variable | Development | Preview | Production |
|----------|:-----------:|:-------:|:----------:|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | ✓ | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | ✓ | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✗ | ✗ | ✓ |
| `NEXT_PUBLIC_APP_URL` | ✓ | ✓ | ✓ |

**Security rule**: `SUPABASE_SERVICE_ROLE_KEY` is **Production only** to prevent accidental data operations from preview branches.

### Adding/Updating Variables

1. Go to [Vercel Dashboard](https://vercel.com) > Loyeo project
2. Settings > Environment Variables
3. Add or edit the variable
4. Select appropriate environment scope(s)
5. Redeploy for changes to take effect

## Deployment Regions

- **Functions**: `cdg1` (Paris) — RGPD compliance
- **Edge**: Global CDN with EU primary

Configured in `vercel.json`:
```json
{
  "regions": ["cdg1"]
}
```

## DNS Configuration (Hostinger)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

## Deployment Workflow

1. **Development**: Work locally with `pnpm dev`
2. **Preview**: Push branch, create PR → automatic preview deploy
3. **Production**: Merge to `main` → automatic production deploy

## Rollback

If a production deploy has issues:
1. Go to Vercel Dashboard > Deployments
2. Find the last working deployment
3. Click "..." > "Promote to Production"

## Monitoring

- Build logs: Vercel Dashboard > Deployments > [deployment] > Build Logs
- Runtime logs: Vercel Dashboard > Logs (Functions tab)
- Analytics: Vercel Dashboard > Analytics (if enabled)

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Tech stack and database schema
- [CONVENTIONS.md](./CONVENTIONS.md) — Code standards
