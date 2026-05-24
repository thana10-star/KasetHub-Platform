# CMS SQL Draft Artifacts

PLANNING ONLY. DO NOT RUN. DO NOT DEPLOY. REVIEW REQUIRED.

These files are draft artifacts for future KasetHub article CMS persistence planning.

They are intentionally stored under `supabase/drafts/cms/`, not `supabase/migrations/`.

Current boundary:

- no migration execution
- no Supabase writes
- no backend CMS writes
- no production article publishing
- no frontend CMS write path

Draft files:

- `0002_cms_articles_schema_draft.sql`
- `0002_cms_articles_rls_draft.sql`
- `0002_cms_articles_seed_draft.sql`
- `0002_cms_articles_rollback_draft.sql`

Future use requires human review, staging-only migration planning, RLS review, rollback review, seed review, and proof that the human release gate remains required.

