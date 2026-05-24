# Weather Cache Stale Data Policy

M76 adds local-only weather cache readiness.

## Cache Rules

- cache key: coarse location id
- cache storage: current device only
- stale window: 45 minutes by default
- no Supabase persistence
- no backend write
- no cloud sync

## Behavior

When Open-Meteo is enabled:

- fresh cache avoids a new fetch
- stale cache does not prevent a refresh attempt
- API failure can fall back to stale cache
- no cache plus API failure falls back to local fixture

When Open-Meteo is disabled or local fixture mode is active:

- no network call occurs
- local fixture remains available

## UI Requirements

The weather route must show stale warnings when stale cache is used. Stale data must not look live.

## Clear Cache

M76 exposes a local clear-cache action for the selected coarse location. Clearing cache does not affect Supabase because no Supabase weather cache exists yet.
