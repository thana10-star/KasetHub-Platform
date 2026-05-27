import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AppHomePage } from '@/routes/AppHomePage';
import { FarmRecordsDebugPage } from '@/routes/FarmRecordsDebugPage';
import { MyFarmPage } from '@/routes/MyFarmPage';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';
import { getPriceAdapterSnapshot } from '@/services/prices/price-adapter-service';
import type { ManualCommodityPriceRow } from '@/services/prices/price.types';

function renderHome(props?: Parameters<typeof AppHomePage>[0]) {
  return renderToString(
    <MemoryRouter>
      <AppHomePage {...(props ?? {})} />
    </MemoryRouter>,
  );
}

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('M116.9 home dashboard polish', () => {
  test('renders a premium branded Home header with logo and controls', () => {
    const html = renderHome();

    expect(html).toContain('data-testid="home-premium-header"');
    expect(html).toContain('โลโก้ KasetHub');
    expect(html).toContain('KasetHub');
    expect(html).toContain('ผู้ช่วยเกษตรในมือถือ');
    expect(html).toContain('ศูนย์แจ้งเตือน');
    expect(html).toContain('/app/notifications');
    expect(html).toContain('โปรไฟล์');
    expect(html).toContain('/app/profile');
    expect(html).toContain('rounded-b-[2rem]');
    expect(html).toContain('shadow-[0_18px_46px');
  });

  test('renders a compact weather panel near the top without fake live status', () => {
    const html = renderHome();
    const headerIndex = html.indexOf('KasetHub');
    const weatherIndex = html.indexOf('สภาพอากาศวันนี้');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(weatherIndex).toBeGreaterThan(headerIndex);
    expect(html).toContain('กรุงเทพฯ');
    expect(html).toContain('อัปเดตล่าสุด');
    expect(html).toContain('อุณหภูมิ');
    expect(html).toContain('โอกาสฝน');
    expect(html).toContain('ดูพยากรณ์');
    expect(html).toContain('/app/weather');
    expect(html).not.toContain('LIVE');
    expect(html).not.toContain('งานเกษตร');
  });

  test('renders a clearly labeled source-pending crop price snapshot', () => {
    const html = renderHome();
    const text = visibleText(html);

    expect(text).toContain('ราคาวันนี้');
    expect(text).toContain('ข้อมูลตัวอย่าง');
    expect(text).toContain('รอเชื่อมแหล่งราคาจริง');
    expect(text).toContain('ยังไม่ใช่ราคาจริง');
    expect(text).toContain('ข้าวเปลือกหอมมะลิ');
    expect(text).toContain('12,800');
    expect(text).toContain('▲ 1.2%');
    expect(text).toContain('ยางพารา');
    expect(text).toContain('58.50');
    expect(text).toContain('▼ 0.8%');
    expect(text).toContain('มันสำปะหลัง');
    expect(text).toContain('3.20');
    expect(text).toContain('▲ 2.1%');
    expect(text).toContain('อ้อย');
    expect(text).toContain('1,120');
    expect(text).toContain('▲ 0.6%');
    expect(html).toContain('เช็กราคา');
    expect(html).toContain('/app/prices');
  });

  test('shows validated real Home price rows without mixing sample rows', () => {
    const realPriceRows: ManualCommodityPriceRow[] = [
      {
        commodityCode: 'rice',
        commodityNameTh: 'ข้าว',
        fetchedAt: '2026-05-27T01:00:00.000Z',
        id: 'home-rice',
        marketName: 'ตลาดกลางทดสอบ',
        price: 12500,
        sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
        unit: 'บาท/ตัน',
        updatedAt: '2026-05-27T00:00:00.000Z',
      },
    ];
    const priceSnapshot = getPriceAdapterSnapshot({
      commodityRows: realPriceRows,
      now: new Date('2026-05-27T02:00:00.000Z'),
    });
    const text = visibleText(renderHome({ priceSnapshot }));

    expect(text).toContain('แหล่งข้อมูลจริง');
    expect(text).toContain('ราคาที่ตรวจสอบแล้ว');
    expect(text).toContain('ข้าว');
    expect(text).toContain('12,500');
    expect(text).toContain('บาท/ตัน');
    expect(text).toContain('แหล่งข้อมูลเจ้าของระบบ');
    expect(text).not.toContain('ข้อมูลตัวอย่าง');
    expect(text).not.toContain('ยังไม่ใช่ราคาจริง');
    expect(text).not.toContain('58.50');
  });

  test('keeps Home sample rows when only invalid manual rows exist', () => {
    const priceSnapshot = getPriceAdapterSnapshot({
      commodityRows: [
        {
          commodityCode: 'rice',
          commodityNameTh: 'ข้าว',
          fetchedAt: '2026-05-27T01:00:00.000Z',
          id: 'invalid-home-rice',
          marketName: 'ตลาดกลางทดสอบ',
          price: 12500,
          unit: 'บาท/ตัน',
          updatedAt: '2026-05-27T00:00:00.000Z',
        },
      ],
      now: new Date('2026-05-27T02:00:00.000Z'),
    });
    const text = visibleText(renderHome({ priceSnapshot }));

    expect(text).toContain('ข้อมูลตัวอย่าง');
    expect(text).toContain('ยังไม่ใช่ราคาจริง');
    expect(text).toContain('12,800');
    expect(text).not.toContain('แหล่งข้อมูลจริง');
    expect(text).not.toContain('ราคาที่ตรวจสอบแล้ว');
  });

  test('shows stale copy for stale validated Home price rows', () => {
    const priceSnapshot = getPriceAdapterSnapshot({
      commodityRows: [
        {
          commodityCode: 'rice',
          commodityNameTh: 'ข้าว',
          fetchedAt: '2026-05-24T01:00:00.000Z',
          id: 'stale-home-rice',
          marketName: 'ตลาดกลางทดสอบ',
          price: 12500,
          sourceName: 'แหล่งข้อมูลเจ้าของระบบ',
          unit: 'บาท/ตัน',
          updatedAt: '2026-05-24T00:00:00.000Z',
        },
      ],
      now: new Date('2026-05-27T02:00:00.000Z'),
    });
    const text = visibleText(renderHome({ priceSnapshot }));

    expect(text).toContain('ข้าว');
    expect(text).toContain('12,500');
    expect(text).toContain('บาท/ตัน');
    expect(text).toContain('ข้อมูลเก่า');
    expect(text).not.toContain('58.50');
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

  test('renders latest channel video placeholder without fake engagement', () => {
    const html = renderHome();
    const text = visibleText(html);

    expect(text).toContain('วิดีโอล่าสุดจากช่อง');
    expect(text).toContain('กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง');
    expect(text).toContain('ดูวิดีโอ');
    expect(html).toContain('/app/youtube');
    expect(text).not.toContain('24K');
    expect(text).not.toContain('ยอดดู');
    expect(text).not.toContain('views');
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

  test('keeps lower price preview source-pending and avoids unlabeled real-price claims', () => {
    const html = renderHome();
    const text = visibleText(html);

    expect(text).toContain('กำลังเตรียมเชื่อมแหล่งข้อมูลราคาจริง');
    expect(text).toContain('ข้าว');
    expect(text).toContain('มันสำปะหลัง');
    expect(text).toContain('ยางพารา');
    expect(text).toContain('ปาล์มน้ำมัน');
    expect(text).not.toContain('บาท/กก.');
    expect(text).not.toContain('ราคาล่าสุด');
    expect(text).not.toContain('อัปเดต 10 นาทีที่แล้ว');
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
