import type {
  CropWatch,
  CropWatchAlertInput,
  CropWatchAlertPreference,
  CropWatchAlertType,
  CropWatchInput,
  CropWatchState,
} from '@/services/crop-prices/crop-watch.types';
import type { CropPriceItem } from '@/services/crop-prices/crop-price.types';

const cropWatchStorageKey = 'kasethub.cropWatch.v1';
const cropWatchChangedEvent = 'kasethub:crop-watch-changed';
const currentVersion = 1;

export const cropWatchAlertLabels: Record<CropWatchAlertType, string> = {
  price_up: 'แจ้งเตือนเมื่อราคาขึ้น',
  price_down: 'แจ้งเตือนเมื่อราคาลง',
  target_price: 'แจ้งเตือนเมื่อถึงราคาเป้าหมาย',
  weekly_summary: 'สรุปราคาทุกสัปดาห์',
};

export const cropWatchLocalOnlyNotice =
  'การติดตามพืชและแจ้งเตือนราคาเป็นข้อมูลตัวอย่างในเครื่องนี้ ยังไม่มี push notification จริง ไม่มี API ราคา และไม่มี backend write';

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function createDefaultState(): CropWatchState {
  return {
    version: currentVersion,
    watches: [],
    migrations: [],
    updatedAt: now(),
  };
}

function createWatchId(cropKey: string) {
  return `crop-watch:${cropKey}`;
}

function createAlertId(cropKey: string, alertType: CropWatchAlertType) {
  return `crop-watch-alert:${cropKey}:${alertType}`;
}

function safeParseJson<T>(rawValue: string | null): T | undefined {
  if (!rawValue) {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return undefined;
  }
}

function normalizeAlertPreference(cropKey: string, input: Partial<CropWatchAlertPreference>): CropWatchAlertPreference | undefined {
  if (!input.alertType || !cropWatchAlertLabels[input.alertType]) {
    return undefined;
  }

  const timestamp = now();

  return {
    id: input.id || createAlertId(cropKey, input.alertType),
    alertType: input.alertType,
    enabled: Boolean(input.enabled),
    targetPrice: typeof input.targetPrice === 'number' && Number.isFinite(input.targetPrice) ? input.targetPrice : undefined,
    createdAt: input.createdAt || timestamp,
    updatedAt: input.updatedAt || timestamp,
  };
}

function normalizeWatch(input: Partial<CropWatch>): CropWatch | undefined {
  if (!input.cropKey || !input.cropName || !input.priceId) {
    return undefined;
  }

  const timestamp = now();
  const cropKey = input.cropKey;
  const alertPreferences = Array.isArray(input.alertPreferences)
    ? input.alertPreferences
        .map((preference) => normalizeAlertPreference(cropKey, preference))
        .filter((preference): preference is CropWatchAlertPreference => Boolean(preference))
    : [];

  return {
    id: input.id || createWatchId(cropKey),
    cropKey,
    cropName: input.cropName,
    category: input.category || 'พืชไร่',
    priceId: input.priceId,
    preferredMarketId: input.preferredMarketId || '',
    preferredMarketLabel: input.preferredMarketLabel || 'ตลาดตัวอย่าง',
    preferredRegionId: input.preferredRegionId || '',
    preferredRegionLabel: input.preferredRegionLabel || 'พื้นที่ตัวอย่าง',
    sourceLabel: input.sourceLabel || 'แหล่งข้อมูลตัวอย่าง',
    unitLabel: input.unitLabel || 'หน่วยตัวอย่าง',
    latestReferencePrice: typeof input.latestReferencePrice === 'number' ? input.latestReferencePrice : 0,
    latestPriceLabel: input.latestPriceLabel || 'ราคาอ้างอิงตัวอย่าง',
    reliabilityLevel: input.reliabilityLevel || 'demo_sample',
    enabled: input.enabled ?? true,
    createdAt: input.createdAt || timestamp,
    updatedAt: input.updatedAt || timestamp,
    alertPreferences,
    metadata: input.metadata && typeof input.metadata === 'object' ? input.metadata : {},
  };
}

export function migrateCropWatchState(input: unknown): CropWatchState {
  const fallback = createDefaultState();

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const partial = input as Partial<CropWatchState>;
  const watches = Array.isArray(partial.watches)
    ? partial.watches
        .map((watch) => normalizeWatch(watch))
        .filter((watch): watch is CropWatch => Boolean(watch))
    : [];

  return {
    version: currentVersion,
    watches,
    migrations: Array.isArray(partial.migrations) ? partial.migrations : [],
    updatedAt: partial.updatedAt || now(),
  };
}

function getStoredState() {
  if (!canUseStorage()) {
    return createDefaultState();
  }

  return migrateCropWatchState(safeParseJson<CropWatchState>(window.localStorage.getItem(cropWatchStorageKey)));
}

function notifyCropWatchChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(cropWatchChangedEvent));
  }
}

function persistState(state: CropWatchState) {
  const nextState = {
    ...state,
    updatedAt: now(),
  };

  if (!canUseStorage()) {
    return nextState;
  }

  try {
    window.localStorage.setItem(cropWatchStorageKey, JSON.stringify(nextState));
    notifyCropWatchChanged();
    return nextState;
  } catch {
    return state;
  }
}

