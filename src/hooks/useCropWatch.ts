import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  findCropWatch,
  getCropWatchState,
  isCropWatchAlertEnabled,
  isWatchingCrop,
  removeCropWatch,
  setCropWatchAlertPreference,
  setCropWatchEnabled,
  subscribeCropWatch,
  toggleCropWatchAlertPreference,
  watchCrop,
} from '@/services/crop-prices/crop-watch-service';
import type {
  CropWatchAlertInput,
  CropWatchAlertType,
  CropWatchInput,
  CropWatchState,
} from '@/services/crop-prices/crop-watch.types';
import type { CropPriceItem } from '@/services/crop-prices/crop-price.types';

export function useCropWatch() {
  const [state, setState] = useState<CropWatchState>(() => getCropWatchState());

  const refresh = useCallback(() => {
    setState(getCropWatchState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeCropWatch(refresh);
  }, [refresh]);

  const counts = useMemo(() => {
    const enabledWatches = state.watches.filter((watch) => watch.enabled);
    const enabledAlerts = state.watches.reduce(
      (total, watch) => total + watch.alertPreferences.filter((preference) => preference.enabled).length,
      0,
    );

    return {
      watches: state.watches.length,
      enabledWatches: enabledWatches.length,
      enabledAlerts,
    };
  }, [state.watches]);

  const runAndRefresh = useCallback((operation: () => CropWatchState) => {
    const nextState = operation();
    setState(nextState);
    return nextState;
  }, []);

  return {
    state,
    watches: state.watches,
    counts,
    refresh,
    watchCrop: (input: CropWatchInput) => runAndRefresh(() => watchCrop(input)),
    removeCropWatch: (cropKey: string) => runAndRefresh(() => removeCropWatch(cropKey)),
    setCropWatchEnabled: (cropKey: string, enabled: boolean) => runAndRefresh(() => setCropWatchEnabled(cropKey, enabled)),
    setAlertPreference: (input: CropWatchAlertInput) => runAndRefresh(() => setCropWatchAlertPreference(input)),
    toggleAlertPreference: (price: CropPriceItem, alertType: CropWatchAlertType) =>
      runAndRefresh(() => toggleCropWatchAlertPreference(price, alertType)),
    isWatchingCrop: (cropKey: string) => isWatchingCrop(cropKey),
    isAlertEnabled: (cropKey: string, alertType: CropWatchAlertType) => isCropWatchAlertEnabled(cropKey, alertType),
    findCropWatch: (cropKey: string) => findCropWatch(cropKey),
  };
}
