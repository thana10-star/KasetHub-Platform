import { computeFarmCostDashboard, computeHarvestYieldSummary } from '@/services/farm-records/farm-cost-analytics-service';
import type { FarmRecordsState } from '@/services/farm-records/farm-records.types';

export type HomeFarmHubSummaryFact = {
  id: string;
  label: string;
  value: string;
  helper?: string;
};

export type HomeFarmHubQuickAction = {
  id: string;
  label: string;
  helper: string;
  route: string;
};

export type HomeFarmHubViewModel = {
  hasFarmData: boolean;
  primaryRoute: string;
  recordsRoute: string;
  costRoute: string;
  emptyStateCopy: string;
  facts: HomeFarmHubSummaryFact[];
  quickActions: HomeFarmHubQuickAction[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('th-TH', {
    currency: 'THB',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits,
  }).format(value);
}

function latestDateLabel(value: string | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getLatestRecordDate(state: FarmRecordsState) {
  return [
    ...state.farmActivityRecords.map((record) => record.activityDate),
    ...state.farmFinanceEntries.map((entry) => entry.entryDate),
    ...state.farmHarvestRecords.map((record) => record.harvestDate),
  ]
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

export function buildHomeFarmHubViewModel(state: FarmRecordsState): HomeFarmHubViewModel {
  const dashboard = computeFarmCostDashboard(state);
  const harvestSummary = computeHarvestYieldSummary(state);
  const localRecordCount =
    state.farmPlots.length +
    state.cropCycles.length +
    state.farmActivityRecords.length +
    state.farmFinanceEntries.length +
    state.farmHarvestRecords.length;
  const latestRecordDate = latestDateLabel(getLatestRecordDate(state));
  const facts: HomeFarmHubSummaryFact[] = [];

  if (localRecordCount > 0) {
    facts.push({
      id: 'net-profit',
      label: 'กำไร/ขาดทุน',
      value: formatCurrency(dashboard.netProfit),
      helper: 'จากรายรับรายจ่ายในเครื่องนี้',
    });

    if (harvestSummary.costPerKg !== undefined) {
      facts.push({
        id: 'cost-per-kg',
        label: 'ต้นทุนต่อกก.',
        value: `${formatCurrency(harvestSummary.costPerKg)} / kg`,
        helper: 'จากผลผลิตที่บันทึก',
      });
    } else if (dashboard.costPerRai !== undefined) {
      facts.push({
        id: 'cost-per-rai',
        label: 'ต้นทุนต่อไร่',
        value: formatCurrency(dashboard.costPerRai),
        helper: 'คำนวณจากพื้นที่ที่มี',
      });
    }

    if (harvestSummary.totalHarvestKg > 0) {
      facts.push({
        id: 'harvest',
        label: 'ผลผลิตล่าสุด',
        value: `${formatNumber(harvestSummary.totalHarvestKg)} kg`,
        helper: harvestSummary.latestHarvestDate ? `ล่าสุด ${latestDateLabel(harvestSummary.latestHarvestDate)}` : undefined,
      });
    }

    facts.push({
      id: 'latest-record',
      label: 'รายการล่าสุด',
      value: latestRecordDate ?? `${formatNumber(localRecordCount, 0)} รายการ`,
      helper: `${formatNumber(localRecordCount, 0)} รายการฟาร์มในเครื่องนี้`,
    });
  }

  return {
    hasFarmData: localRecordCount > 0,
    primaryRoute: '/app/my-farm',
    recordsRoute: '/app/farm-records',
    costRoute: '/app/farm-records#farm-cost-dashboard',
    emptyStateCopy: 'ยังไม่มีข้อมูลฟาร์ม เริ่มบันทึกแปลงและรายรับรายจ่ายได้ที่นี่',
    facts: facts.slice(0, 4),
    quickActions: [
      {
        id: 'my-farm',
        label: 'ฟาร์มของฉัน',
        helper: 'เปิดภาพรวมฟาร์ม',
        route: '/app/my-farm',
      },
      {
        id: 'farm-work',
        label: 'บันทึกงานในฟาร์ม',
        helper: 'ใส่ปุ๋ย พ่นยา เก็บเกี่ยว',
        route: '/app/farm-records',
      },
      {
        id: 'farm-money',
        label: 'รายรับรายจ่าย',
        helper: 'ดูต้นทุนและกำไร',
        route: '/app/farm-records#farm-cost-dashboard',
      },
      {
        id: 'weather',
        label: 'เช็กอากาศวันนี้',
        helper: 'ฝน แดด ลม สำหรับงานฟาร์ม',
        route: '/app/weather',
      },
    ],
  };
}
