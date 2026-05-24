import type { LucideIcon } from 'lucide-react';
import { Beaker, Coins, Ruler, SprayCan, Wheat } from 'lucide-react';
import type { CalculatorCard } from '@/services/agri-calculators/agri-calculator.types';

export const calculatorIconMap: Record<CalculatorCard['iconKey'], LucideIcon> = {
  spray: SprayCan,
  fertilizer: Beaker,
  spacing: Ruler,
  yield: Wheat,
  cost: Coins,
};
