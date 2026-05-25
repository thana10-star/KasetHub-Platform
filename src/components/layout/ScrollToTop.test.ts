import { describe, expect, test } from 'vitest';
import { getHashElementId } from '@/components/layout/scroll-utils';

describe('M104.1 scroll-to-top hash handling', () => {
  test('keeps anchor ids available for hash navigation', () => {
    expect(getHashElementId('#farm-cost-dashboard')).toBe('farm-cost-dashboard');
    expect(getHashElementId('#%E0%B8%9F%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%A1')).toBe('ฟาร์ม');
    expect(getHashElementId('farm-cost-dashboard')).toBe('');
  });
});
