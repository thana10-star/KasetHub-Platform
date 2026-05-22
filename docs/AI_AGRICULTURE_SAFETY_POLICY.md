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
