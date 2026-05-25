# AI Text Proxy Security Checklist

PLANNING ONLY
DO NOT RUN
DO NOT DEPLOY
REVIEW REQUIRED

Before a future `ai-text-proxy` Edge Function can be considered:

- Provider keys must live only in backend or Edge Function secret storage.
- Supabase service-role keys must never be exposed to Vite/frontend code.
- Request type must be one of calculator explanation, weather caution explanation, or educational explanation.
- Calculator output snapshots must be locked and verified before prompt building.
- Exact chemical/fertilizer prescription, sponsor/product injection, diagnosis, legal/financial certainty, and guaranteed outcomes must be blocked before provider access.
- Audit and rate-limit checks must exist before provider access.
- Provider timeout must return safe fallback copy and must not mutate deterministic calculator results.
- Production rollout requires a distinct reviewed release gate.

M82 does not include a runnable provider fetch.
