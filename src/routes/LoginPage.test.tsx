import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { LoginPage } from '@/routes/LoginPage';

describe('M114.1 Community login route', () => {
  test('renders staging-safe email password login form', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/login?next=/app/community']}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(html).toContain('เข้าสู่ระบบ');
    expect(html).toContain('ใช้บัญชีทดสอบเพื่อโพสต์ คอมเมนต์ หรือกดไลก์ในชุมชน');
    expect(html).toContain('สำหรับทดสอบระบบชุมชน');
    expect(html).toContain('อีเมล');
    expect(html).toContain('รหัสผ่าน');
    expect(html).toContain('type="password"');
    expect(html).toContain('เข้าสู่ระบบชุมชน');
  });

  test('renders signed-in state and return to community action', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/login?next=/app/community']}>
        <LoginPage
          sessionOverride={{
            isConfigured: true,
            canUseAuth: true,
            isSignedIn: true,
            userId: '00000000-0000-4000-8000-00000000000a',
            userIdMasked: '000000...000a',
            email: 'farmer@example.com',
            message: 'เข้าสู่ระบบแล้ว',
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('เข้าสู่ระบบแล้ว');
    expect(html).toContain('farmer@example.com');
    expect(html).toContain('กลับไปชุมชน');
    expect(html).toContain('/app/community');
    expect(html).toContain('ออกจากระบบ');
  });
});
