# Offline Article Release Audit Readiness

M71 adds a local-only release audit readiness layer for offline agriculture articles.

Purpose:

- record attempted release events as fixtures
- show why release attempts remain blocked
- track reviewer/source/disclaimer/image changes as audit previews
- prove final publish remains blocked without explicit human release approval

Current status:

- no Supabase writes
- no backend CMS writes
- no production publish
- no AI article generation
- no external image/CDN loading
- no sponsor or affiliate injection

Audit event coverage:

- attempted publish
- blocked publish
- reviewer change
- source metadata change
- disclaimer change
- image review change
- release gate change
- automation bypass attempt

M71 keeps every release attempt as non-final. Audit data is bundled fixture data only.

