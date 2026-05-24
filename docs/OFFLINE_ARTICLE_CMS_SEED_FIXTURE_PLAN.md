# Offline Article CMS Seed Fixture Plan

M73 plans seed fixtures only. No inserts occur.

Seed fixture groups:

- starter offline article import
- article categories
- article review fixtures
- release gate fixtures
- fallback article fixtures

Seed rules:

- seed only reviewed fixture shapes in a future staging milestone
- do not seed final publish without human release gate evidence
- do not seed sponsor or affiliate content into education articles
- do not seed external image URLs for offline mode
- do not seed official finance, loan, or government claims without freshness metadata
- keep bundled offline fallback available

M73 keeps every fixture as local planning data.

