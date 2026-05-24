# Offline Article CMS Persistence Contract

M72 plans the future backend-owned persistence contract for KasetHub agriculture articles.

Current status:

- no Supabase writes
- no migrations run
- no backend CMS writes
- no real CMS fetch
- no production article publishing

Future table groups:

- `articles`
- `article_versions`
- `article_full_body_versions`
- `article_source_reviews`
- `article_expert_reviews`
- `article_image_assets`
- `article_release_gates`
- `article_release_audit_events`
- `article_release_attempts`
- `article_reviewer_history`
- `article_cms_overrides`

Contract rules:

- reads expose only reviewed/published content to public users
- drafts and review state require editor-only access
- release audit writes must be backend-owned
- CMS override must preserve required safety disclaimers
- offline bundled content remains fallback when CMS content is invalid or unavailable
- human release gate remains required before publish

## M73 Migration Review Pack

M73 adds a dry-run migration review pack for this contract.

The pack reviews future table DDL expectations, RLS expectations, rollback planning, seed fixture planning, and publish safety gates. It still does not run migrations, write Supabase rows, or create a backend CMS endpoint.
