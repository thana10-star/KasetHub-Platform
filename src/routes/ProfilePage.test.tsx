import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHomePage } from '@/routes/AppHomePage';
import { FarmRecordsDebugPage } from '@/routes/FarmRecordsDebugPage';
import { FieldTestFeedbackPage } from '@/routes/FieldTestFeedbackPage';
import { HelpPage } from '@/routes/HelpPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { ProfilePage } from '@/routes/ProfilePage';

describe('M96 farmer help, settings, and first-use readiness', () => {
  test('renders Profile as a farmer-facing settings page with grouped sections', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(html).toContain('โปรไฟล์และการตั้งค่า');
    expect(html).toContain('บัญชีของฉัน');
    expect(html).toContain('ข้อมูลและความเป็นส่วนตัว');
    expect(html).toContain('ช่วยเหลือ');
    expect(html).toContain('สำหรับทีมงานหรือทดสอบ');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('ข้อมูลสำคัญของฟาร์มยังอยู่ในเครื่องนี้');
    expect(html).toContain('การซิงก์ขึ้นคลาวด์ยังไม่เปิดใช้งาน');
  });

  test('shows safe placeholder settings for language, help, support, privacy, and cloud sync', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(html).toContain('ภาษา');
    expect(html).toContain('เลือกภาษาไทยหรืออังกฤษในอนาคต');
    expect(html).toContain('วิธีใช้แอพ');
    expect(html).toContain('คู่มือเริ่มต้นสำหรับเกษตรกร');
    expect(html).toContain('/app/help');
    expect(html).toContain('ติดต่อทีมงาน');
    expect(html).toContain('ช่องทางช่วยเหลือจะเพิ่มในเวอร์ชันถัดไป');
    expect(html).toContain('ข้อมูลและความเป็นส่วนตัว');
    expect(html).toContain('สำรอง กู้คืน และตรวจสอบสถานะการซิงก์');
    expect(html).toContain('/app/farm-records#farm-records-export');
    expect(html).toContain('/app/farm-records#farm-records-restore');
    expect(html).toContain('/app/farm-records#farm-records-sync');
    expect(html).toContain('การซิงก์ข้อมูล');
    expect(html).toContain('ยังไม่เปิดใช้งาน ข้อมูลยังอยู่ในเครื่องนี้');
    expect(html).toContain('ปิดอยู่');
    expect(html).toContain('เร็ว ๆ นี้');
  });

  test('keeps internal Admin and QA links accessible inside a collapsed advanced section', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const advancedIndex = html.indexOf('สำหรับทีมงานหรือทดสอบ');
    const advancedDetails = html.match(/<details(?=[^>]*data-testid="profile-advanced-section")[^>]*>/);

    expect(advancedIndex).toBeGreaterThan(-1);
    expect(advancedDetails).not.toBeNull();
    expect(advancedDetails?.[0]).not.toContain('open');
    expect(html.indexOf('/app/admin')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('Admin')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('/app/qa')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('ตรวจสอบระบบ')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('/app/field-test-feedback')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('สถานะความพร้อม Supabase staging')).toBeGreaterThan(advancedIndex);
    expect(html).toContain('ส่วนนี้สำหรับทีมพัฒนา ไม่จำเป็นต้องใช้ในการใช้งานทั่วไป');
  });

  test('renders the farmer start guide with My Farm and Farm Records entry points', () => {
    const html = renderToString(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>,
    );

    expect(html).toContain('วิธีเริ่มใช้ KasetHub');
    expect(html).toContain('เริ่มบันทึกฟาร์ม 4 ขั้นตอน');
    expect(html).toContain('เพิ่มแปลง');
    expect(html).toContain('บันทึกงานในฟาร์ม');
    expect(html).toContain('บันทึกรายรับรายจ่าย');
    expect(html).toContain('บันทึกผลผลิต');
    expect(html).toContain('เริ่มจาก “ฟาร์มของฉัน”');
    expect(html).toContain('กดฟาร์มของฉันจากเมนูล่าง');
    expect(html).toContain('ใช้ดูข้อมูลฟาร์มและสมุดบันทึก');
    expect(html).toContain('บันทึกงานในฟาร์ม');
    expect(html).toContain('บันทึกรายรับรายจ่าย');
    expect(html).toContain('ดูต้นทุน กำไร และผลผลิต');
    expect(html).toContain('ใช้เครื่องมือ / ถาม AI / เช็กอากาศ');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('/app/farm-records');
  });

  test('renders the local-only field-test feedback checklist with privacy warning', () => {
    const html = renderToString(
      <MemoryRouter>
        <FieldTestFeedbackPage />
      </MemoryRouter>,
    );

    expect(html).toContain('บันทึกทดสอบกับผู้ใช้');
    expect(html).toContain('ผู้ทดสอบเข้าใจหน้าแรกไหม');
    expect(html).toContain('หา “ฟาร์มของฉัน” เจอไหม');
    expect(html).toContain('กดเพิ่มกิจกรรมได้ไหม');
    expect(html).toContain('กดเพิ่มรายรับรายจ่ายได้ไหม');
    expect(html).toContain('ผู้ใช้เข้าใจไหมว่าต้องเริ่มจากเพิ่มแปลง');
    expect(html).toContain('ผู้ใช้เข้าใจคำว่า “บันทึกงานในฟาร์ม” ไหม');
    expect(html).toContain('ผู้ใช้เข้าใจคำว่า “เพิ่มเงิน” หมายถึงรายรับรายจ่ายไหม');
    expect(html).toContain('ผู้ใช้หา “เพิ่มผลผลิต” เจอไหม');
    expect(html).toContain('ผู้ใช้รู้ไหมว่าช่องไหนจำเป็น/ไม่จำเป็น');
    expect(html).toContain('คะแนนความง่าย 1-5');
    expect(html).toContain('อย่าใส่ชื่อจริง เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวของผู้ทดสอบ');
    expect(html).toContain('ข้อมูลนี้ไม่ถูกส่งไป backend');
  });

  test('bottom navigation keeps the M93 farmer-facing slots', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/my-farm']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(html).toContain('หน้าแรก');
    expect(html).toContain('ฟาร์มของฉัน');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('เครื่องมือ');
    expect(html).toContain('/app/calculators');
    expect(html).toContain('ถาม AI');
    expect(html).toContain('โปรไฟล์');
  });

  test('keeps the compact Home Farm Hub and detail routes renderable', () => {
    const homeHtml = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );
    const myFarmHtml = renderToString(
      <MemoryRouter>
        <MyFarmPage />
      </MemoryRouter>,
    );
    const farmRecordsHtml = renderToString(
      <MemoryRouter>
        <FarmRecordsDebugPage />
      </MemoryRouter>,
    );

    expect(homeHtml).toContain('เปิดฟาร์มของฉัน');
    expect(homeHtml).toContain('เริ่มใช้แอพ');
    expect(homeHtml).toContain('/app/help');
    expect(homeHtml).not.toContain('ต้นทุนต่อกก.');
    expect(homeHtml).not.toContain('/app/farm-records#farm-cost-dashboard');
    expect(myFarmHtml).toContain('เริ่มใช้ฟาร์มของฉัน');
    expect(myFarmHtml).toContain('เริ่มจากเพิ่มแปลง แล้วค่อยบันทึกงาน รายรับรายจ่าย และผลผลิต');
    expect(myFarmHtml).toContain('ขั้นตอน');
    expect(myFarmHtml).toContain('บันทึกผลผลิต');
    expect(myFarmHtml).toContain('เปิดสมุดฟาร์ม');
    expect(myFarmHtml).toContain('ดูวิธีใช้');
    expect(myFarmHtml).toContain('/app/help');
    expect(myFarmHtml).toContain('Backup/Restore ready locally');
    expect(farmRecordsHtml).toContain('ผลผลิตและการเก็บเกี่ยว');
  });
});
