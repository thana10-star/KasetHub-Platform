import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { CalculatorsPage } from '@/routes/CalculatorsPage';
import { FertilizerCalculatorPage } from '@/routes/FertilizerCalculatorPage';
import { PlantSpacingCalculatorPage } from '@/routes/PlantSpacingCalculatorPage';
import { SprayMixCalculatorPage } from '@/routes/SprayMixCalculatorPage';

describe('M98.1 calculator mobile UX and crop selection', () => {
  test('renders the crop selector as a tappable highlighted picker', () => {
    const html = renderToString(
      <MemoryRouter>
        <PlantSpacingCalculatorPage />
      </MemoryRouter>,
    );

    expect(html).toContain('data-testid="crop-profile-picker"');
    expect(html).toContain('data-testid="crop-selector-control"');
    expect(html).toContain('พืชที่เลือก');
    expect(html).toContain('แตะเพื่อเปลี่ยนชนิดพืช');
    expect(html).toContain('bg-kaset-mint/80');
  });

  test('plant spacing defaults to a suitable crop and includes expanded crop options', () => {
    const html = renderToString(
      <MemoryRouter>
        <PlantSpacingCalculatorPage />
      </MemoryRouter>,
    );
    const selectedCropStart = html.indexOf('data-testid="crop-selector-current"');
    const selectedCropEnd = html.indexOf('ตัวเลขเป็นค่าประมาณ', selectedCropStart);
    const selectedCropHtml = html.slice(selectedCropStart, selectedCropEnd);

    expect(selectedCropHtml).toContain('ข้าวโพด');
    expect(html).toContain('อ้อย');
    expect(html).toContain('มันสำปะหลัง');
    expect(html).toContain('ยางพารา');
    expect(html).toContain('ยูคาลิปตัส / ยูคา');
    expect(html).toContain('พริก');
    expect(html).toContain('ปาล์มน้ำมัน');
  });

  test('calculator landing prioritizes fertilizer and keeps pesticide calculation label-only', () => {
    const html = renderToString(
      <MemoryRouter>
        <CalculatorsPage />
      </MemoryRouter>,
    );
    const fertilizerIndex = html.indexOf('คำนวณปุ๋ย/การให้ปุ๋ย');
    const sprayIndex = html.indexOf('คำนวณตามฉลากยา/สาร');
    const primaryHtml = html.slice(0, html.indexOf('<details'));

    expect(fertilizerIndex).toBeGreaterThan(-1);
    expect(sprayIndex).toBeGreaterThan(fertilizerIndex);
    expect(html).toContain('เครื่องมือหลัก');
    expect(html).toContain('เฉพาะตามฉลาก');
    expect(html).not.toContain('คำนวณผสมยา');
    expect(primaryHtml).not.toContain('Local calculator');
    expect(primaryHtml).not.toContain('planning only');
  });

  test('fertilizer page exposes a mobile-safe fertigation planning scaffold', () => {
    const html = renderToString(
      <MemoryRouter>
        <FertilizerCalculatorPage />
      </MemoryRouter>,
    );

    expect(html).toContain('คำนวณปุ๋ย/การให้ปุ๋ย');
    expect(html).toContain('อายุพืช / ระยะพืช');
    expect(html).toContain('วิธีให้ปุ๋ย');
    expect(html).toContain('ผ่านน้ำหยด');
    expect(html).toContain('data-testid="fertilizer-npk-grid"');
    expect(html).toContain('sm:grid-cols-3');
    expect(html).toContain('data-testid="fertigation-planning-context"');
  });

  test('spray mix route is guarded as label-only instead of a weak dosing recommender', () => {
    const html = renderToString(
      <MemoryRouter>
        <SprayMixCalculatorPage />
      </MemoryRouter>,
    );

    expect(html).toContain('คำนวณตามฉลากยา/สาร');
    expect(html).toContain('ไม่แนะนำอัตราใช้ยา');
    expect(html).toContain('ปริมาณจากฉลากที่กรอกเอง');
    expect(html).not.toContain('คำนวณผสมยา');
  });
});
