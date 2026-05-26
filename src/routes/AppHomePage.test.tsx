import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AppHomePage } from '@/routes/AppHomePage';
import { FarmRecordsDebugPage } from '@/routes/FarmRecordsDebugPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';

describe('M92.1 compact home Farm Hub launcher', () => {
  test('renders a compact My Farm launcher on the home page', () => {
    const html = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );

    expect(html).toContain('My Farm');
    expect(html).toContain('ฟาร์มของฉัน');
    expect(html).toContain('เปิดฟาร์มของฉัน');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน และผลผลิต');
  });

  test('links to the production price hub without rendering fixture prices on Home', () => {
    const html = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );

    expect(html).toContain('ราคาเกษตร');
    expect(html).toContain('/app/prices');
    expect(html).toContain('ดูรายการสินค้าที่เตรียมเชื่อมแหล่งข้อมูลราคา');
    expect(html).not.toContain('15,150');
    expect(html).not.toContain('3.15');
    expect(html).not.toContain('ราคาอ้างอิง');
  });

  test('links to Community without rendering fake community engagement on Home', () => {
    const html = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );

    expect(html).toContain('ชุมชนเกษตร');
    expect(html).toContain('อ่านเรื่องเล่า ถามปัญหา และแบ่งปันประสบการณ์');
    expect(html).toContain('เปิดชุมชน');
    expect(html).toContain('/app/community');
    expect(html).toContain('/app/calculators');
    expect(html).not.toContain('คุณสายฝน');
    expect(html).not.toContain('คำถามล่าสุดในชุมชน');
  });

  test('renders a prominent AI-first farmer entry without crowding Home', () => {
    const html = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );
    const aiEntryIndex = html.indexOf('data-testid="home-ai-primary-entry"');
    const myFarmIndex = html.indexOf('home-farm-hub-title');

    expect(aiEntryIndex).toBeGreaterThan(-1);
    expect(myFarmIndex).toBeGreaterThan(aiEntryIndex);
    expect(html).toContain('ถาม AI เกษตร');
    expect(html).toContain('ถาม AI ตอนนี้');
    expect(html).toContain('/app/ai');
    expect(html).toContain('ใบเหลืองเกิดจากอะไร');
    expect(html).toContain('เตรียมดินก่อนปลูกยังไง');
    expect(html).toContain('ฝนแบบนี้ควรพ่นยาไหม');
  });

  test('does not render detailed Farm Records metrics on the home card', () => {
    const html = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );

    expect(html).not.toContain('กำไร/ขาดทุน');
    expect(html).not.toContain('ต้นทุนต่อกก.');
    expect(html).not.toContain('ผลผลิตล่าสุด');
    expect(html).not.toContain('รายการล่าสุด');
    expect(html).not.toContain('/app/farm-records#farm-cost-dashboard');
    expect(html).not.toContain('เช็กอากาศวันนี้');
  });

  test('builds only the compact launcher model for home', () => {
    const viewModel = buildHomeFarmHubViewModel();

    expect(viewModel).toEqual({
      eyebrow: 'My Farm',
      title: 'ฟาร์มของฉัน',
      subtitle: 'บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน และผลผลิต',
      primaryRoute: '/app/my-farm',
      primaryLabel: 'เปิดฟาร์มของฉัน',
    });
  });

  test('keeps My Farm and Farm Records detail routes renderable', () => {
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

    expect(myFarmHtml).toContain('/app/farm-records#farm-cost-dashboard');
    expect(myFarmHtml).toContain('สำรอง/กู้คืนได้');
    expect(farmRecordsHtml).toContain('สมุดบันทึกฟาร์ม');
    expect(farmRecordsHtml).toContain('สรุปต้นทุนและกำไรฟาร์ม');
    expect(farmRecordsHtml).toContain('ผลผลิตและการเก็บเกี่ยว');
  });
});
