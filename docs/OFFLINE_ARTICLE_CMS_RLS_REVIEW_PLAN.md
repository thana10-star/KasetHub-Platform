# Offline Article CMS RLS Review Plan

M73 plans RLS expectations before any CMS migration is run.

Required rules:

- viewer cannot write
- public/anon cannot write
- editor cannot bypass release gate
- release manager cannot bypass audit requirement
- automation and service accounts cannot final publish directly
- public reads only approved published content
- unpublished drafts are blocked from anon/public
- release audit writes must be backend-owned

Public read scope:

- `articles`: approved and published rows only
- reviewed image metadata may be public only when attached to approved published rows

Editor/reviewer scope:

- drafts
- article versions
- source reviews
- expert reviews
- reviewer history
- CMS overrides

Release/admin scope:

- release gates
- release audit events
- release attempts

No real RLS execution occurs in M73.

## M74 RLS Draft Artifact

M74 adds `supabase/drafts/cms/0002_cms_articles_rls_draft.sql` as a planning-only RLS draft. The file contains reviewed policy intentions as commented draft SQL, not an executable migration.

The draft keeps these boundaries:

- public read only for released/published article versions
- unpublished drafts blocked from anon/public reads
- editors draft only
- reviewers scoped to their own review tables
- release manager blocked without audit requirements
- automation blocked from final publish
- admin blocked from silent human release gate bypass
- service role reserved for backend-only use
