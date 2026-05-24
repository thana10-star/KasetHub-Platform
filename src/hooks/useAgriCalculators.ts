import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  calculateAgriCalculator,
  calculateAndSaveAgriCalculator,
  clearCalculatorHistory,
  getAgriCalculatorState,
  getLastCalculatorInput,
  subscribeAgriCalculators,
  toggleFavoriteCalculator,
} from '@/services/agri-calculators/agri-calculator-service';
import type {
  AgriCalculatorInputByCategory,
  AgriCalculatorState,
  CalculatorCategory,
} from '@/services/agri-calculators/agri-calculator.types';

export function useAgriCalculators() {
  const [state, setState] = useState<AgriCalculatorState>(() => getAgriCalculatorState());

  const refresh = useCallback(() => {
    setState(getAgriCalculatorState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeAgriCalculators(refresh);
  }, [refresh]);

  const counts = useMemo(
    () => ({
      recentCalculations: state.recentCalculations.length,
      favorites: state.favoriteCalculatorIds.length,
    }),
    [state.favoriteCalculatorIds.length, state.recentCalculations.length],
  );

  const runAndRefresh = useCallback((operation: () => AgriCalculatorState) => {
    const nextState = operation();
    setState(nextState);
    return nextState;
  }, []);

  return {
    state,
    counts,
    recentCalculations: state.recentCalculations,
    favoriteCalculatorIds: state.favoriteCalculatorIds,
    refresh,
    isFavorite: (category: CalculatorCategory) => state.favoriteCalculatorIds.includes(category),
    getLastInput: <C extends CalculatorCategory>(category: C) => getLastCalculatorInput(state, category),
    calculate: calculateAgriCalculator,
    calculateAndSave: <C extends CalculatorCategory>(category: C, input: AgriCalculatorInputByCategory[C]) => {
      const { result, state: nextState } = calculateAndSaveAgriCalculator(category, input);
      setState(nextState);
      return result;
    },
    toggleFavorite: (category: CalculatorCategory) => runAndRefresh(() => toggleFavoriteCalculator(category)),
    clearHistory: () => runAndRefresh(clearCalculatorHistory),
  };
}
