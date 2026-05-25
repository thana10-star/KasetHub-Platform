import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHomePage } from '@/routes/AppHomePage';
import { FarmRecordsDebugPage } from '@/routes/FarmRecordsDebugPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { ProfilePage } from '@/routes/ProfilePage';

describe('M93 elder-friendly navigation cleanup', () => {
  test('renders Profile navigation as grouped menu sections', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(html).toContain('บัญชีของฉัน');
    expect(html).toContain('ข้อมูลและความเป็นส่วนตัว');
    expect(html).toContain('ช่วยเหลือ');
    expect(html).toContain('สำหรับทีมงานหรือทดสอบ');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('สมุดฟาร์มและสำรองข้อมูล');
  });

  test('separates internal Admin and QA links into the advanced section', () => {
    const html = renderToString(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const advancedIndex = html.indexOf('สำหรับทีมงานหรือทดสอบ');
    expect(advancedIndex).toBeGreaterThan(-1);
    expect(html.indexOf('Admin Dashboard')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('ตรวจความพร้อม UX')).toBeGreaterThan(advancedIndex);
    expect(html.indexOf('Supabase staging readiness')).toBeGreaterThan(advancedIndex);
  });

  test('bottom navigation includes a dedicated My Farm slot', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/my-farm']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(html).toContain('ฟาร์มของฉัน');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('เครื่องมือ');
    expect(html).toContain('/app/calculators');
    expect(html).toContain('ถาม AI');
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
    expect(homeHtml).not.toContain('ต้นทุนต่อกก.');
    expect(homeHtml).not.toContain('/app/farm-records#farm-cost-dashboard');
    expect(myFarmHtml).toContain('Backup/Restore ready locally');
    expect(farmRecordsHtml).toContain('ผลผลิตและการเก็บเกี่ยว');
  });
});
