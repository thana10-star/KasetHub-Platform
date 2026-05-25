# Weather Offline Fallback UX

M77 keeps weather useful when the app has no network or Open-Meteo is disabled.

Fallback states:

- local fixture default
- Open-Meteo disabled
- production disabled
- stale cache after API failure
- no cache plus local fixture fallback

Required UI states:

- stale cache badge
- offline fallback badge
- API unavailable notice
- source attribution
- fetched time or cached time
- farmer-friendly disclaimer

The weather UI must keep guidance general. It may remind users to check rain and wind before farm work, but it must not provide exact chemical instructions, legal thresholds, or guaranteed outcomes.

