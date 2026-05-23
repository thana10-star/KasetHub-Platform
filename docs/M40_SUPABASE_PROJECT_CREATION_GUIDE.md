# M40 Supabase Project Creation Guide

M40 prepares a human operator to create the first real Supabase staging project later. This guide is manual only. The app does not create the project, connect to Supabase, add keys, run SQL, enable auth, or write data.

## Required Project Boundary

Create a new Supabase project for staging only.

Recommended project name:

```text
kasethub-staging
```

Stop if you are looking at a production project, a project with real user data, or a project whose name does not clearly say staging.

## Region

Choose a region close to Thailand if available.

Recommended order:

1. Singapore or Southeast Asia region, if available.
2. Other Asia region close to Thailand.
3. A temporary staging region only if you record the reason.

Do not optimize production architecture in M40. The goal is a safe staging project for SQL/RLS rehearsal.

## Values To Save Locally Only

After project creation, save these locally for later `.env.local` setup:

- Project URL
- anon public key

Do not commit them.

Do not copy the service-role key into frontend env, docs, screenshots, README, reports, browser logs, or Cloudflare Pages public variables.

## Dashboard Locations

Find these Supabase Dashboard areas before running anything:

- SQL Editor: used for manual schema/RLS execution.
- Authentication settings: used later for phone OTP staging, not M40.
- Storage settings: used later for plant image storage planning, not M40.
- Edge Functions: used later for Guest Sync/AI proxy functions, not M40.
- Table Editor: used after SQL to verify created tables.
- Authentication > Policies or table policy view: used after SQL to verify RLS.

## Do Not Enable Yet

Do not enable in M40:

- real auth
- phone OTP
- cloud sync
- uploads/storage buckets
- Edge Functions
- AI providers
- service-role-backed jobs
- production redirects

## Evidence To Keep

Capture screenshots without secrets:

- project name showing staging
- selected region
- SQL Editor location
- Table Editor location
- Authentication settings location
- Storage settings location
- Edge Functions location

Do not include keys or connection strings in screenshots.

## Next Step

After project creation, read:

- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`
- `/app/supabase-sql-checklist`

