# Offline Article CMS SQL Draft Artifacts

M74 adds checked-in SQL draft artifacts for the future article CMS database.

Location:

- `supabase/drafts/cms/`

Draft files:

- `0002_cms_articles_schema_draft.sql`
- `0002_cms_articles_rls_draft.sql`
- `0002_cms_articles_seed_draft.sql`
- `0002_cms_articles_rollback_draft.sql`
- `README.md`

Every draft is marked:

- `PLANNING ONLY`
- `DO NOT RUN`
- `DO NOT DEPLOY`
- `REVIEW REQUIRED`

These files are intentionally not in `supabase/migrations`. They are not executed by the app, not wired to runtime, and not a production schema.

M74 keeps:

- no migrations run
- no Supabase writes
- no backend CMS writes
- no frontend CMS write path
- no production article publishing
- human release gate required

