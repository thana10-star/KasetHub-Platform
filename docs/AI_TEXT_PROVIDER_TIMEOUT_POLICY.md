# AI Text Provider Timeout Policy

M82 plans timeout behavior for future AI text provider calls.

Current behavior:

- Provider call is skipped.
- Timeout plan is local-only.
- Safe fallback copy is returned.
- Calculator deterministic output cannot be changed.
- No Supabase audit or rate-limit row is written.

Future timeout behavior must:

- Enforce a request timeout before the frontend waits indefinitely.
- Enforce a provider timeout before provider usage can leak cost.
- Return a safe fallback.
- Preserve locked calculator output.
- Record reviewed audit/rate-limit events from backend only.
