# AI Production QA Checklist M144

Status: production readiness checklist only. This checklist does not enable live Gemini.

## Security

- [ ] No frontend Gemini key is configured.
- [ ] No frontend OpenAI key is configured.
- [ ] No `VITE_` provider secret exists.
- [ ] No provider key value is committed.
- [ ] No provider key value appears in docs, reports, screenshots, test fixtures, or logs.
- [ ] `GEMINI_API_KEY` is Cloudflare secret only if configured.
- [ ] Browser source and built JS do not contain provider secret values.
- [ ] API responses do not include secret names with values, stack traces, model IDs, or raw provider errors.
- [ ] Invalid requests return safe Thai copy, not technical validation details.
- [ ] Production logs do not store raw full question/answer by default.

## Safety

- [ ] Pesticide dosage requests are blocked or cautioned without exact dosage.
- [ ] Dangerous chemical mixing requests are blocked.
- [ ] Fake live weather claims are blocked or replaced with cautious non-live copy.
- [ ] Fake live price claims are blocked or replaced with cautious non-live copy.
- [ ] Fake citations and fake official source claims are blocked.
- [ ] Guaranteed diagnosis, cure, profit, yield, and sale outcome claims are blocked.
- [ ] Human medical emergency advice escalates instead of giving treatment steps.
- [ ] Animal health high-risk cases recommend a veterinarian or livestock office.
- [ ] High-risk cases recommend product labels, local agriculture office, or qualified experts.
- [ ] Dry-run answers clearly avoid pretending to be live Gemini output.

## UX

- [ ] `/app` loads.
- [ ] `/app/ai` loads.
- [ ] Normal backend-contract response renders as Thai user-facing copy.
- [ ] Disabled or not-configured response is calm and non-technical.
- [ ] Blocked high-risk response is understandable and not alarming beyond the safety need.
- [ ] Loading state is visible while submitting.
- [ ] Error state gives a retry path when appropriate.
- [ ] Mobile width 390px has no horizontal overflow.
- [ ] Text does not overflow buttons, badges, cards, or response panels.
- [ ] No visible `API`, `provider`, `dev`, `undefined`, `null`, stack trace, model ID, or secret-like wording appears in user-facing UI.

## Operations

- [ ] Cloudflare production variables are present as documented.
- [ ] `AI_PROVIDER=gemini`.
- [ ] `AI_LIVE_ENABLED=false`.
- [ ] `AI_MODEL` is placeholder or verified, but not used for live execution in M144.
- [ ] `AI_PROVIDER_TIMEOUT_MS=8000`.
- [ ] `AI_TIMEOUT_MS=12000`.
- [ ] `AI_MAX_INPUT_CHARS=1200`.
- [ ] `AI_MAX_OUTPUT_TOKENS=700`.
- [ ] `AI_DAILY_LIMIT_GUEST=5`.
- [ ] `AI_DAILY_LIMIT_SIGNED_IN=20`.
- [ ] `AI_COOLDOWN_SECONDS=20`.
- [ ] Frontend contract flag is set only if backend-contract UI testing is desired.
- [ ] Production dry-run or not-configured state is tested.
- [ ] Rollback path is tested or rehearsed: set `AI_LIVE_ENABLED=false`.
- [ ] No billing, persistent counters, or raw audit storage is introduced in M144.

## M144 Exit Criteria

M144 passes when:

- Cloudflare setup guide is complete.
- Production API smoke guide is complete.
- Owner approval and rollback checklist is complete.
- Production QA checklist is complete.
- Existing AI guardrail tests still pass.
- No live Gemini or OpenAI call is added.
- No provider API key value or frontend provider key is added.
- Runtime live AI behavior remains unchanged.

