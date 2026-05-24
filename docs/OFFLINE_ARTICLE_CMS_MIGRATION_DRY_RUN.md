# Offline Article CMS Migration Dry Run

M73 prepares a dry-run review pack for future offline/online article CMS persistence.

Current boundary:

- no migration execution
- no Supabase writes
- no backend CMS writes
- no production article publishing
- no image upload
- no AI article generation

The dry-run review covers:

- future table DDL review planning
- RLS expectation planning
- rollback planning
- seed fixture planning
- publish safety gate planning

Future tables under review:

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

M73 is a review pack only. SQL must not run from the frontend.

