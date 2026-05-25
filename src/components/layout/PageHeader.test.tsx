import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { PageHeader } from '@/components/layout/PageHeader';

describe('M104.1 page header home affordance', () => {
  test('uses a clear Home link when showBack is enabled', () => {
    const html = renderToString(
      <MemoryRouter>
        <PageHeader title="หน้าทดสอบ" showBack />
      </MemoryRouter>,
    );

    expect(html).toContain('aria-label="กลับหน้าแรก"');
    expect(html).toContain('href="/app"');
    expect(html).toContain('หน้าทดสอบ');
  });
});

