# Weather QA Cache And Coarse Location

M76 hardens KasetHub weather after the first Open-Meteo integration.

## Scope

- local fixture remains the default
- Open-Meteo remains flag-gated
- cache is local-only
- location selection uses predefined province/city-center fixtures only
- no GPS
- no browser geolocation
- no precise farm coordinates
- no Supabase writes

## Route

`/app/weather/qa` shows:

- current weather mode
- cache freshness state
- coarse location count
- privacy proof
- failure fixture matrix
- stale cache examples
- general risk note boundaries

## QA Fixtures

The M76 matrix includes:

- default local fixture
- Open-Meteo disabled
- Open-Meteo ready with flags
- API failure with stale cache
- production disabled

Each fixture states whether fetch is expected, whether fallback is expected, and whether stale cache should be shown.

## Farmer UX

`/app/weather` now shows cache freshness, clear-cache action, coarse location selector, and general weather risk notes.

Risk notes are intentionally broad and must not become exact pesticide, chemical, fertilizer, or production advice.
## M77 QA Additions

`/app/weather/qa` now includes a source readiness matrix, refresh policy preview, stale/offline examples, local-only preference proof, no-sync proof, and privacy boundary notes.

The QA route still proves there is no GPS, no map pin, no precise farm coordinate, no Supabase write, and no cloud sync.
