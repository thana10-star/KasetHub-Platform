# AI Text Proxy Staging Contract

M81 defines a staging-only text proxy boundary for limited KasetHub AI explanations.

Allowed request types:

- calculator explanation from locked deterministic outputs
- weather caution explanation from existing general risk cards
- general educational explanation

Blocked request types:

- diagnosis
- exact pesticide or fertilizer prescription
- guaranteed yield, profit, or safety
- legal or financial certainty
- sponsor, product, or affiliate insertion
- unrestricted chat

Frontend contract:

- The frontend may send only a bounded `AITextRequest`.
- The frontend must not include provider keys, service-role keys, hidden sponsor payloads, or unrestricted system prompts.
- Calculator output snapshots must remain immutable and include locked values/hash when available.
- If staging flags are not all enabled, local fixture output is used.
- If staging flags are enabled but no backend endpoint exists, the proxy returns a controlled disabled state.

Backend contract for future work:

- Provider execution is backend-owned only.
- Request audit is required before provider calls.
- Rate-limit checks are required before provider calls.
- Safety filtering is required after provider responses.
- Broader rollout requires a release gate.

No backend endpoint is implemented by M81.
