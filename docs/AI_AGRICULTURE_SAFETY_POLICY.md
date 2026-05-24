# AI Agriculture Safety Policy

KasetHub AI should help farmers think through problems, but it must not present itself as a guaranteed diagnosis or expert replacement.

## Core Principles

- AI gives guidance only, not guaranteed diagnosis.
- Encourage local expert confirmation for disease, pesticide, fertilizer, and high-risk decisions.
- Clearly distinguish demo/sample output from real expert advice.
- Avoid overconfidence when symptoms can have multiple causes.
- Keep Thai copy simple and practical.

## Disease, Pesticide, and Fertilizer Advice

AI responses involving disease, insects, fertilizer, pesticide, herbicide, fungicide, or chemical usage must include:

> คำแนะนำนี้เป็นข้อมูลเบื้องต้น ควรตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนใช้งานจริง

AI should:

- Ask for crop, location, growth stage, weather, and visible symptoms when context is missing.
- Suggest observation and confirmation steps before treatment.
- Avoid exact chemical dosage unless verified from approved local sources.
- Prefer safe, general, and integrated pest management guidance.

## Price Advice

Price explanations must use “ราคาอ้างอิง” language.

AI should not:

- Promise future prices.
- Tell users to sell or hold as guaranteed advice.
- Present sample/mock prices as real-time market data.
- Guarantee sale price, buyer acceptance, or final payment.

AI must:

- Cite the source label and source date/time when explaining any price.
- Say “ราคาอ้างอิง” near the price value.
- Mention that price can change by area, grade, moisture, season, and buyer.
- Clearly mark demo/sample data as demo/sample.

Required copy:

> ราคาเป็นราคาอ้างอิงจากแหล่งข้อมูลที่ระบุ ควรตรวจสอบราคาหน้างานก่อนตัดสินใจขาย

M21 required price disclaimer:

> ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ

## User-Uploaded Images

Image analysis should explain:

- Images may contain farm/location details.
- Processing requires user consent.
- Images should be stored only when needed for history or expert review.
- Users should be able to delete saved analysis history.
- Low-confidence or blurry image results must say “ภาพไม่ชัดพอ” or “ยังไม่พบข้อมูลที่มั่นใจเพียงพอ”.
- Image results should not claim confirmed diagnosis without expert review.

## Blocked or Escalated Prompt Examples

Block, refuse, or escalate prompts that request:

- Unsafe chemical mixing or misuse.
- Instructions that could harm people, animals, or the environment.
- Guaranteed diagnosis from unclear symptoms.
- Market manipulation or guaranteed profit claims.
- Personal data extraction from uploaded images.

## Community Moderation Safety

Community reports involving agricultural advice should be treated as safety signals, not final judgments. M23 stores these reports locally only, but future AI or backend review must follow these rules:

- Do not use AI moderation as the only decision maker for removing farmer content.
- Escalate chemical, pesticide, fertilizer, disease, and dangerous-advice reports to human/expert review when possible.
- Keep “คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ” visible near risky community advice.
- Do not expose reporter identity, private notes, or queue internals to the public feed.
- Do not let AI rewrite community experience into official guidance unless a trusted source is cited.
- Scam/fake sale and personal-data reports should be prioritized by a backend-owned moderation queue before marketplace features go live.

## M24 Admin AI Safety Review

M24 previews AI safety/risk logs in `/app/admin` using local AI proxy warnings and local AI credit usage. This is not a real AI safety backend.

Future admin review must:

- keep AI provider logs server-side
- protect user privacy and redact sensitive content
- route chemical, pesticide, fertilizer, disease, price, and plant-analysis escalations to expert reviewers
- record reviewer role, source, timestamp, decision, and correction notes
- keep audit logs append-only
- prevent frontend-only “approve” actions from changing production behavior

## Safe Response Shape

Recommended response sections:

- สิ่งที่อาจเป็นไปได้
- วิธีตรวจเพิ่ม
- สิ่งที่ทำได้อย่างปลอดภัยก่อน
- เมื่อไรควรปรึกษาผู้เชี่ยวชาญ
- ข้อควรระวัง

## M10 Status

M10 adds local image upload UX and mock analysis, but no real AI model, upload, moderation, storage, or safety automation runs against live user images yet.

## M12 Image Privacy and Moderation

M12 defines the future privacy and moderation foundation before enabling uploads.

Required product behavior:

- Tell users that the current version keeps images local only.
- Ask explicit consent before any future private upload.
- Warn users not to upload images with faces, documents, house numbers, or sensitive personal details.
- Run moderation before sending images to AI vision.
- Do not send rejected, unsafe, or irrelevant images to AI providers.
- Let users request deletion of original image, thumbnail, and linked media references.
- Keep raw images out of Guest Memory and localStorage.

