# M08 AI Credit + Ad Unlock UX Foundation Report

## Summary

M08 adds a local-first AI question credit system and rewarded-ad unlock UX foundation. Guest users can ask mock AI questions with daily free credits, unlock one extra question through a demo rewarded-ad flow, and review credit usage history. No real AI API, AdMob, payment, backend write, Supabase sync, or hidden API key is added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/AIPage.tsx`
- `src/routes/AICreditsPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/components/kaset/AICreditBalanceCard.tsx`
- `src/components/kaset/RewardedAdUnlockCard.tsx`
- `src/components/kaset/AICreditUsageHistory.tsx`
- `src/components/kaset/AILimitReachedSheet.tsx`
- `src/services/ai-credits/ai-credit.types.ts`
- `src/services/ai-credits/ai-credit-service.ts`
- `src/hooks/useAICredits.ts`
- `reports/milestones/M08_AI_CREDIT_AD_UNLOCK_UX_FOUNDATION_REPORT.md`
- `reports/milestones/m08-ai.png`
- `reports/milestones/m08-ai-credits.png`
- `reports/milestones/m08-profile.png`
- `reports/milestones/m08-memory.png`
- `reports/milestones/m08-auth-sync-preview.png`

## Routes Added

- `/app/ai-credits`

## AI Credit Model Notes

The local AI credit state supports:

- `dailyFreeLimit`
- `dailyFreeUsed`
- `rewardedCredits`
- `proCredits`
- `lastResetDate`
- `usageHistory`
- `unlockHistory`

The service uses localStorage with versioning, safe parse, migration fallback, and a change event for UI refresh. Daily free usage resets by Thailand calendar date.

Credit actions implemented:

- `canAskAI()`
- `consumeCredit()`
- `grantRewardedCredit()`
- `resetDailyIfNeeded()`
- `getCreditSummary()`
- `addUsageLog()`

## Rewarded Ad UX Notes

- The unlock card uses Thai copy: “ดูโฆษณา 1 ครั้ง = ได้เพิ่ม 1 คำถาม”.
- The button says “ดูโฆษณาจำลอง”.
- Clicking the mock button grants 1 local rewarded credit.
- The UI clearly says “ยังไม่เปิดโฆษณาจริงในเวอร์ชันนี้”.
- Future real ad completion must be verified by backend before granting trusted credits.

## Screens Updated

- `/app/ai`
  - Shows credit balance.
  - Consumes a local credit when asking a mock question.
  - Saves recent AI question into Guest Memory.
  - Adds local AI usage history.
  - Shows mock answer card.
  - Shows limit reached card when out of credits.
  - Provides rewarded-ad mock unlock.
- `/app/ai-credits`
  - Shows credit balance, daily free usage, rewarded credits, future Pro placeholder, usage history, unlock history, and safety note.
- `/app/profile`
  - Adds access to AI credits/history.

## Documentation Updates

- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md` documents free usage, rewarded ads, guest behavior, AdMob future, abuse prevention, backend sync, cost control, and model routing.
- `docs/SUPABASE_SCHEMA_DRAFT.md` adds future table plans for `ai_credit_balances`, `ai_credit_transactions`, `rewarded_ad_events`, and `ai_question_logs`.
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md` notes future AI credit and AI history sync behavior.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/ai`
- `/app/ai-credits`
- `/app/profile`
- `/app/memory`
- `/app/auth/sync-preview`

Mobile screenshots were captured for the same routes.

## Known Limitations

- No real AI API
- No real AdMob or rewarded ad SDK
- No real payment or Pro plan
- No backend write
- No Supabase sync
- No real abuse prevention
- Credits are local to the current browser/device
- Rewarded ad unlock is demo-only and not trustworthy for production

## Next Recommended Milestone

M09 should define the AI backend proxy and credit enforcement contract. It should keep provider keys server-side, validate credits before model calls, record AI question logs, and define model routing for normal text questions, risky/complex questions, image analysis, and future video summaries.
