import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { WeatherPage } from '@/routes/WeatherPage';

describe('M100 weather production readiness UI', () => {
  test('renders production-facing weather copy with a friendly fallback state', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );

    expect(html).toContain('สภาพอากาศเกษตร');
    expect(html).toContain('ข้อมูลสำรองในเครื่อง');
    expect(html).toContain('ไม่ใช้ GPS');
    expect(html).toContain('ไม่บันทึกตำแหน่งส่วนตัว');
    expect(html).toContain('ตั้งค่าพื้นที่');
    expect(html).toContain('/app/weather/preferences');
    expect(html).toContain('ข้อมูลเพิ่มเติมสำหรับทีมงาน');
    expect(html).toContain('ข้อมูลพยากรณ์จริงพร้อมใช้งานเมื่อเปิดการตั้งค่าเซิร์ฟเวอร์');
    expect(html.indexOf('ข้อมูลพยากรณ์จริงพร้อมใช้งานเมื่อเปิดการตั้งค่าเซิร์ฟเวอร์')).toBeGreaterThan(
      html.indexOf('ข้อมูลเพิ่มเติมสำหรับทีมงาน'),
    );
    expect(html).not.toContain('local_fixture');
    expect(html).not.toContain('cache');
    expect(html).not.toContain('API');
    expect(html).not.toContain('prototype');
    expect(html).not.toContain('debug');
    expect(html).not.toContain('Weather QA');
  });
});
