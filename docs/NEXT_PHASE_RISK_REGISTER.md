# Next Phase Risk Register

This register tracks risks before KasetHub moves from local/mock prototype to real staging integrations.

| Risk | Level | Mitigation | Stop Condition |
| --- | --- | --- | --- |
| Service-role or provider key leaks into frontend | Critical | Use anon key only in Vite/Cloudflare public env; keep privileged keys in backend secret stores | Any service-role-like key or provider key appears in repo/frontend env |
| RLS allows cross-user access | Critical | Test anon, owner, other user, moderator/admin, and service-role job contexts on staging | User A can read/write User B private data |
| Auth session ownership mismatch | High | Enable phone OTP only after staging SQL/RLS checks; verify `user_id` ownership before sync | Guest data can attach to the wrong account |
| Guest Sync duplicate or data loss | High | Require idempotency key, consent snapshot, audit log, and rollback/manual cleanup | Retry creates duplicates or partial success is not auditable |
| AI unsafe advice or runaway cost | High | Add backend proxy, rate limits, cost caps, safety logs, and fallback copy | Provider calls happen without quota/cost/safety controls |
| Mock data mistaken for production | High | Keep local/demo notices on weather, prices, AI, moderation, notifications, and admin pages | Testers believe demo prices/weather/AI output are real |
| Staging branch drift | Medium | Rebase/merge main regularly and run route checklist before merge | M01-M35 routes break or require env to load |

