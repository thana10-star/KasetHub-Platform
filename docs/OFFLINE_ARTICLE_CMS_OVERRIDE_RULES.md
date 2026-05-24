# Offline Article CMS Override Rules

M66 defines local CMS override rules for future Supabase content.

## Allowed

- CMS can extend article body content.
- CMS can update title or summary when the CMS version is newer.
- CMS can provide reviewed full content while the bundled article remains fallback.

## Blocked

- CMS cannot remove required safety disclaimers.
- CMS cannot replace offline-mode images with external URLs.
- CMS cannot remove offline fallback availability.
- CMS cannot add hidden sponsor, affiliate, product, or official-claim content.

## Freshness Requirements

Seasonal, finance, government scheme, loan, and rate-sensitive content must show a freshness date from CMS. These topics should not remain hardcoded forever.

## Current Status

The service `offline-agri-cms-override.ts` validates local payload fixtures only. It does not fetch CMS content and does not write Supabase data.

## M72 Persistence Boundary

CMS override rows should never become release approval by themselves.

Future `article_cms_overrides` must stay connected to release gate checks, release audit events, and offline fallback policy. If an override removes disclaimers or fails release evidence, the bundled offline article remains available.
