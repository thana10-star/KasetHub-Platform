# AI Text Endpoint Security Checklist

Before the AI text endpoint can be enabled beyond dry-run:

- Provider key must live only in backend or Edge Function secrets.
- Service-role key must never exist in frontend env.
- Frontend must never call the provider directly.
- Request policy must run before provider access.
- Rate limit must run before provider access.
- Audit event write path must be reviewed before provider access.
- Calculator locked hash must be verified before prompt creation.
- Sponsor/product insertion must remain blocked.
- Exact chemical/fertilizer prescription must remain blocked.
- Production release requires a reviewed rollout gate.

M82 does not deploy or execute this endpoint.
