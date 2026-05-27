import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { WeatherPage } from '@/routes/WeatherPage';
import {
  weatherAgriRiskLevelCardClass,
  weatherAgriRiskLevelNoteClass,
} from '@/services/weather/weather-agri-risk-boundary';

describe('M104.1 weather UI priority polish', () => {
  test('renders weather-first page order before source details', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );

    const currentIndex = html.indexOf('อากาศตอนนี้');
    const riskIndex = html.indexOf('ความเสี่ยงอากาศเบื้องต้น');
    const updateIndex = html.indexOf('อัปเดตข้อมูล');
    const sourceDetailsIndex = html.indexOf('ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล');

    expect(html).toContain('สภาพอากาศเกษตร');
    expect(html).toContain('เลือกพื้นที่ของคุณ');
    expect(html).toContain('อากาศตอนนี้');
    expect(html).toContain('ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล');
    expect(currentIndex).toBeGreaterThan(-1);
    expect(riskIndex).toBeGreaterThan(currentIndex);
    expect(updateIndex).toBeGreaterThan(riskIndex);
    expect(sourceDetailsIndex).toBeGreaterThan(updateIndex);
    const openMeteoIndex = html.indexOf('Open-Meteo');
    expect(openMeteoIndex === -1 || openMeteoIndex > sourceDetailsIndex).toBe(true);
  });

  test('renders a clear privacy-safe location selector before current weather', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );

    const selectorIndex = html.indexOf('เลือกพื้นที่ของคุณ');
    const currentIndex = html.indexOf('อากาศตอนนี้');
    const sourceDetailsIndex = html.indexOf('ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล');

    expect(selectorIndex).toBeGreaterThan(-1);
    expect(currentIndex).toBeGreaterThan(selectorIndex);
    expect(sourceDetailsIndex).toBeGreaterThan(currentIndex);
    expect(html).toContain('เลือกจังหวัด/เมืองใกล้เคียงเพื่อดูพยากรณ์แบบหยาบ');
    expect(html).toContain('จังหวัด/เมืองใกล้เคียง');
    expect(html).toContain('ยืนยันพื้นที่ของคุณ');
    expect(html).toContain('พื้นที่ปัจจุบัน:');
    expect(html).toContain('กรุงเทพฯ');
    expect(html).toContain('นครราชสีมา');
    expect(html).toContain('ขอนแก่น');
  });

  test('keeps GPS and source details out of the primary weather flow', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );
    const currentIndex = html.indexOf('อากาศตอนนี้');
    const sourceDetailsIndex = html.indexOf('ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล');
    const openMeteoIndex = html.indexOf('Open-Meteo');
    const cacheIndex = html.indexOf('cache');

    expect(html).toContain('ไม่ใช้ GPS');
    expect(html).toContain('ไม่เก็บตำแหน่งละเอียด');
    expect(html).not.toContain('ขออนุญาตใช้ GPS');
    expect(html).not.toContain('เปิด GPS');
    expect(openMeteoIndex === -1 || openMeteoIndex > sourceDetailsIndex).toBe(true);
    expect(cacheIndex === -1 || cacheIndex > sourceDetailsIndex).toBe(true);
    expect(sourceDetailsIndex).toBeGreaterThan(currentIndex);
  });

  test('keeps source/cache/system wording inside the details section', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );
    const sourceDetailsIndex = html.indexOf('ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล');

    expect(sourceDetailsIndex).toBeGreaterThan(-1);
    expect(html.indexOf('cache')).toBeGreaterThan(sourceDetailsIndex);
    expect(html.indexOf('สถานะระบบ')).toBeGreaterThan(sourceDetailsIndex);
    expect(html).not.toContain('prototype');
    expect(html).not.toContain('debug');
    expect(html).not.toContain('Weather QA');
  });

  test('uses clear risk color classes for caution and high levels', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );

    expect(html).toContain('data-risk-level=');
    expect(weatherAgriRiskLevelCardClass.caution).toContain('bg-orange-50');
    expect(weatherAgriRiskLevelNoteClass.caution).toContain('text-orange-950');
    expect(weatherAgriRiskLevelCardClass.high).toContain('bg-rose-50');
    expect(weatherAgriRiskLevelNoteClass.high).toContain('text-rose-900');
  });

  test('renders the persistent home affordance on the Weather header', () => {
    const html = renderToString(
      <MemoryRouter>
        <WeatherPage />
      </MemoryRouter>,
    );

    expect(html).toContain('aria-label="กลับหน้าแรก"');
    expect(html).toContain('href="/app"');
  });
});
