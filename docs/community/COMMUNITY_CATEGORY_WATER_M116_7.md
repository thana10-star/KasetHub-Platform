# Community Water Category M116.7

M116.7 adds `น้ำและระบบน้ำ` as a first-class Community category. Water management is a core farmer topic alongside soil, fertilizer, weather, crop issues, and farm tools, so it needs a clear place in the composer and feed filters.

## Topics Covered

The category covers posts about:

- การให้น้ำ
- ระบบน้ำหยด
- สปริงเกอร์
- ขุดสระ
- ปัญหาน้ำไม่พอ
- น้ำท่วม
- น้ำเค็ม/น้ำกร่อย
- ปั๊มน้ำ/ท่อ/กรอง

## Where It Appears

`น้ำและระบบน้ำ` is included in the shared Community category config:

- Composer category chips.
- Feed filter chips.
- Service/category type mapping.
- Tests that preserve the existing category set.

Existing categories remain:

- `ปัญหาพืช`
- `ดินและปุ๋ย`
- `อากาศ`
- `ราคาเกษตร`
- `เครื่องมือ/แอพ`
- `เรื่องเล่าจากฟาร์ม`
- `อื่น ๆ`

## Mobile Layout Note

Community category chips continue to use wrapping layout (`flex-wrap`) so the added category can move to the next line on mobile instead of forcing horizontal overflow.

## Backend And Security Boundary

This is a category/content update only.

- No backend feature is added.
- Community write security is unchanged.
- Production writes remain disabled by default.
- RLS is not bypassed.
- No service-role key is introduced.
- Farm Records storage/schema is unchanged.

