import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AppHomePage } from '@/routes/AppHomePage';
import { FarmRecordsDebugPage } from '@/routes/FarmRecordsDebugPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';

function renderHome() {
  return renderToString(
    <MemoryRouter>
      <AppHomePage />
    </MemoryRouter>,
  );
}

function visibleText(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
}

describe('M116.8 home dashboard redesign', () => {
  test('renders a weather hero near the top with a weather route link', () => {
    const html = renderHome();
    const headerIndex = html.indexOf('KasetHub');
    const weatherIndex = html.indexOf('สภาพอากาศวันนี้');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(weatherIndex).toBeGreaterThan(headerIndex);
    expect(html).toContain('พื้นที่ล่าสุด');
    expect(html).toContain('ดูพยากรณ์');
    expect(html).toContain('/app/weather');
  });

  test('renders the requested quick action cards', () => {
    const html = renderHome();

    expect(html).toContain('ถาม AI เกษตร');
    expect(html).toContain('ราคาเกษตร');
    expect(html).toContain('ชุมชนเกษตร');
    expect(html).toContain('เครื่องมือเกษตร');
    expect(html).toContain('ฟาร์มของฉัน');
    expect(html).toContain('ความรู้/บทความ');
  });

  test('keeps all primary home links available', () => {
    const html = renderHome();

    expect(html).toContain('/app/weather');
    expect(html).toContain('/app/ai');
    expect(html).toContain('/app/prices');
    expect(html).toContain('/app/community');
    expect(html).toContain('/app/calculators');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('/app/help');
    expect(html).toContain('/app/profile');
  });

  test('renders price preview without fake price numbers', () => {
    const html = renderHome();
    const text = visibleText(html);

    expect(text).toContain('กำลังเตรียมเชื่อมแหล่งข้อมูลราคาจริง');
    expect(text).toContain('ข้าว');
    expect(text).toContain('มันสำปะหลัง');
    expect(text).toContain('ยางพารา');
    expect(text).toContain('ปาล์มน้ำมัน');
    expect(text).not.toContain('15,150');
    expect(text).not.toContain('3.15');
    expect(text).not.toContain('บาท/กก.');
    expect(text).not.toContain('ราคาล่าสุด');
  });

  test('renders Community preview without fake engagement', () => {
    const html = renderHome();
    const text = visibleText(html);

    expect(text).toContain('อ่าน ถาม และแบ่งปันเรื่องเกษตรกับชุมชน');
    expect(text).toContain('เปิดชุมชน');
    expect(text).not.toContain('ถูกใจ');
    expect(text).not.toContain('คอมเมนต์ 0');
    expect(text).not.toContain('คำถามล่าสุดในชุมชน');
    expect(text).not.toContain('คุณสายฝน');
  });

  test('does not render internal milestone or prototype wording on Home', () => {
    const text = visibleText(renderHome()).toLowerCase();
    const forbiddenWords = [
      'm116',
      'milestone',
      'readiness',
      'qa',
      'debug',
      'prototype',
      'staging',
      'test',
      'fake',
      'mock',
      'demo',
      'route registry',
      'internal',
    ];

    forbiddenWords.forEach((word) => {
      expect(text).not.toContain(word);
    });
  });

  test('keeps My Farm compact and below the quick actions', () => {
    const html = renderHome();
    const quickIndex = html.indexOf('ทางลัดวันนี้');
    const farmSectionIndex = html.indexOf('home-farm-hub-title');

    expect(quickIndex).toBeGreaterThan(-1);
    expect(farmSectionIndex).toBeGreaterThan(quickIndex);
    expect(html).toContain('บันทึกงาน รายรับรายจ่าย และผลผลิต');
    expect(html).toContain('เปิดฟาร์มของฉัน');
    expect(html).not.toContain('กำไร/ขาดทุน');
    expect(html).not.toContain('ต้นทุนต่อกก.');
    expect(html).not.toContain('ผลผลิตล่าสุด');
    expect(html).not.toContain('/app/farm-records#farm-cost-dashboard');
  });
});

describe('home farm hub launcher model', () => {
  test('builds only the compact launcher model for Home', () => {
    const viewModel = buildHomeFarmHubViewModel();

    expect(viewModel).toEqual({
      eyebrow: 'ฟาร์มของฉัน',
      title: 'ฟาร์มของฉัน',
      subtitle: 'บันทึกงาน รายรับรายจ่าย และผลผลิต',
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
