# Offline Article CMS Migration Checklist

M72 does not run migrations. This checklist is for a future reviewed backend milestone.

Required before migration:

- schema review for article tables
- RLS review for public read vs editor-only draft/review records
- role policy review for editor/reviewer/release manager/admin boundaries
- release audit write contract review
- offline fallback test plan
- migration rollback script
- rollback validation checklist
- staging-only execution plan

Rollback must exist before any migration is run.

The frontend must never contain service-role keys, provider keys, or direct publish-write paths.

