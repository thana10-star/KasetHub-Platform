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

## M57 Adapter Policy Use

M57 does not activate a real AI policy table. The adapter reads the local M56 policy fixtures, returns the selected policy id and prompt template id in every adapter response, and keeps `noRealAICall: true`.

The adapter must not let feature flags change policy behavior silently. Future staging work must prove that:

- deterministic result values are still locked before prompt creation
- policy version ids are returned in responses and audit previews
- sponsor/product requests remain blocked before AI
- chemical and fertilizer-dose invention requests remain blocked before AI

## M58 Policy QA

M58 adds adapter QA fixtures and tests for policy mismatch blocking. If a request expects a policy version that does not match the selected policy version, the adapter returns `safety_blocked` with `policy_version_mismatch` before any backend or network path.

## M59 Edge Policy Check

`CalculatorAIEdgePolicyCheck` records the selected policy version, prompt template version, expected policy version, banned categories, blocked actions, and sponsor separation status for the future `calculator-ai-explain` Edge Function.

Policy mismatch remains blocked before provider calls. Draft or unreviewed policy versions should remain `review_required` until an explicit policy promotion milestone exists.

Future endpoint work must validate policy version ids server-side as well; frontend checks are only a planning and QA guard.
