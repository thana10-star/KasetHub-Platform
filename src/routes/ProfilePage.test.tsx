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

describe('M97.1 farmer help, settings, and first-use readiness', () => {
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

  test('shows a clear Community login entry from Profile', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(html).toContain('เข้าสู่ระบบ');
    expect(html).toContain('ใช้สำหรับชุมชนและฟีเจอร์ที่ต้องมีบัญชี');
    expect(html).toContain('/app/login');
  });

  test('shows signed-in Profile state when a Supabase auth session is present', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage
          authSessionOverride={{
            isConfigured: true,
            canUseAuth: true,
            isSignedIn: true,
            userId: '00000000-0000-4000-8000-00000000000a',
            userIdMasked: '000000...000a',
            email: 'farmer@example.com',
            message: 'เข้าสู่ระบบแล้ว',
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('เข้าสู่ระบบแล้ว');
    expect(html).toContain('farmer@example.com');
    expect(html).toContain('ชื่อที่แสดงในชุมชน');
    expect(html).toContain('ใช้ชื่อนี้ในชุมชนจนกว่าจะมีการตั้งชื่อโปรไฟล์');
    expect(html).toContain('ออกจากระบบ');
  });

  test('shows the Community moderation link only for an allowlisted admin', () => {
    const adminHtml = renderToString(
      <MemoryRouter>
        <ProfilePage
          adminEmailsOverride={['owner@example.com']}
          authSessionOverride={{
            isConfigured: true,
            canUseAuth: true,
            isSignedIn: true,
            userId: '00000000-0000-4000-8000-00000000000a',
            userIdMasked: '000000...000a',
            email: 'owner@example.com',
            message: 'เข้าสู่ระบบแล้ว',
          }}
        />
      </MemoryRouter>,
    );
    const nonAdminHtml = renderToString(
      <MemoryRouter>
        <ProfilePage
          adminEmailsOverride={['owner@example.com']}
          authSessionOverride={{
            isConfigured: true,
            canUseAuth: true,
            isSignedIn: true,
            userId: '00000000-0000-4000-8000-00000000000b',
            userIdMasked: '000000...000b',
            email: 'farmer@example.com',
            message: 'เข้าสู่ระบบแล้ว',
          }}
        />
      </MemoryRouter>,
    );

    expect(adminHtml).toContain('ตรวจรายงานชุมชน');
    expect(adminHtml).toContain('/app/community-moderation');
    expect(nonAdminHtml).not.toContain('ตรวจรายงานชุมชน');
    expect(nonAdminHtml).not.toContain('/app/community-moderation');
  });

  test('hides internal links from the production Profile menu', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );
    const lowerHtml = html.toLowerCase();

    expect(html).not.toContain('data-testid="profile-advanced-section"');
    expect(html).not.toContain('/app/admin');
    expect(html).not.toContain('/app/community-moderation');
    expect(html).not.toContain('/app/qa');
    expect(html).not.toContain('/app/field-test-feedback');
    expect(html).not.toContain('/app/supabase-readiness');
    expect(html).not.toContain('Admin');
    expect(html).not.toContain('QA');
    expect(lowerHtml).not.toContain('readiness');
    expect(lowerHtml).not.toContain('prototype');
    expect(lowerHtml).not.toContain('debug');
  });

  test('renders the farmer start guide with My Farm and Farm Records entry points', () => {
    const html = renderToString(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>,
    );

    expect(html).toContain('วิธีเริ่มใช้ KasetHub');
    expect(html).toContain('เริ่มบันทึกฟาร์ม 3 ขั้นตอน');
    expect(html).toContain('เพิ่มแปลง');
    expect(html).toContain('บันทึกรายรับ/รายจ่าย');
    expect(html).toContain('บันทึกผลผลิต');
    expect(html).toContain('ถ้าต้องการจดงานในฟาร์ม เช่น ใส่ปุ๋ย พ่นยา หรือให้น้ำ สามารถเพิ่มทีหลังได้');
    expect(html).toContain('ตัวอย่างชื่อแปลง: แปลงข้าวหลังบ้าน');
    expect(html).toContain('ตัวอย่างงาน: ใส่ปุ๋ยข้าว วันที่ 12 มิ.ย.');
    expect(html).toContain('เริ่มจาก “ฟาร์มของฉัน”');
    expect(html).toContain('เปิดฟาร์มของฉันจากหน้าแรกหรือโปรไฟล์');
    expect(html).toContain('ใช้ดูข้อมูลฟาร์มและสมุดบันทึก');
    expect(html).toContain('เช็กราคาเกษตร');
    expect(html).toContain('ใช้ดูแหล่งข้อมูลราคาสินค้าเกษตร เมื่อระบบเชื่อมข้อมูลจริงแล้ว');
    expect(html).toContain('/app/prices');
    expect(html).toContain('บันทึกรายรับ/รายจ่าย');
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
    expect(html).toContain('ผู้ใช้เข้าใจ 3 ปุ่มหลักไหม');
    expect(html).toContain('ผู้ใช้เข้าใจไหมว่าต้องเริ่มจากเพิ่มแปลง');
    expect(html).toContain('ผู้ใช้เข้าใจรายรับ/รายจ่ายไหม');
    expect(html).toContain('ผู้ใช้กรอกชื่อแปลงได้เองไหม');
    expect(html).toContain('ผู้ใช้เข้าใจคำว่า “บันทึกงานในฟาร์ม” ไหม');
    expect(html).toContain('ผู้ใช้เลือกประเภทงานได้ไหม');
    expect(html).toContain('ผู้ใช้เข้าใจคำว่า “เพิ่มเงิน” หมายถึงรายรับรายจ่ายไหม');
    expect(html).toContain('ผู้ใช้หา “เพิ่มผลผลิต” เจอไหม');
    expect(html).toContain('มีส่วนไหนเยอะเกินไปไหม');
    expect(html).toContain('ผู้ใช้สับสนคำว่า รอบปลูก / จุดคุ้มทุน / ซิงก์ หรือไม่');
    expect(html).toContain('ผู้ใช้ยังต้องการ “บันทึกงานในฟาร์ม” อยู่หน้าแรกหรือไม่');
    expect(html).toContain('ผู้ใช้รู้ไหมว่าช่องไหนจำเป็น/ไม่จำเป็น');
    expect(html).toContain('ผู้ใช้รู้ไหมว่าช่องไหนไม่จำเป็นต้องกรอก');
    expect(html).toContain('คะแนนความง่าย 1-5');
    expect(html).toContain('อย่าใส่ชื่อจริง เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวของผู้ทดสอบ');
    expect(html).toContain('ข้อมูลนี้ไม่ถูกส่งไป backend');
  });

  test('bottom navigation uses Community instead of Tools as the main tab', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/prices']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(html).toContain('หน้าแรก');
    expect(html).toContain('ราคาเกษตร');
    expect(html).toContain('/app/prices');
    expect(html).toContain('ชุมชน');
    expect(html).toContain('/app/community');
    expect(html).not.toContain('ฟาร์มของฉัน');
    expect(html).not.toContain('/app/my-farm');
    expect(html).not.toContain('เครื่องมือ');
    expect(html).not.toContain('/app/calculators');
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
    expect(homeHtml).toContain('ความรู้/บทความ');
    expect(homeHtml).toContain('/app/help');
    expect(homeHtml).not.toContain('ต้นทุนต่อกก.');
    expect(homeHtml).not.toContain('/app/farm-records#farm-cost-dashboard');
    expect(homeHtml.toLowerCase()).not.toContain('prototype');
    expect(homeHtml.toLowerCase()).not.toContain('debug');
    expect(homeHtml).not.toContain('QA');
    expect(homeHtml.toLowerCase()).not.toContain('readiness');
    expect(myFarmHtml).toContain('เริ่มจากเพิ่มแปลง แล้วบันทึกรายรับรายจ่ายหรือผลผลิต');
    expect(myFarmHtml).toContain('บันทึกรายรับ/รายจ่าย');
    expect(myFarmHtml).toContain('บันทึกผลผลิต');
    expect(myFarmHtml).toContain('เปิดสมุดฟาร์ม');
    expect(myFarmHtml).toContain('กำไร/ขาดทุน');
    expect(myFarmHtml).toContain('ผลผลิตรวม');
    expect(myFarmHtml).toContain('สำรอง/กู้คืนได้');
    expect(farmRecordsHtml).toContain('สมุดฟาร์มแบบง่าย');
    expect(farmRecordsHtml).toContain('ข้อมูลเพิ่มเติม / ขั้นสูง');
  });
});
