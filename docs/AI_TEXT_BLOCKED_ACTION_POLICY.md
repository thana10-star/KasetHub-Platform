# AI Text Blocked Action Policy

Blocked actions for M81:

- exact pesticide recommendation
- exact fertilizer dose
- guaranteed yield or profit
- legal or financial certainty
- sponsor or product injection
- autonomous diagnosis
- unsafe medical or chemical advice
- unsupported request type

When a blocked action is detected:

- no provider path may run
- no network call may run
- response status is blocked
- audit preview records the safety check
- UI should show the boundary clearly

Blocked actions cannot be bypassed by CMS, weather risk rules, calculator prompts, or frontend flags.

## M82 Endpoint Blocking

The endpoint dry-run applies the same blocked action policy before any future provider path. Unsafe request types, exact pesticide recommendations, exact fertilizer doses, sponsor/product injection, autonomous diagnosis, legal/financial certainty, and guaranteed outcomes block the endpoint response and keep `providerCalled=false`.
