# Community Rules and Safety Policy

This document defines the user-facing community safety baseline for KasetHub. M23 implements the policy as local/mock UX only.

## Community Rules

1. คุยกันด้วยความเคารพ

Farmers should be able to ask simple questions without being mocked or harassed. Disagreement is allowed, but personal attacks are not.

2. ไม่หลอกขายหรือประกาศขายปลอม

Future marketplace or sale posts must avoid false prices, fake stock, pressure to transfer money, and unverifiable seller claims.

3. ไม่แนะนำสารเคมีแบบเสี่ยงอันตราย

Do not suggest unsafe mixing, off-label use, excessive dosage, banned substances, or shortcuts that may harm people, crops, animals, soil, water, or buyers.

4. ไม่โพสต์ข้อมูลส่วนตัว

Avoid posting phone numbers, addresses, bank accounts, identity documents, faces of uninvolved people, or private farm details without consent.

5. ใช้รูปภาพอย่างรับผิดชอบ

Photos should support the farming question or answer. Avoid images that reveal private locations, children, documents, or someone else’s property without permission.

6. บอกแหล่งที่มาเมื่อเป็นคำแนะนำสำคัญ

When sharing disease, chemical, price, or sale guidance, include the source and date when available. Community experience is useful, but it is not the same as official or expert advice.

## Safety Copy

Required copy for risky agricultural advice:

> คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ

Required copy for local report UX:

> รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น

Required copy for current moderation status:

> ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้

## Reporting Explanation

Farmers should be able to report:

- spam
- rude or harassing behavior
- dangerous advice
- chemical or pesticide risk
- scam or fake sale
- off-topic posts
- personal data exposure
- other safety concerns

M23 stores these reports only on the current device. A future backend must validate reports, group duplicate reports, protect reporter privacy, and keep audit trails.

## Source and Disclaimer Guidance

Community posts should not turn unverified experience into official guidance. For sensitive topics:

- say when advice is personal experience
- encourage checking labels or local experts
- cite official or trusted sources where possible
- avoid guaranteed diagnosis, guaranteed yield, guaranteed price, or guaranteed buyer claims

## Future Admin Review

Before real community backend writes are enabled, KasetHub should define:

- moderator roles
- expert roles
- review queue ownership
- status transitions
- action history
- appeal/correction workflow
- content retention and deletion rules
- RLS policy and service-role boundaries

## Current Boundary

M23 does not call a real moderation API, AI provider, Supabase, or backend route. It does not remove content for other users. It only demonstrates local report, hide, undo, and queue UX.
