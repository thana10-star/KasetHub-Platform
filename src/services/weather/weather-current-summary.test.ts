import { describe, expect, test } from 'vitest';
import {
  buildWeatherCurrentSummary,
  WEATHER_STRONG_WIND_KPH,
} from '@/services/weather/weather-current-summary';

describe('M116.11 weather current summary', () => {
  test('includes real rain chance and farm-work advice when rain chance is high', () => {
    const summary = buildWeatherCurrentSummary({
      conditionLabel: 'ฝนปรอย',
      rainChancePercent: 69,
      windKph: 8,
    });

    expect(summary).toContain('ฝนปรอย');
    expect(summary).toContain('มีโอกาสฝน 69% ในบางพื้นที่ของจังหวัด');
    expect(summary).toContain('ควรเช็กก่อนพ่นยา/ให้น้ำ');
  });

  test('uses low-rain copy without emphasizing a low percentage', () => {
    const summary = buildWeatherCurrentSummary({
      conditionLabel: 'ท้องฟ้าค่อนข้างโปร่ง',
      rainChancePercent: 18,
      windKph: 8,
    });

    expect(summary).toContain('โอกาสฝนต่ำ');
    expect(summary).toContain('เหมาะกับงานกลางแจ้งบางส่วน');
    expect(summary).not.toContain('18%');
  });

  test('adds strong wind warning at the documented project threshold', () => {
    const summary = buildWeatherCurrentSummary({
      conditionLabel: 'มีเมฆบางส่วน',
      rainChancePercent: 35,
      windKph: WEATHER_STRONG_WIND_KPH,
    });

    expect(summary).toContain(`ลม ${WEATHER_STRONG_WIND_KPH} กม./ชม. ค่อนข้างแรง`);
    expect(summary).toContain('โครงสร้างเบา');
  });
});
