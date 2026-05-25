import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  archiveFarmPlot,
  closeCropCycle,
  computeFarmLedgerSummary,
  createActivityRecord,
  createCropCycle,
  createFarmPlot,
  createFinanceEntry,
  deleteActivityRecord,
  deleteFinanceEntry,
  getFarmRecordsState,
  replaceFarmRecordsState,
  subscribeFarmRecords,
  updateActivityRecord,
  updateFinanceEntry,
} from '@/services/farm-records/farm-records-service';
import type {
  CropCycleInput,
  CropCycleStatus,
  FarmActivityRecordInput,
  FarmActivityRecordPatch,
  FarmFinanceEntryInput,
  FarmFinanceEntryPatch,
  FarmLedgerSummaryFilters,
  FarmPlotInput,
  FarmRecordsState,
} from '@/services/farm-records/farm-records.types';

export function useFarmRecords() {
  const [state, setState] = useState<FarmRecordsState>(() => getFarmRecordsState());

  const refresh = useCallback(() => {
    setState(getFarmRecordsState());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeFarmRecords(refresh);
  }, [refresh]);

  const counts = useMemo(
    () => ({
      plots: state.farmPlots.filter((plot) => !plot.isArchived).length,
      archivedPlots: state.farmPlots.filter((plot) => plot.isArchived).length,
      cropCycles: state.cropCycles.length,
      activeCropCycles: state.cropCycles.filter((cycle) => cycle.status === 'active').length,
      activityRecords: state.farmActivityRecords.length,
      financeEntries: state.farmFinanceEntries.length,
    }),
    [state],
  );

  const summary = computeFarmLedgerSummary();

  const runAndRefresh = useCallback(<T,>(operation: () => T) => {
    const result = operation();
    setState(getFarmRecordsState());
    return result;
  }, []);

  return {
    state,
    counts,
    summary,
    refresh,
    replaceState: (nextState: FarmRecordsState) => runAndRefresh(() => replaceFarmRecordsState(nextState)),
    computeSummary: (filters?: FarmLedgerSummaryFilters) => computeFarmLedgerSummary(filters),
    createFarmPlot: (input: FarmPlotInput) => runAndRefresh(() => createFarmPlot(input)),
    archiveFarmPlot: (id: string) => runAndRefresh(() => archiveFarmPlot(id)),
    createCropCycle: (input: CropCycleInput) => runAndRefresh(() => createCropCycle(input)),
    closeCropCycle: (id: string, status: CropCycleStatus) => runAndRefresh(() => closeCropCycle(id, status)),
    createActivityRecord: (input: FarmActivityRecordInput) => runAndRefresh(() => createActivityRecord(input)),
    updateActivityRecord: (id: string, patch: FarmActivityRecordPatch) => runAndRefresh(() => updateActivityRecord(id, patch)),
    deleteActivityRecord: (id: string) => runAndRefresh(() => deleteActivityRecord(id)),
    createFinanceEntry: (input: FarmFinanceEntryInput) => runAndRefresh(() => createFinanceEntry(input)),
    updateFinanceEntry: (id: string, patch: FarmFinanceEntryPatch) => runAndRefresh(() => updateFinanceEntry(id, patch)),
    deleteFinanceEntry: (id: string) => runAndRefresh(() => deleteFinanceEntry(id)),
  };
}
