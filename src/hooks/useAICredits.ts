import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addUsageLog,
  canAskAI,
  consumeCredit,
  consumeCredits,
  getCreditSummary,
  getState,
  grantRewardedCredit,
  resetDailyIfNeeded,
  subscribeAICredits,
} from '@/services/ai-credits/ai-credit-service';
import type { AddUsageLogInput, AICreditState, GrantRewardedCreditInput } from '@/services/ai-credits/ai-credit.types';

export function useAICredits() {
  const [state, setState] = useState<AICreditState>(() => getState());

  const refresh = useCallback(() => {
    setState(getState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeAICredits(refresh);
  }, [refresh]);

  const summary = useMemo(() => getCreditSummary(state), [state]);

  const runAndRefresh = useCallback((operation: () => AICreditState) => {
    const nextState = operation();
    setState(nextState);
    return nextState;
  }, []);

  return {
    state,
    summary,
    refresh,
    canAskAI,
    consumeCredit: () => {
      const result = consumeCredit();
      setState(result.state);
      return result;
    },
    consumeCredits: (amount: number) => {
      const result = consumeCredits(amount);
      setState(result.state);
      return result;
    },
    grantRewardedCredit: (input?: GrantRewardedCreditInput) => runAndRefresh(() => grantRewardedCredit(input)),
    resetDailyIfNeeded: () => runAndRefresh(() => resetDailyIfNeeded()),
    addUsageLog: (input: AddUsageLogInput) => runAndRefresh(() => addUsageLog(input)),
  };
}
