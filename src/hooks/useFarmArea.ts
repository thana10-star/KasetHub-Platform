import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  calculateFarmArea,
  clearFarmAreaDemo,
  getFarmAreaState,
  removeFarmPlot,
  saveFarmPlot,
  subscribeFarmArea,
} from '@/services/farm-area/farm-area-calculator';
import type { FarmAreaCalculationInput, FarmAreaState } from '@/services/farm-area/farm-area.types';

export function useFarmArea() {
  const [state, setState] = useState<FarmAreaState>(() => getFarmAreaState());

  const refresh = useCallback(() => {
    setState(getFarmAreaState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeFarmArea(refresh);
  }, [refresh]);

  const counts = useMemo(
    () => ({
      plots: state.plots.length,
      totalSquareMeters: state.plots.reduce((total, plot) => total + plot.areaSquareMeters, 0),
    }),
    [state.plots],
  );

  const runAndRefresh = useCallback((operation: () => FarmAreaState) => {
    const nextState = operation();
    setState(nextState);
    return nextState;
  }, []);

  return {
    state,
    plots: state.plots,
    counts,
    calculate: (input: FarmAreaCalculationInput) => calculateFarmArea(input),
    savePlot: (input: FarmAreaCalculationInput, name: string) => runAndRefresh(() => saveFarmPlot(input, name)),
    removePlot: (plotId: string) => runAndRefresh(() => removeFarmPlot(plotId)),
    clearDemo: () => runAndRefresh(clearFarmAreaDemo),
    refresh,
  };
}
