import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { MyFarmPage } from '@/routes/MyFarmPage';

describe('M90 My Farm cost summary entry', () => {
  test('renders Farm Records restore/sync entry point', () => {
    const html = renderToString(
      <MemoryRouter>
        <MyFarmPage />
      </MemoryRouter>,
    );

    expect(html).toContain('/app/farm-records#farm-cost-dashboard');
    expect(html).toContain('local-only');
    expect(html).toContain('Backup/Restore ready locally');
    expect(html).toContain('Cloud Sync: Not enabled');
    expect(html).toContain('Sync consent: Prototype only');
    expect(html).toContain('ต้นทุนต่อไร่');
    expect(html).toContain('หมวดรายจ่ายสูงสุด');
    expect(html).toContain('kg');
    expect(html).toContain('2026-09-02');
    expect(html).toContain('Cloud Sync');
  });
});