Required future copy:

> รูปภาพอาจมีข้อมูลพื้นที่หรือข้อมูลส่วนตัว ควรอัปโหลดเฉพาะภาพพืชหรือแมลงที่ต้องการวิเคราะห์ และสามารถลบรูปได้ภายหลัง
## M15 Plain Thai Safety Copy

For older/non-tech users, safety copy should be short and repeated near the relevant action.

Preferred user-facing wording:

- “คำตอบนี้เป็นคำแนะนำเบื้องต้น”
- “ถ้าเกี่ยวกับสารเคมี ปุ๋ย หรือโรคพืช ควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง”
- “ราคานี้เป็นข้อมูลตัวอย่าง ยังไม่ใช่ราคาตลาดจริง”
- “รูปยังอยู่ในเครื่องนี้ ยังไม่อัปโหลดจริง”
- “ถ้าภาพไม่ชัด ลองถ่ายใกล้ใบพืชมากขึ้น”

Avoid:

- Long legal-style disclaimers in small text.
- Technical provider/model language on normal user screens.
- Claims such as “ตรวจพบแน่นอน” or “รักษาได้แน่นอน”.

## M31 Image Preflight Safety

M31 adds local image compression and preflight checks before mock plant analysis. These checks are not AI moderation and must not be described as diagnosis.

Required behavior:

- Say “รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้”.
- Warn that blurry, dark, too-small, or obstructed photos may reduce result quality.
- Remind users not to include faces, house signs, documents, or other personal data in plant photos.
- Keep raw images and base64 strings out of Guest Memory.
- Treat readiness score as a UX estimate only.

Future AI Vision must still run backend-side safety checks, moderation, consent, provider-key protection, and expert escalation for risky pesticide, disease, fertilizer, or chemical advice.

## M55 Calculator AI Explanation Boundary

Agriculture calculator AI explanations are explanation-only until a reviewed recommendation system exists. The current M55 implementation only creates local explanation plans and prompt scaffold previews.

Required behavior for future calculator AI:

- Preserve deterministic calculator result values exactly.
- Explain formulas and inputs in simple Thai.
- Keep `ผลคำนวณเบื้องต้น` and no-guarantee copy visible.
- Remind users to check real labels, soil tests, field measurements, prices, and experts.
- Block sponsor products, chemical product recommendations, label overrides, and guaranteed yield/profit claims.
- Keep AI text visually separate from formula-owned result cards.

M55 does not call AI providers, add network calls, write backend data, write Supabase data, or create a recommendation engine.

## M56 Calculator AI Backend Review

Before enabling real calculator explanations, the backend must:

- lock deterministic calculator result snapshots
- run policy version checks before prompt building
- reject sponsor, chemical product, label override, and result mutation requests
- apply rate limits and repeated-request controls
- log audit metadata without raw secrets or hidden sponsor payloads
- safety-filter generated explanations before display

M56 only reviews this architecture locally. It still does not call AI, write backend data, write Supabase data, sync to cloud, or enable sponsor behavior.

## M57-M58 Calculator AI Adapter And Network Boundary

Calculator AI explanations remain disabled by default for real backend execution. The frontend adapter may use local fixtures, but it must not call a provider or backend endpoint unless a future reviewed staging milestone explicitly enables backend ownership and network flags.

Required future network boundary:

- prompt execution must be backend-owned
- provider keys must never appear in frontend code or frontend env
- request validation must happen before prompt building
- locked result hashes and policy versions must be verified server-side
- audit logs, rate limits, abuse prevention, and timeout handling must exist before live AI
- sponsor or affiliate payloads must stay separate from explanation prompts and outputs
- AI must explain locked calculator values only and must not mutate formulas or inject hidden recommendations

M58 adds local adapter QA fixtures and an endpoint checklist route only. It still does not call AI, create a backend endpoint, write backend/Supabase data, sync to cloud, or enable sponsor behavior.

## M59 Calculator AI Edge Function Contract

The future calculator AI endpoint is named `calculator-ai-explain`. It must be backend-owned and explanation-only.

Before any live provider call, the Edge Function must:

- keep provider and service-role keys in server-side secret stores only
- verify auth/session context where user history is involved
- verify the locked calculator result hash
- verify the policy and prompt template version
- run rate-limit and abuse checks
- handle timeout with safe disabled copy
- safety-filter the output before display
- prevent sponsor, affiliate, product, chemical, fertilizer-dose invention, formula mutation, label override, and guaranteed outcome content

M59 is a contract draft only. It does not deploy an Edge Function, call a provider, write Supabase data, or enable a frontend network path.
