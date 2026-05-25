import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AppHomePage } from '@/routes/AppHomePage';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import { createEmptyFarmRecordsState } from '@/services/farm-records/farm-records-service';

describe('M92 home-first Farm Hub navigation', () => {
  test('renders a prominent My Farm card on the home page', () => {
    const html = renderToString(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );

    expect(html).toContain('Home Farm Hub');
    expect(html).toContain('ฟาร์มของฉัน');
    expect(html).toContain('เปิดฟาร์มของฉัน');
    expect(html).toContain('/app/my-farm');
    expect(html).toContain('/app/farm-records');
    expect(html).toContain('/app/farm-records#farm-cost-dashboard');
    expect(html).toContain('บันทึกงานในฟาร์ม');
    expect(html).toContain('รายรับรายจ่าย');
    expect(html).toContain('เช็กอากาศวันนี้');
    expect(html).toContain('/app/weather');
    expect(html).toContain('ยังไม่มีการซิงก์ขึ้นคลาวด์');
  });

  test('builds a short local Farm Records summary for home', () => {
    const viewModel = buildHomeFarmHubViewModel(createDemoFarmRecordsState());

    expect(viewModel.hasFarmData).toBe(true);
    expect(viewModel.primaryRoute).toBe('/app/my-farm');
    expect(viewModel.recordsRoute).toBe('/app/farm-records');
    expect(viewModel.costRoute).toBe('/app/farm-records#farm-cost-dashboard');
    expect(viewModel.facts.length).toBeLessThanOrEqual(4);
    expect(viewModel.facts.some((fact) => fact.id === 'net-profit')).toBe(true);
    expect(viewModel.facts.some((fact) => fact.id === 'cost-per-kg')).toBe(true);
    expect(viewModel.quickActions.map((action) => action.label)).toEqual([
      'ฟาร์มของฉัน',
      'บันทึกงานในฟาร์ม',
      'รายรับรายจ่าย',
      'เช็กอากาศวันนี้',
    ]);
  });

  test('keeps the empty home summary friendly when no farm data exists', () => {
    const viewModel = buildHomeFarmHubViewModel(createEmptyFarmRecordsState());

    expect(viewModel.hasFarmData).toBe(false);
    expect(viewModel.facts).toEqual([]);
    expect(viewModel.emptyStateCopy).toContain('ยังไม่มีข้อมูลฟาร์ม');
    expect(viewModel.quickActions).toHaveLength(4);
  });
});