function createWatchFromPrice(price: CropPriceItem, input?: Partial<CropWatchInput>): CropWatch {
  const timestamp = now();

  return {
    id: createWatchId(price.cropKey),
    cropKey: price.cropKey,
    cropName: price.cropName,
    category: price.category,
    priceId: price.id,
    preferredMarketId: price.market.id,
    preferredMarketLabel: price.market.label,
    preferredRegionId: price.region.id,
    preferredRegionLabel: price.region.label,
    sourceLabel: price.sourceLabel,
    unitLabel: price.unit.label,
    latestReferencePrice: price.referencePrice,
    latestPriceLabel: price.priceLabel,
    reliabilityLevel: price.reliabilityLevel,
    enabled: input?.enabled ?? true,
    createdAt: timestamp,
    updatedAt: timestamp,
    alertPreferences: [],
    metadata: {
      priceId: price.id,
      isDemoSample: price.isDemoSample,
      disclaimer: price.disclaimer,
      ...input?.metadata,
    },
  };
}

function upsertAlertPreference(
  alertPreferences: CropWatchAlertPreference[],
  cropKey: string,
  alertType: CropWatchAlertType,
  enabled = true,
  targetPrice?: number,
) {
  const timestamp = now();
  const nextPreference: CropWatchAlertPreference = {
    id: createAlertId(cropKey, alertType),
    alertType,
    enabled,
    targetPrice: alertType === 'target_price' ? targetPrice : undefined,
    createdAt: alertPreferences.find((preference) => preference.alertType === alertType)?.createdAt || timestamp,
    updatedAt: timestamp,
  };

  return [nextPreference, ...alertPreferences.filter((preference) => preference.alertType !== alertType)];
}

function refreshWatchFromPrice(watch: CropWatch, price: CropPriceItem): CropWatch {
  return {
    ...watch,
    priceId: price.id,
    preferredMarketId: price.market.id,
    preferredMarketLabel: price.market.label,
    preferredRegionId: price.region.id,
    preferredRegionLabel: price.region.label,
    sourceLabel: price.sourceLabel,
    unitLabel: price.unit.label,
    latestReferencePrice: price.referencePrice,
    latestPriceLabel: price.priceLabel,
    reliabilityLevel: price.reliabilityLevel,
    updatedAt: now(),
  };
}

export function getCropWatchState() {
  return getStoredState();
}

export function watchCrop(input: CropWatchInput) {
  const state = getStoredState();
  const existingWatch = state.watches.find((watch) => watch.cropKey === input.price.cropKey);
  let nextWatch = existingWatch
    ? refreshWatchFromPrice({ ...existingWatch, enabled: input.enabled ?? existingWatch.enabled }, input.price)
    : createWatchFromPrice(input.price, input);

  input.alertTypes?.forEach((alertType) => {
    nextWatch = {
      ...nextWatch,
      alertPreferences: upsertAlertPreference(
        nextWatch.alertPreferences,
        nextWatch.cropKey,
        alertType,
        true,
        alertType === 'target_price' ? input.targetPrice : undefined,
      ),
    };
  });

  return persistState({
    ...state,
    watches: [nextWatch, ...state.watches.filter((watch) => watch.cropKey !== nextWatch.cropKey)],
  });
}

export function removeCropWatch(cropKey: string) {
  const state = getStoredState();

  return persistState({
    ...state,
    watches: state.watches.filter((watch) => watch.cropKey !== cropKey),
  });
}

export function setCropWatchEnabled(cropKey: string, enabled: boolean) {
  const state = getStoredState();

  return persistState({
    ...state,
    watches: state.watches.map((watch) =>
      watch.cropKey === cropKey
        ? {
            ...watch,
            enabled,
            updatedAt: now(),
          }
        : watch,
    ),
  });
}

export function setCropWatchAlertPreference(input: CropWatchAlertInput) {
  const state = watchCrop({
    price: input.price,
  });

  const nextState = {
    ...state,
    watches: state.watches.map((watch) =>
      watch.cropKey === input.price.cropKey
        ? {
            ...watch,
            enabled: true,
            alertPreferences: upsertAlertPreference(
              watch.alertPreferences,
              watch.cropKey,
              input.alertType,
              input.enabled,
              input.targetPrice,
            ),
            updatedAt: now(),
          }
        : watch,
    ),
  };

  return persistState(nextState);
}

export function toggleCropWatchAlertPreference(price: CropPriceItem, alertType: CropWatchAlertType) {
  const state = getStoredState();
  const watch = state.watches.find((item) => item.cropKey === price.cropKey);
  const currentPreference = watch?.alertPreferences.find((preference) => preference.alertType === alertType);

  return setCropWatchAlertPreference({
    price,
    alertType,
    enabled: !currentPreference?.enabled,
    targetPrice: currentPreference?.targetPrice,
  });
}

export function isWatchingCrop(cropKey: string) {
  return getStoredState().watches.some((watch) => watch.cropKey === cropKey && watch.enabled);
}

export function isCropWatchAlertEnabled(cropKey: string, alertType: CropWatchAlertType) {
  const watch = getStoredState().watches.find((item) => item.cropKey === cropKey);
  return Boolean(watch?.enabled && watch.alertPreferences.some((preference) => preference.alertType === alertType && preference.enabled));
}

export function findCropWatch(cropKey: string) {
  return getStoredState().watches.find((watch) => watch.cropKey === cropKey);
}

export function subscribeCropWatch(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === cropWatchStorageKey) {
      listener();
    }
  };

  window.addEventListener(cropWatchChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(cropWatchChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}
