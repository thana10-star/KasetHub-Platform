# Hybrid Offline CMS Content Strategy

KasetHub uses a hybrid content model for agriculture articles.

## Model

- Bundled offline content covers evergreen starter knowledge.
- Future Supabase CMS content can provide updated, longer, seasonal, or reviewed articles.
- Both layers should share compatible metadata: slug, category, title, summary, difficulty, reading time, safety notes, image metadata, and `futureCmsKey`.
- If online CMS content fails to load, the app can keep showing the bundled offline fallback.

## CMS Override Rules

Future CMS can override or extend article body content when:

- the CMS article maps to the same `futureCmsKey`
- the CMS item is published and reviewed
- safety disclaimers are present
- image metadata is optimized and includes Thai alt text
- source and review dates are available where needed

CMS should not silently remove offline safety notes.

## Content That Should Not Stay Hardcoded Forever

These article types should come from CMS rather than static bundled fixtures:

- seasonal pest/disease alerts
- commodity prices and market timing
- loan rates and repayment terms
- government scheme eligibility
- official deadlines
- sponsor or partner campaigns

## Current M65 Boundary

M65 does not add Supabase writes, CMS writes, external image loading, AI article generation, YouTube import, or sponsor injection.

## M66 CMS Override Contract

M66 adds local CMS override validation. Future CMS content may extend body content and update title/summary only when the CMS version is newer. CMS content must not remove required safety disclaimers, must not use external images in offline mode, and must provide freshness dates for seasonal, finance, government, loan, or rate-sensitive content.

Invalid CMS overrides fall back to the bundled offline article.

## M67 Full-content Draft Contract

M67 prepares five pilot full-content templates while keeping bundled offline fallback articles available. CMS can later provide reviewed full bodies, but the publish gate must still preserve required disclaimers, source review metadata, expert escalation notes, and image requirements.

## M70 Evidence And Release Planning

Offline article evidence packets should map to future CMS-side review records without forcing online content to replace offline fallback.

Future CMS can store evidence and release review rows, but the app must keep a separate human release gate. Completed metadata is not enough to publish a final article automatically.
