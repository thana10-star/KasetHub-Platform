# AI Text Endpoint Contract

M82 defines the future backend-owned `ai-text-proxy` endpoint contract for controlled staging AI text.

Status:

- Planning and dry-run only.
- No provider call.
- No deployed Edge Function.
- No Supabase write.
- No frontend provider key.
- No frontend service-role key.

Allowed request types:

- `calculator_explanation`
- `weather_caution_explanation`
- `educational_explanation`

Blocked output:

- Exact pesticide recommendation.
- Exact fertilizer dose.
- Guaranteed yield or profit.
- Legal or financial certainty.
- Sponsor, product, or affiliate insertion.
- Autonomous diagnosis.
- Unsafe medical or chemical advice.

The endpoint request includes request type, prompt, context summary, requested actions, policy version, source route, and optional locked output snapshot. Calculator snapshots must remain immutable.

The endpoint response includes policy check, audit preview, rate-limit preview, timeout plan, failure modes, blocked reasons, immutable-output proof, and no-provider-call proof.
