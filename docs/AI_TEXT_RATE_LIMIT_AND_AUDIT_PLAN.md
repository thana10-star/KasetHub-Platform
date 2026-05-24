# AI Text Rate-limit and Audit Plan

M81 adds local previews for future backend controls.

Audit preview events:

- request received
- request type checked
- blocked actions checked
- rate-limit preview checked
- provider key absent from frontend
- service-role key absent from frontend
- release gate required

Rate-limit preview:

- staging user/device scope
- daily limit preview
- cooldown preview
- no frontend write
- no Supabase write in M81

Future backend tables are planning-only:

- `ai_text_requests`
- `ai_text_audit_logs`
- `ai_text_rate_limits`
- `ai_text_release_gates`
- `ai_text_blocked_actions`
