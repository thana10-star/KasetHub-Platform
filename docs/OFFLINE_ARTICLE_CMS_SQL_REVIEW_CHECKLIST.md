# Offline Article CMS SQL Review Checklist

Before any future SQL draft can become a staging migration, reviewers must confirm:

- schema tables match the CMS persistence contract
- RLS blocks public writes and unpublished draft reads
- editor and reviewer roles are scoped to their own responsibilities
- release manager cannot bypass audit requirements
- admin cannot silently bypass the human release gate
- automation cannot final publish
- service-role access is backend-only
- seed fixtures contain no official claims, sponsor content, or final publish state
- rollback order is reviewed and has a backup plan
- offline bundled articles remain available as fallback

M74 does not run SQL. The checklist is planning-only.

