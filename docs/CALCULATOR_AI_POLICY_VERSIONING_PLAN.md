# Calculator AI Policy Versioning Plan

M56 defines how future calculator AI explanation policy versions should be tracked before any live AI call is enabled.

## Version Objects

Each `CalculatorAIPolicyVersion` should include:

- policy version id
- prompt template version id
- status: draft, review_ready, active, or retired
- locale
- effective date
- allowed actions
- blocked actions
- escalation triggers
- banned response categories
- sponsor separation rules
- audit requirements

## M56 Example Versions

- `calc-ai-policy-v2026-05-m56`
- `calc-ai-policy-v2026-05-m56-strict`

These are local planning fixtures. They are not loaded from Supabase and do not cause backend writes.

## Escalation Triggers

Future policy versions should escalate when:

- calculator type is spray or fertilizer
- user asks for blocked actions
- payload is invalid or oversized
- user asks for sponsor/product insertion
- user asks AI to override label instructions

## Banned Response Categories

- hidden sponsor or affiliate content
- chemical product recommendation
- fertilizer dose not present in the locked snapshot
- guaranteed yield or profit
- label override
- uncertainty removal

## Sponsor Separation

Sponsors must stay outside explanation prompts. Paid placements must be labeled, audited, and visually separated from deterministic results and AI explanations. Sponsor systems must not alter policy version selection.

## Activation Requirements

Before a policy version becomes active:

- reviewed by product/safety owner
- covered by service tests
- paired with a prompt template version
- logged in backend-owned audit metadata
- protected by owner/admin-only RLS if synced to Supabase

