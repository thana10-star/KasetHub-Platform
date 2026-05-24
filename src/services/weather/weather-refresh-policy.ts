import type { WeatherModeStatus } from '@/services/weather/weather.types';

export const WEATHER_MANUAL_REFRESH_COOLDOWN_MS = 2 * 60 * 1000;

export type WeatherRefreshStatus = 'ready' | 'disabled' | 'cooldown' | 'loading';

export type WeatherRefreshPolicy = {
  canRefresh: boolean;
  status: WeatherRefreshStatus;
  cooldownMs: number;
  remainingCooldownMs: number;
  lastSuccessfulRefresh?: string;
  message: string;
  noAutoBackgroundRefresh: true;
};

export function buildWeatherRefreshPolicy(input: {
  modeStatus: WeatherModeStatus;
  lastSuccessfulRefresh?: string;
  nowMs?: number;
  isLoading?: boolean;
  cooldownMs?: number;
}): WeatherRefreshPolicy {
  const cooldownMs = input.cooldownMs ?? WEATHER_MANUAL_REFRESH_COOLDOWN_MS;
  const nowMs = input.nowMs ?? Date.now();
  const lastMs = input.lastSuccessfulRefresh ? Date.parse(input.lastSuccessfulRefresh) : Number.NaN;
  const elapsedMs = Number.isFinite(lastMs) ? Math.max(0, nowMs - lastMs) : cooldownMs;
  const remainingCooldownMs = Math.max(0, cooldownMs - elapsedMs);

  if (input.isLoading) {
    return {
      canRefresh: false,
      status: 'loading',
      cooldownMs,
      remainingCooldownMs,
      lastSuccessfulRefresh: input.lastSuccessfulRefresh,
      message: 'กำลังโหลดข้อมูลอากาศ',
      noAutoBackgroundRefresh: true,
    };
  }

  if (!input.modeStatus.canFetchOpenMeteo) {
    return {
      canRefresh: false,
      status: 'disabled',
      cooldownMs,
      remainingCooldownMs: 0,
      lastSuccessfulRefresh: input.lastSuccessfulRefresh,
      message: 'รีเฟรชจริงปิดอยู่ในโหมดนี้',
      noAutoBackgroundRefresh: true,
    };
  }

  if (remainingCooldownMs > 0) {
    return {
      canRefresh: false,
      status: 'cooldown',
      cooldownMs,
      remainingCooldownMs,
      lastSuccessfulRefresh: input.lastSuccessfulRefresh,
      message: `รออีกประมาณ ${Math.ceil(remainingCooldownMs / 1000)} วินาทีก่อนรีเฟรชอีกครั้ง`,
      noAutoBackgroundRefresh: true,
    };
  }

  return {
    canRefresh: true,
    status: 'ready',
    cooldownMs,
    remainingCooldownMs: 0,
    lastSuccessfulRefresh: input.lastSuccessfulRefresh,
    message: 'พร้อมรีเฟรชด้วยตนเอง ไม่มี background refresh',
    noAutoBackgroundRefresh: true,
  };
}

export function formatWeatherRefreshCooldown(ms: number) {
  if (ms <= 0) return 'พร้อมรีเฟรช';
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} วินาที`;
  return `${Math.ceil(seconds / 60)} นาที`;
}
