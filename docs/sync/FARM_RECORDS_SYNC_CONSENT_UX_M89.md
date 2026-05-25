# Farm Records Sync Consent UX M89

## Purpose

M89 adds a non-writing Cloud Sync Consent Prototype so users and developers can understand the future consent path before any cloud sync exists. This is not legal consent and does not unlock Supabase writes.

## What Users Must Understand

- Farm Records currently stay on this device.
- Cloud sync is not enabled.
- Future sync would copy Farm Records to a user-owned cloud account only after opt-in consent.
- Farm finance data can reveal sensitive income, costs, profit, vendors, and farm behavior.
- Cloud backup and cross-device access do not exist yet.

## Consent Categories

- Cloud sync consent for Farm Records leaving the device.
- AI analysis consent as a separate future gate.
- GPS/precise location consent as a separate future gate.
- Image/receipt upload consent as a separate future gate.

Cloud sync consent must never imply consent for AI analysis, precise location, receipt upload, marketing, or unrelated app data.

## Included Data Preview

The prototype lists the data that future sync could include:

- Farm plots.
- Crop cycles.
- Activity records.
- Finance ledger entries.
- Harvest/yield records.
- Image metadata only.
- Restore/export metadata.

## Excluded Data Preview

The prototype lists data that would not be included by default:

- Raw image files.
- GPS or precise coordinates.
- AI analysis history.
- Device unrelated local storage.
- Other app data unrelated to Farm Records.

## Disabled States

The Enable Cloud Sync action must remain disabled until all future blockers are resolved:

- Explicit production consent flow.
- Authenticated ownership.
- Owner-only Supabase RLS.
- RLS tests.
- Sync queue and idempotency.
- Conflict handling.
- Cloud export/delete.
- Privacy and security review.

## Local Prototype State

M89 may store checkbox preview state under `kasethub.farmRecords.syncConsentPrototype.v1`. This key is:

- Local to this device.
- Prototype-only.
- Not legal consent.
- Not a cloud sync flag.
- Not used by backend code.

The prototype state must not upload records, call Supabase, enable a sync queue, or change production auth behavior.

## Copy Requirements

User-facing copy should remain calm and practical:

- “ตอนนี้ข้อมูลยังอยู่ในเครื่องนี้เท่านั้น”
- “การซิงก์ขึ้นคลาวด์ยังไม่เปิดใช้งาน”
- “หากเปิดในอนาคต ต้องขอความยินยอมก่อน”
- “ข้อมูลรายรับรายจ่ายฟาร์มอาจเป็นข้อมูลสำคัญ ควรเข้าใจให้ชัดก่อนซิงก์”

Do not imply sync is ready, legal consent is collected, or cloud backup exists.

## Future Production Requirements

- Legal/privacy review before collecting real consent.
- Consent versioning and withdrawal behavior.
- Owner/RLS test pass.
- Export/delete/recovery tools for synced data.
- Audit logs and support playbook.
- Browser/mobile QA.

## M89 Non-Goals

- No Supabase schema or migration.
- No Supabase read/write.
- No sync queue.
- No real cloud sync.
- No cloud backup or cloud delete.
- No AI record processing.
- No GPS/geolocation.
- No receipt/image upload.
- No legal-final PDPA policy copy.
