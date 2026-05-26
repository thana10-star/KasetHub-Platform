# Privacy Policy Draft Structure M105

## Purpose

This is a Thai-first draft structure for the KasetHub V1 privacy policy. It is not legal-final text and must be reviewed by the owner and appropriate legal reviewer before public store release.

M106 public page draft: `docs/release/v1-package/PRIVACY_POLICY_PUBLIC_PAGE_DRAFT_M106.md`.

## 1. ข้อมูลที่แอพใช้

KasetHub V1 may use these types of information depending on which features the user opens:

- ข้อมูลสมุดฟาร์มที่ผู้ใช้กรอกเอง เช่น แปลง รายรับ รายจ่าย กิจกรรม และผลผลิต
- คำถามที่ผู้ใช้พิมพ์ในหน้า AI หากเปิดใช้งานผู้ให้บริการ AI ในอนาคต
- ตำแหน่งแบบกว้าง เช่น จังหวัด เมือง หรือพื้นที่เริ่มต้น สำหรับพยากรณ์อากาศ
- ข้อมูลที่ผู้ใช้กรอกในเครื่องคำนวณ เช่น พื้นที่ ระยะปลูก ปุ๋ย ต้นทุน หรือผลผลิตโดยประมาณ
- ข้อมูลการใช้งานพื้นฐาน หากมีการเพิ่มระบบวิเคราะห์การใช้งานในอนาคต

## 2. ข้อมูลที่ยังไม่ใช้ใน V1

V1 ไม่ได้ออกแบบให้ใช้ข้อมูลหรือความสามารถเหล่านี้:

- GPS หรือตำแหน่งละเอียดของผู้ใช้
- cloud sync สำหรับสมุดฟาร์ม
- อัปโหลดใบเสร็จ
- OCR หรือการอ่านข้อความจากรูปภาพ
- การแจ้งเตือนจากระบบ
- การชำระเงิน
- บัญชีผู้ใช้จริง หากยังไม่ได้เปิดใช้ในรุ่นที่เผยแพร่

If any of these are added later, the privacy policy and store listing should be updated before release.

## 3. ข้อมูลแบบ Local-first

- ข้อมูล Farm Records ใน V1 เก็บไว้บนอุปกรณ์หรือเบราว์เซอร์ของผู้ใช้เป็นหลัก
- หากมีฟีเจอร์ export/restore ผู้ใช้ควรใช้เพื่อสำรองหรือย้ายข้อมูลด้วยตนเอง
- การลบแอพ ล้างข้อมูลเบราว์เซอร์ เปลี่ยนอุปกรณ์ หรือรีเซ็ตเครื่อง อาจทำให้ข้อมูล local หายได้
- V1 ยังไม่ควรสื่อว่ามี cloud backup หรือ cloud sync หากยังไม่ได้เปิดใช้งานจริง

## 4. Weather

- Weather ใช้ตำแหน่งแบบกว้าง เช่น เมือง จังหวัด หรือค่าตั้งต้น
- V1 ปัจจุบันไม่ควรแสดง GPS prompt หรือขอตำแหน่งละเอียด
- ข้อมูลอากาศมาจาก Open-Meteo ซึ่งเป็นแหล่งข้อมูลพยากรณ์อากาศสาธารณะ
- ข้อมูล Weather ใช้เพื่อช่วยวางแผนเบื้องต้น ไม่ใช่ระบบเตือนภัยอย่างเป็นทางการ

## 5. AI

- หากเปิดใช้ AI provider ในอนาคต คำถามที่ผู้ใช้พิมพ์อาจถูกส่งไปยังผู้ให้บริการ AI เพื่อสร้างคำตอบ
- คำตอบจาก AI อาจผิด ไม่ครบ หรือไม่เหมาะกับสภาพแปลงจริง
- ผู้ใช้ไม่ควรใส่ข้อมูลส่วนตัวหรือข้อมูลอ่อนไหวในคำถาม
- คำแนะนำสำคัญควรตรวจสอบกับฉลากสินค้า เจ้าหน้าที่เกษตร ผู้เชี่ยวชาญ หรือแหล่งข้อมูลที่เชื่อถือได้
- AI ไม่ควรถูกนำเสนอว่าแทนผู้เชี่ยวชาญ หน่วยงานรัฐ หรือคำเตือนอย่างเป็นทางการ

## 6. User Choices

Users should be told how to:

- export data if export is supported
- delete local data if delete/reset is supported
- avoid entering sensitive personal information
- contact support for questions about privacy, data, or app use

## 7. Contact / Support Placeholder

Owner must fill these before public store release:

- Support email: TBD
- Support form URL: TBD
- Privacy policy URL: TBD
- Owner or business contact name: TBD

## 8. Disclaimer

This document is not legal-final privacy policy text.

Before store release, the owner should review:

- whether the final app build matches these statements
- whether any analytics, AI provider, account, cloud, payment, notification, or upload feature is enabled
- whether local law, store policy, and PDPA requirements need additional language
- whether the published privacy URL is stable and public
