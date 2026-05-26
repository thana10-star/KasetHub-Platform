import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { CommunityPage } from '@/routes/CommunityPage';

describe('M112 Community route', () => {
  test('renders the gated Community Feed V1 staging foundation without fake engagement', () => {
    const html = renderToString(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ชุมชนเกษตร');
    expect(html).toContain('อ่าน แบ่งปัน และถามปัญหาเกษตรกับคนทำเกษตร');
    expect(html).toContain('เขียนโพสต์');
    expect(html).toContain('เล่าเรื่องฟาร์ม ถามปัญหาพืช หรือแชร์ประสบการณ์');
    expect(html).toContain('ชุมชนพร้อมเชื่อมต่อฐานข้อมูลแล้ว เหลือทดสอบบัญชีและสิทธิ์ก่อนเปิดโพสต์จริง');
    expect(html).toContain('ตอนนี้อ่านและแชร์ได้ก่อน');
    expect(html).toContain('เปิดเขียนหลังตรวจความปลอดภัย');
    expect(html).toContain('แนบรูปจะเปิดใช้งานหลังตั้งค่าพื้นที่เก็บรูป');
    expect(html).toContain('โพสต์ล่าสุด');
    expect(html).toContain('ยังไม่มีโพสต์ชุมชนจริง');
    expect(html).toContain('ไม่ใช้โพสต์ปลอม');
    expect(html).not.toContain('คุณสายฝน');
    expect(html).not.toContain('ตัวอย่าง 18 นาที');
  });

  test('renders categories, safety copy, share options, report reasons, and notification gate', () => {
    const html = renderToString(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ปัญหาพืช');
    expect(html).toContain('ดินและปุ๋ย');
    expect(html).toContain('เรื่องเล่าจากฟาร์ม');
    expect(html).toContain('อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ');
    expect(html).toContain('ข้อมูลจากชุมชนควรตรวจสอบก่อนนำไปใช้จริง');
    expect(html).toContain('เรื่องสารเคมีควรตรวจฉลากและคำแนะนำเจ้าหน้าที่ก่อนใช้');
    expect(html).toContain('แชร์ชุมชน');
    expect(html).toContain('LINE');
    expect(html).toContain('Facebook');
    expect(html).toContain('สแปม');
    expect(html).toContain('ข้อมูลอันตราย');
    expect(html).toContain('ข้อมูลส่วนตัว');
    expect(html).toContain('เนื้อหาไม่เหมาะสม');
    expect(html).toContain('แจ้งเตือนในแอป');
    expect(html).toContain('/app/notifications');
  });
});
