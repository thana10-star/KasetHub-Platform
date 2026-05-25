# Offline Article CMS Fallback Policy

KasetHub keeps bundled offline agriculture articles as a fallback even after future CMS content exists.

Fallback is required when:

- CMS is unavailable
- CMS content fails validation
- CMS override removes required disclaimers
- CMS uses external image URLs for offline mode
- CMS content is stale for seasonal, finance, government, loan, or rate-sensitive content
- release audit or human release approval is missing

Fallback behavior:

- show bundled offline article
- keep safety disclaimers visible
- keep planned image fallback
- do not hide that content is offline/basic
- do not inject sponsor or affiliate content

M72 only plans this policy. It does not fetch CMS content or write database records.

## M73 Seed And Rollback Boundary

Seed fixture plans must prove that invalid CMS content falls back to bundled offline articles. Rollback must not remove bundled offline fallback content.

M73 does not insert seed rows and does not run rollback or migration scripts.
