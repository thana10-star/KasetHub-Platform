# AI Credit and Ad Unlock Strategy

M08 defines the frontend foundation for AI credits and rewarded-ad unlock UX. It does not connect real AI, AdMob, payments, Supabase sync, or backend writes.

## Product Principle

- Guest users can try AI without signup.
- Free daily questions should feel generous but limited.
- Watching an ad can unlock more AI questions.
- Future paid/pro plans should reuse the same credit system.
- Thai copy should stay simple for older and non-tech farmers.

## Free Daily Usage

The local guest credit state starts with a daily free limit. In M08 the prototype uses:

- `dailyFreeLimit`: free questions per Thailand calendar day
- `dailyFreeUsed`: number used today
- `lastResetDate`: Bangkok date string for reset

Copy examples:

- “วันนี้ถามฟรีได้อีก X ครั้ง”
- “ใช้ฟรีวันนี้ X/Y ครั้ง”
- “ใช้งานได้ทันที ไม่ต้องสมัคร”

## Rewarded Ad Flow

M08 uses a mock rewarded-ad flow:

1. User reaches the AI limit or wants more credits.
2. User taps “ดูโฆษณาจำลอง”.
3. Local state grants 1 rewarded credit.
4. User can ask one more AI question.

Copy:

- “ดูโฆษณา 1 ครั้ง = ได้เพิ่ม 1 คำถาม”
- “ยังไม่เปิดโฆษณาจริงในเวอร์ชันนี้”

Future real rewarded ads should verify completion server-side before granting credits.

## Guest Mode Behavior

AI credit state stays in localStorage for guest users. The app should not force signup before asking AI. If the user later creates an account, credit and AI usage history can be synced only after consent and backend validation.

## Future AdMob Rewarded Ads

AdMob or another ad network should be integrated only through approved SDKs and backend verification. The frontend should not grant trusted credits based only on a client event. Backend records should include ad unit, provider event ID, user/guest ID, timestamp, and idempotency key.

## Abuse Prevention

- Rate limit ad unlock attempts.
- Use backend-issued idempotency keys for reward grants.
- Cap daily rewarded credits.
- Detect repeated failures or suspicious device patterns.
- Keep service-role keys on backend only.
- Do not trust client-only reward events for real credits.

## Backend Sync Future

Future tables can include:

- `ai_credit_balances`
- `ai_credit_transactions`
- `rewarded_ad_events`
- `ai_question_logs`

Guest AI usage should map to a user account only after consent. AI question history should remain optional because it can contain sensitive crop or farm details.

## Cost Control Strategy

AI usage should be routed through a backend proxy. The backend should enforce credit balance, model choice, token limits, daily caps, and safety policies before calling Gemini, OpenAI, or another provider.

Recommended controls:

- Cheap model for normal agriculture questions.
- Stronger model for risky, ambiguous, or complex questions.
- Image analysis costs more credits than text questions.
- Summaries and cached answers can reduce repeated cost.
- High-risk disease or chemical advice should include expert-check copy.

## Model Routing Future

- Normal text question: 1 credit, low-cost model.
- Complex diagnosis or multi-step plan: 2 credits, stronger model.
- Image analysis: 3 or more credits, vision model and storage cost.
- Video summary: 1-2 credits depending on transcript length.
- Expert escalation: no automated claim of certainty.

M09 codifies the first routing and cost policy:

- `normal_text_question`: 1 credit, cheap text model.
- `risky_or_complex_question`: 2 credits, stronger text model.
- `plant_image_analysis`: 3 credits, vision model.
- `video_summary`: 2 credits, summary model.
- `article_summary`: 1 credit, summary model.
- `price_explanation`: 1 credit, cheap text model with “ราคาอ้างอิง” disclaimer.

The frontend planner is a preview only. Real credit enforcement must happen on the backend before provider calls.

## M08 Frontend Boundary

`src/services/ai-credits/ai-credit-service.ts` stores credits locally with versioning and migration safety. It does not call AI providers, ad SDKs, Supabase, or payment systems.

## M11 Mock Proxy Credit Validation

M11 adds a mock backend-shaped credit validation preview in `src/services/ai-proxy`.

Rules in the prototype:

- Mock proxy reads local credit summary.
- Mock proxy returns `creditValidation.requiredCredits`, `availableCredits`, and `enoughCredits`.
- Mock proxy does not consume credits by itself.
- `/app/ai` consumes credits only after a successful mock text response.
- `/app/analyze` shows image analysis as 3 credits but keeps it dry-run only in M11.
- Scenario selector can force `insufficient_credits` to test the no-credit UI even when local credits exist.

Real production behavior must not trust this client validation. The backend must recompute cost, validate the balance, call the provider only after approval, and deduct credits atomically after a successful accepted response.

## M13 Adapter and Credit Boundary

M13 routes AI requests through an adapter before they reach either local fixtures or future backend code.

Credit behavior:

- `local_fixture` keeps M11 behavior.
- `/app/ai` consumes local credits only after a successful adapter response.
- backend modes return disabled responses and do not consume credits.
- real backend enforcement is still future work.

The adapter makes it easier to move credit validation server-side later without changing every screen.

## M14 Server-Shaped Credit Validation

M14 adds a local backend boundary prototype that receives a credit summary snapshot and requested credit cost.

It simulates backend ownership by:

- checking available credits against requested cost
- returning accepted/rejected status
- returning insufficient-credit reason when needed
- never mutating local credit state
- returning the same response contract as the adapter

The frontend still consumes local credits after a successful adapter response in mock mode. Real credit mutation must happen server-side in a future milestone.

## M31 Image Cost Reduction Preparation

M31 adds local image compression and preflight quality checks before mock plant analysis. This does not change credit balances or call AI, but it prepares for lower future AI Vision costs by:

- resizing large images before upload/AI
- estimating original vs optimized file size
- warning when an image is too small or likely unsuitable
- showing a cost-reduction label before analysis

Future backend credit pricing should consider optimized image size, model choice, retries, and whether the image passes preflight/moderation before charging or calling a provider.
