# AI Farmer Assistant UX M101

## Purpose

M101 makes the AI route and Home entry match the V1 AI-first direction.

The goal is not to enable a new provider. The goal is to help farmers understand what to ask and how to use AI answers safely.

## Home Behavior

Home now has a prominent `ถาม AI เกษตร` entry near the top.

It explains that farmers can ask about:

- พืช
- ดิน
- ปุ๋ย
- โรค
- แมลง
- อากาศ
- การจัดการฟาร์ม

Example chips:

- ใบเหลืองเกิดจากอะไร
- เตรียมดินก่อนปลูกยังไง
- ฝนแบบนี้ควรพ่นยาไหม

My Farm remains compact and is not re-expanded.

## AI Page Behavior

`/app/ai` now uses farmer-facing copy:

- title: `ถาม AI เกษตร`
- input placeholder: `พิมพ์คำถาม เช่น ใบมะนาวเหลืองเกิดจากอะไร`
- button: `ถาม AI`

Prompt examples:

- ใบเหลืองเกิดจากอะไร
- ดินแข็งควรปรับปรุงยังไง
- ควรเตรียมดินก่อนปลูกข้าวโพดยังไง
- ฝนตกหลายวันต้องระวังอะไร
- ปุ๋ย 15-15-15 ใช้ต่างจาก 46-0-0 ยังไง
- แมลงกินใบควรเริ่มตรวจยังไง

## Fallback State

When real AI is not enabled, the page says:

`ระบบ AI กำลังเตรียมเปิดใช้งาน`

Users can still view example prompts and usage guidance. The page does not claim that a real provider is active.

## Safety Note

The standard safety note is shown on the AI page and under answer cards:

`คำตอบจาก AI อาจมีข้อผิดพลาด ควรตรวจสอบกับผู้เชี่ยวชาญ เจ้าหน้าที่เกษตร ฉลากสินค้า หรือแหล่งข้อมูลที่เชื่อถือได้ก่อนนำไปใช้จริง โดยเฉพาะเรื่องสารเคมี ปุ๋ย โรคพืช และความปลอดภัย`

High-risk prompts related to chemicals, disease, fertilizer, labels, finance, legal, or health topics can show stronger caution.

## Advanced/Internal Behavior

AI status and scenario controls remain available under `ข้อมูลเพิ่มเติม / สำหรับทีมงาน`.

Normal farmers should not need these controls to ask a question.

## Non-Goals

M101 does not add real provider calls, backend writes, Supabase writes, GPS, OCR, image diagnosis, notifications, or Farm Records AI processing.
