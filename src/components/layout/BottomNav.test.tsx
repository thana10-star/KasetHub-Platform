import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { BottomNav } from '@/components/layout/BottomNav';

describe('M109 bottom navigation', () => {
  test('renders Community as the third tab and removes Tools from bottom nav', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/community']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(html).toContain('หน้าแรก');
    expect(html).toContain('/app');
    expect(html).toContain('ราคาเกษตร');
    expect(html).toContain('/app/prices');
    expect(html).toContain('ชุมชน');
    expect(html).toContain('/app/community');
    expect(html).toContain('ถาม AI');
    expect(html).toContain('/app/ai');
    expect(html).toContain('โปรไฟล์');
    expect(html).toContain('/app/profile');
    expect(html).not.toContain('เครื่องมือ');
    expect(html).not.toContain('/app/calculators');
  });
});
