import type { CropWatch } from '@/services/crop-prices/crop-watch.types';
import type { FarmPlotRecord } from '@/services/farm-area/farm-area.types';
import { farmFinanceCategoryLabels } from '@/services/farm-records/farm-records-config';
import { computeFarmCostDashboard, computeHarvestYieldSummary } from '@/services/farm-records/farm-cost-analytics-service';
import { createFarmRecordsService, createMemoryFarmRecordsStorage } from '@/services/farm-records/farm-records-service';
import type { FarmFinanceCategory, FarmRecordsState } from '@/services/farm-records/farm-records.types';
import type { GuestMemoryState, SavedItem } from '@/services/guest-memory/guest-memory.types';
import type { WeatherLocationForecast } from '@/services/weather/weather.types';
import type {
  MyFarmHub,
  MyFarmInsightCard,
  MyFarmNextAction,
  MyFarmQuickAction,
  MyFarmTimelineItem,
} from '@/services/my-farm/my-farm.types';

export type BuildMyFarmHubInput = {
  guestMemory: GuestMemoryState;
  farmPlots: FarmPlotRecord[];
  farmRecords: FarmRecordsState;
  cropWatches: CropWatch[];
  weatherForecast: WeatherLocationForecast;
};

export const myFarmQuickActions: MyFarmQuickAction[] = [
  {
    id: 'analyze',
    label: 'วิเคราะห์โรคพืช',
    description: 'ถ่าย/เลือกรูปและดูผลจำลอง',
    route: '/app/analyze',
    iconKey: 'scan',
    tone: 'primary',
  },
  {
    id: 'farm-area',
    label: 'วัดพื้นที่แปลง',
    description: 'คำนวณไร่ งาน ตารางวา',
    route: '/app/farm-area',
    iconKey: 'area',
    tone: 'soft',
  },
  {
    id: 'farm-records',
    label: 'สมุดบันทึกฟาร์ม',
    description: 'บันทึกกิจกรรมและรายรับรายจ่าย',
    route: '/app/farm-records',
    iconKey: 'records',
    tone: 'primary',
  },
  {
    id: 'calculators',
    label: 'เครื่องคำนวณเกษตร',
    description: 'ผสมยา ปุ๋ย ระยะปลูก ต้นทุน',
    route: '/app/calculators',
    iconKey: 'calculator',
    tone: 'warning',
  },
  {
    id: 'weather',
    label: 'ดูสภาพอากาศ',
    description: 'ฝน แดด ลม ความชื้นตัวอย่าง',
    route: '/app/weather',
    iconKey: 'weather',
    tone: 'white',
  },
  {
    id: 'crop-watch',
    label: 'ติดตามราคาพืช',
    description: 'ดูพืชที่ติดตามและแจ้งเตือน mock',
    route: '/app/crop-watch',
    iconKey: 'price',
    tone: 'warning',
  },
  {
    id: 'ai',
    label: 'ถาม AI',
    description: 'ถามเรื่องแปลง พืช หรือปัญหาเกษตร',
    route: '/app/ai',
    iconKey: 'ai',
    tone: 'white',
  },
];

function formatThaiDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'ไม่ทราบเวลา';
  }

  return date.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('th-TH', {
    currency: 'THB',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function formatFarmFinanceCategory(category: FarmFinanceCategory | undefined) {
  if (!category) return undefined;
  const label = farmFinanceCategoryLabels[category];
  return label ? `${label.th} / ${label.en}` : category;
}

function latestDate(values: string[]) {
  return values
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

function routeForSavedItem(item: SavedItem) {
  if (item.sourceRoute.startsWith('/app')) {
    return item.sourceRoute;
  }

  if (item.itemType === 'video') {
    return '/app/saved-videos';
  }

  return '/app/memory';
}

function buildTimeline(input: BuildMyFarmHubInput): MyFarmTimelineItem[] {
  const analysisItems = input.guestMemory.savedItems.filter((item) => item.itemType === 'analysis_result');
  const savedArticles = input.guestMemory.savedItems.filter((item) => item.itemType === 'article');
  const savedVideos = input.guestMemory.savedItems.filter((item) => item.itemType === 'video');

  const timeline: MyFarmTimelineItem[] = [
    ...input.guestMemory.farmRecords.map((record) => ({
      id: `farm-record-${record.id}`,
      type: 'farm_record' as const,
      title: record.cropName,
      subtitle: record.diseaseName,
      dateIso: record.updatedAt || record.createdAt,
      dateLabel: formatThaiDate(record.updatedAt || record.createdAt),
      ctaRoute: record.sourceRoute || '/app/analysis-history',
      ctaLabel: 'ดูประวัติ',
      sourceLabel: 'Guest Memory',
    })),
    ...input.farmRecords.farmActivityRecords.map((record) => ({
      id: `farm-activity-${record.id}`,
      type: 'farm_activity' as const,
      title: record.title,
      subtitle: `${record.activityType} · local farm record`,
      dateIso: record.activityDate,
      dateLabel: formatThaiDate(record.activityDate),
      ctaRoute: '/app/farm-records',
      ctaLabel: 'เปิดสมุดฟาร์ม',
      sourceLabel: 'Farm Records local',
    })),
    ...input.farmRecords.farmFinanceEntries.map((entry) => ({
      id: `farm-finance-${entry.id}`,
      type: 'farm_finance' as const,
      title: entry.title,
      subtitle: `${entry.direction} · ${formatCurrency(entry.amount)}`,
      dateIso: entry.entryDate,
      dateLabel: formatThaiDate(entry.entryDate),
      ctaRoute: '/app/farm-records',
      ctaLabel: 'เปิดบัญชีฟาร์ม',
      sourceLabel: 'Farm Ledger local',
    })),
    ...input.farmRecords.farmHarvestRecords.map((record) => ({
      id: `farm-harvest-${record.id}`,
      type: 'farm_harvest' as const,
      title: record.cropName || 'Harvest record',
      subtitle: `${record.normalizedQuantityKg?.toLocaleString('th-TH', { maximumFractionDigits: 2 }) ?? record.quantity.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ${record.normalizedQuantityKg === undefined ? record.quantityUnit : 'kg'} · local harvest`,
      dateIso: record.harvestDate,
      dateLabel: formatThaiDate(record.harvestDate),
      ctaRoute: '/app/farm-records',
      ctaLabel: 'เปิดผลผลิต',
      sourceLabel: 'Farm Harvest local',
    })),
    ...analysisItems.map((item) => ({
      id: `analysis-${item.id}`,
      type: 'analysis_result' as const,
      title: item.title,
      subtitle: item.summary || 'ผลวิเคราะห์โรคพืชที่บันทึกไว้',
      dateIso: item.savedAt,
      dateLabel: formatThaiDate(item.savedAt),
      ctaRoute: '/app/analysis-history',
      ctaLabel: 'เปิดผลวิเคราะห์',
      sourceLabel: 'บันทึกในเครื่อง',
    })),
    ...input.farmPlots.map((plot) => ({
      id: `plot-${plot.id}`,
      type: 'farm_plot' as const,
      title: plot.name,
      subtitle: `${plot.areaLabels.rai} · ${plot.dimensionsLabel}`,
      dateIso: plot.createdAt,
      dateLabel: plot.createdAtLabel || formatThaiDate(plot.createdAt),
      ctaRoute: '/app/farm-area',
      ctaLabel: 'ดูพื้นที่',
      sourceLabel: 'local plot',
    })),
    ...input.cropWatches.map((watch) => ({
      id: `watch-${watch.id}`,
      type: 'crop_watch' as const,
      title: watch.cropName,
      subtitle: `${watch.latestPriceLabel} · ${watch.preferredMarketLabel}`,
      dateIso: watch.updatedAt,
      dateLabel: formatThaiDate(watch.updatedAt),
      ctaRoute: '/app/crop-watch',
      ctaLabel: 'ดูราคาที่ติดตาม',
      sourceLabel: 'local crop watch',
    })),
    ...input.guestMemory.recentAIQuestions.map((question) => ({
      id: `ai-${question.id}`,
      type: 'ai_question' as const,
      title: question.question,
      subtitle: question.answerSummary || question.topic || 'คำถาม AI ล่าสุด',
      dateIso: question.askedAt,
      dateLabel: formatThaiDate(question.askedAt),
      ctaRoute: question.sourceRoute || '/app/ai',
      ctaLabel: 'ถามต่อ',
      sourceLabel: 'AI history local',
    })),
    ...savedArticles.map((item) => ({
      id: `article-${item.id}`,
      type: 'saved_article' as const,
      title: item.title,
      subtitle: item.summary || 'บทความที่บันทึกไว้',
      dateIso: item.savedAt,
      dateLabel: formatThaiDate(item.savedAt),
      ctaRoute: routeForSavedItem(item),
      ctaLabel: 'อ่าน',
      sourceLabel: 'saved article',
    })),
    ...savedVideos.map((item) => ({
      id: `video-${item.id}`,
      type: 'saved_video' as const,
      title: item.title,
      subtitle: item.summary || 'วิดีโอที่บันทึกไว้',
      dateIso: item.savedAt,
      dateLabel: formatThaiDate(item.savedAt),
      ctaRoute: routeForSavedItem(item),
      ctaLabel: 'ดูวิดีโอ',
      sourceLabel: 'saved video',
    })),
  ];

  return timeline
    .sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime())
    .slice(0, 12);
}

function buildInsights(input: BuildMyFarmHubInput): MyFarmInsightCard[] {
  const savedArticles = input.guestMemory.savedItems.filter((item) => item.itemType === 'article');
  const savedVideos = input.guestMemory.savedItems.filter((item) => item.itemType === 'video');
  const analysisItems = input.guestMemory.savedItems.filter((item) => item.itemType === 'analysis_result');
  const totalSquareMeters = input.farmPlots.reduce((total, plot) => total + plot.areaSquareMeters, 0);
  const totalRai = totalSquareMeters / 1600;
  const farmLedgerSummary = createFarmRecordsService(createMemoryFarmRecordsStorage(input.farmRecords)).computeFarmLedgerSummary();
  const harvestYieldSummary = computeHarvestYieldSummary(input.farmRecords);
  const activeCropCycles = input.farmRecords.cropCycles.filter((cycle) => cycle.status === 'active').length;
  const farmRecordItemCount =
    input.farmRecords.farmActivityRecords.length + input.farmRecords.farmFinanceEntries.length + input.farmRecords.farmHarvestRecords.length;

  return [
    {
      id: 'plots',
      module: 'farm_area',
      title: 'แปลงของฉัน',
      detail:
        input.farmPlots.length > 0
          ? `รวมประมาณ ${totalRai.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ไร่ จากข้อมูลในเครื่อง`
          : 'ยังไม่มีแปลงที่บันทึกไว้ เริ่มจากคำนวณพื้นที่แปลงได้เลย',
      valueLabel: `${input.farmPlots.length} แปลง`,
      route: '/app/farm-area',
      badgeLabel: 'local',
      tone: 'green',
    },
    {
      id: 'farm-records',
      module: 'farm_records',
      title: 'สมุดบันทึกฟาร์ม',
      detail:
        farmRecordItemCount > 0
          ? `มี ${activeCropCycles.toLocaleString('th-TH')} รอบปลูก active และบัญชี local-only`
          : 'เริ่มบันทึกกิจกรรม รายรับ และรายจ่ายเพื่อเห็นต้นทุนกับกำไร',
      valueLabel: harvestYieldSummary.costPerKg === undefined ? formatCurrency(farmLedgerSummary.netProfit) : `${formatCurrency(harvestYieldSummary.costPerKg)} / kg`,
      route: '/app/farm-records',
      badgeLabel: 'cost summary',
      tone: farmLedgerSummary.netProfit >= 0 ? 'green' : 'rose',
    },
    {
      id: 'analysis',
      module: 'plant_analysis',
      title: 'ประวัติวิเคราะห์โรคพืช',
      detail:
        input.guestMemory.farmRecords.length + analysisItems.length > 0
          ? 'มีผลวิเคราะห์/บันทึกพืชใน Guest Memory'
          : 'ยังไม่มีผลวิเคราะห์ที่บันทึกไว้',
      valueLabel: `${input.guestMemory.farmRecords.length + analysisItems.length} รายการ`,
      route: '/app/analysis-history',
      badgeLabel: 'local',
      tone: 'sky',
    },
    {
      id: 'crop-watch',
      module: 'crop_watch',
      title: 'พืช/ราคาที่ติดตาม',
      detail:
        input.cropWatches.length > 0
          ? `${input.cropWatches.filter((watch) => watch.enabled).length} พืชเปิดติดตามอยู่`
          : 'ยังไม่ได้ติดตามราคาพืช',
      valueLabel: `${input.cropWatches.length} พืช`,
      route: '/app/crop-watch',
      badgeLabel: 'demo price',
      tone: 'gold',
    },
    {
      id: 'weather',
      module: 'weather',
      title: 'สภาพอากาศที่เกี่ยวข้อง',
      detail: `${input.weatherForecast.today.conditionLabel} · ฝน ${input.weatherForecast.today.rainChancePercent}%`,
      valueLabel: input.weatherForecast.location.label,
      route: '/app/weather',
      badgeLabel: input.weatherForecast.source.sourceType === 'open_meteo' ? 'Open-Meteo' : 'local weather',
      tone: 'neutral',
    },
    {
      id: 'calculator',
      module: 'calculator',
      title: 'เครื่องคำนวณเกษตร',
      detail: 'คำนวณผสมยา ปุ๋ย ระยะปลูก ผลผลิต และต้นทุนแบบ local-only',
      valueLabel: '5 เครื่องมือ',
      route: '/app/calculators',
      badgeLabel: 'M49',
      tone: 'gold',
    },
    {
      id: 'saved-content',
      module: 'saved_content',
      title: 'บทความ/วิดีโอที่บันทึกไว้',
      detail:
        savedArticles.length + savedVideos.length > 0
          ? `${savedArticles.length} บทความ · ${savedVideos.length} วิดีโอ`
          : 'บันทึกบทความหรือวิดีโอไว้กลับมาอ่าน/ดูภายหลัง',
      valueLabel: `${savedArticles.length + savedVideos.length} รายการ`,
      route: '/app/memory',
      badgeLabel: 'Guest Memory',
      tone: 'green',
    },
    {
      id: 'ai-history',
      module: 'ai_history',
      title: 'คำถาม AI ล่าสุด',
      detail:
        input.guestMemory.recentAIQuestions.length > 0
          ? input.guestMemory.recentAIQuestions[0]?.question ?? 'มีคำถาม AI ล่าสุด'
          : 'ยังไม่มีคำถาม AI ที่บันทึกไว้',
      valueLabel: `${input.guestMemory.recentAIQuestions.length} คำถาม`,
      route: '/app/ai',
      badgeLabel: 'local',
      tone: 'sky',
    },
  ];
}

function buildNextActions(input: BuildMyFarmHubInput): MyFarmNextAction[] {
  const analysisItems = input.guestMemory.savedItems.filter((item) => item.itemType === 'analysis_result');
  const actions: MyFarmNextAction[] = [];

  if (input.farmPlots.length === 0) {
    actions.push({
      id: 'add-plot',
      title: 'เริ่มจากบันทึกแปลงแรก',
      detail: 'คำนวณพื้นที่แปลงแบบประมาณการ แล้วเก็บไว้ในเครื่องนี้',
      route: '/app/farm-area',
      ctaLabel: 'วัดพื้นที่แปลง',
      priority: 'primary',
    });
  }

  if (input.farmRecords.farmActivityRecords.length + input.farmRecords.farmFinanceEntries.length === 0) {
    actions.push({
      id: 'add-farm-record',
      title: 'เริ่มสมุดบันทึกฟาร์ม',
      detail: 'บันทึกกิจกรรม รายรับ และรายจ่ายแบบ local-first เพื่อดูต้นทุนและกำไร',
      route: '/app/farm-records',
      ctaLabel: 'เปิดสมุดบันทึกฟาร์ม',
      priority: actions.length === 0 ? 'primary' : 'secondary',
    });
  }

  if (input.guestMemory.farmRecords.length + analysisItems.length === 0) {
    actions.push({
      id: 'analyze-plant',
      title: 'บันทึกสุขภาพพืชครั้งแรก',
      detail: 'ใช้หน้าวิเคราะห์โรคพืชแบบ mock แล้วบันทึกผลไว้ใน My Farm',
      route: '/app/analyze',
      ctaLabel: 'วิเคราะห์โรคพืช',
      priority: actions.length === 0 ? 'primary' : 'secondary',
    });
  }

  if (input.cropWatches.length === 0) {
    actions.push({
      id: 'watch-crop',
      title: 'ติดตามราคาพืชที่ปลูก',
      detail: 'เลือกพืชที่สนใจและตั้งค่าการแจ้งเตือนราคาแบบ demo',
      route: '/app/prices',
      ctaLabel: 'เปิดราคาพืช',
      priority: actions.length === 0 ? 'primary' : 'secondary',
    });
  }

  if (input.guestMemory.recentAIQuestions.length === 0) {
    actions.push({
      id: 'ask-ai',
      title: 'ถาม AI เรื่องแปลงของคุณ',
      detail: 'ถามคำถามทั่วไปแบบ mock โดยยังไม่มี API จริง',
      route: '/app/ai',
      ctaLabel: 'ถาม AI',
      priority: 'secondary',
    });
  }

  return actions.slice(0, 4);
}

export function buildMyFarmHub(input: BuildMyFarmHubInput): MyFarmHub {
  const savedArticles = input.guestMemory.savedItems.filter((item) => item.itemType === 'article');
  const savedVideos = input.guestMemory.savedItems.filter((item) => item.itemType === 'video');
  const analysisItems = input.guestMemory.savedItems.filter((item) => item.itemType === 'analysis_result');
  const timeline = buildTimeline(input);
  const farmLedgerSummary = createFarmRecordsService(createMemoryFarmRecordsStorage(input.farmRecords)).computeFarmLedgerSummary();
  const farmCostDashboard = computeFarmCostDashboard(input.farmRecords);
  const harvestYieldSummary = computeHarvestYieldSummary(input.farmRecords);
  const latestFarmActivityDate = latestDate(input.farmRecords.farmActivityRecords.map((record) => record.activityDate));
  const latestFarmFinanceEntryDate = latestDate(input.farmRecords.farmFinanceEntries.map((entry) => entry.entryDate));
  const latestFarmHarvestDate = latestDate(input.farmRecords.farmHarvestRecords.map((record) => record.harvestDate));
  const farmRecordsLocalItemCount =
    input.farmRecords.farmPlots.length +
    input.farmRecords.cropCycles.length +
    input.farmRecords.farmActivityRecords.length +
    input.farmRecords.farmFinanceEntries.length +
    input.farmRecords.farmHarvestRecords.length;
  const totalLocalItems =
    input.guestMemory.farmRecords.length +
    analysisItems.length +
    input.farmPlots.length +
    farmRecordsLocalItemCount +
    input.cropWatches.length +
    savedArticles.length +
    savedVideos.length +
    input.guestMemory.recentAIQuestions.length;

  return {
    summary: {
      totalLocalItems,
      farmRecordCount: input.guestMemory.farmRecords.length,
      farmActivityRecordCount: input.farmRecords.farmActivityRecords.length,
      farmFinanceEntryCount: input.farmRecords.farmFinanceEntries.length,
      farmActiveCropCycleCount: input.farmRecords.cropCycles.filter((cycle) => cycle.status === 'active').length,
      farmLedgerNetProfit: farmLedgerSummary.netProfit,
      farmCostPerRai: farmCostDashboard.costPerRai,
      farmTopExpenseCategory: formatFarmFinanceCategory(farmCostDashboard.topExpenseCategory?.category),
      farmTopExpenseCategoryAmount: farmCostDashboard.topExpenseCategory?.amount,
      farmTotalHarvestKg: harvestYieldSummary.totalHarvestKg > 0 ? harvestYieldSummary.totalHarvestKg : undefined,
      farmCostPerKg: harvestYieldSummary.costPerKg,
      latestFarmHarvestDate,
      latestFarmActivityDate,
      latestFarmFinanceEntryDate,
      analysisResultCount: analysisItems.length,
      plotCount: input.farmPlots.length,
      cropWatchCount: input.cropWatches.length,
      enabledCropWatchCount: input.cropWatches.filter((watch) => watch.enabled).length,
      savedArticleCount: savedArticles.length,
      savedVideoCount: savedVideos.length,
      recentAIQuestionCount: input.guestMemory.recentAIQuestions.length,
      weatherLocationLabel: input.weatherForecast.location.label,
      weatherConditionLabel: input.weatherForecast.today.conditionLabel,
      timelineCount: timeline.length,
      localStorageLabels: ['Guest Memory', 'kasethub.farmArea.v1', 'kasethub.cropWatch.v1', 'kasethub.farmRecords.v1'],
    },
    quickActions: myFarmQuickActions,
    timeline,
    insights: buildInsights(input),
    localWarnings: [
      {
        id: 'local-only',
        title: 'ข้อมูลอยู่ในเครื่องนี้เท่านั้น',
        detail: 'My Farm รวมข้อมูลจาก Guest Memory และ localStorage ยังไม่มี cloud sync หรือบัญชีจริง',
        severity: 'warning',
        route: '/app/my-farm/settings',
      },
      {
        id: 'no-backend',
        title: 'ยังไม่เชื่อมต่อ backend',
        detail: 'การดูหน้านี้ไม่เขียนข้อมูลไป Supabase และไม่เรียก AI/weather/map API จริง',
        severity: 'info',
      },
    ],
    nextActions: buildNextActions(input),
  };
}
