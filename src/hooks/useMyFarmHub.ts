import { useMemo } from 'react';
import { useCropWatch } from '@/hooks/useCropWatch';
import { useFarmArea } from '@/hooks/useFarmArea';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { useWeather } from '@/hooks/useWeather';
import { buildMyFarmHub } from '@/services/my-farm/my-farm-hub-service';

export function useMyFarmHub() {
  const guestMemory = useGuestMemory();
  const farmArea = useFarmArea();
  const cropWatch = useCropWatch();
  const weather = useWeather();

  const hub = useMemo(
    () =>
      buildMyFarmHub({
        guestMemory: guestMemory.state,
        farmPlots: farmArea.plots,
        cropWatches: cropWatch.watches,
        weatherForecast: weather.forecast,
      }),
    [cropWatch.watches, farmArea.plots, guestMemory.state, weather.forecast],
  );

  return {
    ...hub,
    guestMemory,
    farmArea,
    cropWatch,
    weather,
  };
}
