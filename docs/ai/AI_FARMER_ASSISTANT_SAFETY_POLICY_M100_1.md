# AI Farmer Assistant Safety Policy M100.1

## 1. Purpose

KasetHub V1 should make `ถาม AI เกษตร` easy to use while keeping farmers safe.

AI answers must help with general understanding, planning, and next questions. They must not replace experts, official guidance, product labels, or local field inspection.

## 2. Standard Disclaimer

Every AI answer should show a small safety note.

Suggested Thai copy:

`คำตอบจาก AI อาจมีข้อผิดพลาด ควรตรวจสอบกับผู้เชี่ยวชาญ เจ้าหน้าที่เกษตร ฉลากสินค้า หรือแหล่งข้อมูลที่เชื่อถือได้ก่อนนำไปใช้จริง โดยเฉพาะเรื่องสารเคมี ปุ๋ย โรคพืช และความปลอดภัย`

## 3. High-Risk Topics

High-risk topics need extra caution:

- pesticide/chemical dosage
- disease diagnosis
- crop loss decisions
- loan, finance, tax, or legal advice
- health and safety
- dangerous mixing
- eating or consuming unsafe substances
- guaranteed yield, profit, or treatment claims

## 4. AI Response Rules

AI should:

- give general guidance
- explain possible causes or options
- ask for missing context when needed
- tell the user to verify labels, local experts, official sources, or field conditions
- keep uncertainty visible
- suggest safer next steps such as observing symptoms, checking weather, or contacting a local officer

AI should not:

- claim certainty
- replace official advice
- guarantee yield, profit, cure, or safety
- recommend dangerous chemical mixing
- invent pesticide rates
- override product labels
- diagnose plant disease with certainty from text alone
- give medical, legal, tax, or loan decisions

## 5. Chemical And Fertilizer Boundary

For pesticides and chemicals:

- avoid exact rates unless the user provides label information
- even with label information, frame output as calculation support from the user-provided label
- remind the user to check the real label and local officer/agronomist guidance

For fertilizer:

- planning estimates are allowed
- do not present crop-stage rates as official recommendations unless separately reviewed
- encourage soil test, crop stage review, and local conditions

## 6. UI Requirement

Every AI answer card should include:

- a small disclaimer
- uncertainty language
- escalation guidance for high-risk topics

The warning should be readable but not scary. It should feel like a helpful safety rail.

## M101 UX Application

M101 applies this policy to `/app/ai`:

- the standard safety note renders on the AI page
- answer cards repeat the safety note near the response
- high-risk prompts can show the stronger chemical caution note
- AI status/internal controls sit under `ข้อมูลเพิ่มเติม / สำหรับทีมงาน`

## 7. V1 Boundary

M100.1 does not enable real AI provider calls, Supabase writes, cloud sync, GPS, OCR, receipt upload, notifications, or farm-record AI processing.
