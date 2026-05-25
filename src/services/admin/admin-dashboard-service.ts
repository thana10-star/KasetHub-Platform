import {
  adminDashboardBoundaries,
  adminFixtureAuditLogs,
  adminFixtureRisks,
  adminFixtureTasks,
  adminModuleLabels,
} from '@/services/admin/admin-fixtures';
import type {
  AdminDashboardData,
  AdminDashboardSummary,
  AdminHealthStatus,
  AdminModuleStatus,
  AdminReviewQueueSummary,
  AdminRiskItem,
} from '@/services/admin/admin.types';
import { getAIProxyAdapterStatus } from '@/services/ai-proxy/ai-proxy-adapter';
import { getCreditSummary, getState as getAICreditState } from '@/services/ai-credits/ai-credit-service';
import { getGuestSyncAdapterStatus } from '@/services/backend/guest-sync-adapter';
import { articleContents, videoContentItems } from '@/services/content/content-fixtures';
import { buildYouTubeImportPlan } from '@/services/content/youtube-import-planner';
import { cropPriceItems } from '@/services/crop-prices/crop-price-fixtures';
import { cropPriceSources } from '@/services/crop-prices/crop-price-sources';
import { getCropWatchState } from '@/services/crop-prices/crop-watch-service';
import { computeHarvestYieldSummary } from '@/services/farm-records/farm-cost-analytics-service';
import { computeFarmLedgerSummary, getFarmRecordsState } from '@/services/farm-records/farm-records-service';
import {
  createLocalModeratorQueueItems,
  getCommunityModerationState,
} from '@/services/community-moderation/community-moderation-service';
import { mockModeratorQueueItems } from '@/services/community-moderation/community-moderation-fixtures';
import { getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import { getSupabaseStatus } from '@/services/supabase/supabase-status';

function countByStatus<T extends { status: string }>(items: T[], status: string) {
  return items.filter((item) => item.status === status).length;
}

function deriveSystemHealth(statuses: AdminHealthStatus[]): AdminHealthStatus {
  if (statuses.includes('blocked')) {
    return 'blocked';
  }

  if (statuses.includes('attention')) {
    return 'attention';
  }

  if (statuses.includes('mock_only')) {
    return 'mock_only';
  }

  return 'healthy';
}

function createModule(input: AdminModuleStatus): AdminModuleStatus {
  return input;
}

export function buildAdminDashboardData(): AdminDashboardData {
  const allContentItems = [...articleContents, ...videoContentItems];
  const moderationState = getCommunityModerationState();
  const localQueueItems = createLocalModeratorQueueItems(moderationState.reports);
  const moderationQueueItems = [...localQueueItems, ...mockModeratorQueueItems];
  const cropWatchState = getCropWatchState();
  const farmRecordsState = getFarmRecordsState();
  const farmLedgerSummary = computeFarmLedgerSummary();
  const farmHarvestSummary = computeHarvestYieldSummary(farmRecordsState);
  const aiProxyStatus = getAIProxyAdapterStatus();
  const aiCreditState = getAICreditState();
  const aiCreditSummary = getCreditSummary(aiCreditState);
  const youtubeImportPlan = buildYouTubeImportPlan();
  const guestSyncStatus = getGuestSyncAdapterStatus();
  const phoneAuthStatus = getPhoneAuthAdapterStatus();
  const lineAuthStatus = getLineAuthAdapterStatus();
  const supabaseStatus = getSupabaseStatus();
  const pendingReports = moderationState.reports.filter((report) => report.status === 'pending_review').length;
  const aiSafetyItems = aiProxyStatus.warnings.length + aiCreditState.usageHistory.length;
  const sourceNeedsReview = cropPriceSources.filter((source) => source.status === 'manual_review_needed').length;
  const sourcePlanned = cropPriceSources.filter((source) => source.status === 'planned').length;
  const contentDrafts = countByStatus(allContentItems, 'draft');
  const contentInReview = countByStatus(allContentItems, 'review');
  const publishedContent = countByStatus(allContentItems, 'published');
  const contentReviewDemand =
    contentInReview + youtubeImportPlan.needsTranscriptCount + youtubeImportPlan.candidates.filter((item) => item.editorReview === 'needs_safety_review').length;

  const modules: AdminModuleStatus[] = [
    createModule({
      id: 'content',
      title: adminModuleLabels.content,
      summary: 'บทความ วิดีโอ และสถานะ publishing จาก fixtures ในเครื่อง',
      status: contentReviewDemand > 0 ? 'attention' : 'mock_only',
      metricLabel: 'published',
      metricValue: publishedContent,
      readinessLabel: `${contentDrafts} draft · ${contentInReview} review · ${publishedContent} published`,
      route: '/app/content-admin-preview',
    }),
    createModule({
      id: 'youtube_import',
      title: adminModuleLabels.youtube_import,
      summary: 'แผนนำเข้าวิดีโอจาก owner channel config โดยไม่เรียก YouTube API',
      status: youtubeImportPlan.needsTranscriptCount > 0 ? 'attention' : 'mock_only',
      metricLabel: 'candidates',
      metricValue: youtubeImportPlan.candidateCount,
      readinessLabel: `${youtubeImportPlan.readyForOutlineCount} พร้อม outline · ${youtubeImportPlan.needsTranscriptCount} ต้องมี transcript`,
      route: '/app/content-admin-preview',
    }),
    createModule({
      id: 'community',
      title: adminModuleLabels.community,
      summary: 'โพสต์ชุมชนยังเป็น demo feed และใช้ Guest Memory สำหรับ like/save',
      status: 'mock_only',
      metricLabel: 'reports',
      metricValue: moderationState.reports.length,
      readinessLabel: 'ชุมชนยังไม่มี backend write',
      route: '/app/community',
    }),
    createModule({
      id: 'moderation',
      title: adminModuleLabels.moderation,
      summary: 'รายงานและคิวผู้ดูแลจาก M23 local/mock foundation',
      status: pendingReports > 0 ? 'attention' : 'mock_only',
      metricLabel: 'queue',
      metricValue: moderationQueueItems.length,
      readinessLabel: `${pendingReports} pending reports · ${moderationState.hiddenPosts.length} hidden local posts`,
      route: '/app/moderation-center',
    }),
    createModule({
      id: 'crop_prices',
      title: adminModuleLabels.crop_prices,
      summary: 'แหล่งราคาและรายการราคาอ้างอิงตัวอย่างจาก M21',
      status: sourceNeedsReview > 0 || sourcePlanned > 0 ? 'attention' : 'mock_only',
      metricLabel: 'sources',
      metricValue: cropPriceSources.length,
      readinessLabel: `${sourcePlanned} planned · ${sourceNeedsReview} needs review · ${cropPriceItems.length} demo items`,
      route: '/app/prices',
    }),
    createModule({
      id: 'crop_watch',
      title: adminModuleLabels.crop_watch,
      summary: 'พืชที่ติดตามและ alert preference อยู่ใน localStorage เท่านั้น',
      status: 'mock_only',
      metricLabel: 'watches',
      metricValue: cropWatchState.watches.length,
      readinessLabel: `${cropWatchState.watches.filter((watch) => watch.enabled).length} enabled watches`,
      route: '/app/crop-watch',
    }),
    createModule({
      id: 'farm_records',
      title: adminModuleLabels.farm_records,
      summary: 'Local-first farmer-facing farm records and finance ledger UI with M93 elder-friendly My Farm navigation, M92.1 compact home discovery, harvest/yield records, cost-per-kg analytics, category breakdown, break-even estimates, export/restore, and disabled sync consent prototype; no cloud sync, GPS, Supabase writes, AI processing, or official tax/accounting claims',
      status: 'mock_only',
      metricLabel: 'records',
      metricValue: farmRecordsState.farmActivityRecords.length + farmRecordsState.farmFinanceEntries.length + farmRecordsState.farmHarvestRecords.length,
      readinessLabel: `${farmRecordsState.farmPlots.length} plots - ${farmRecordsState.cropCycles.filter((cycle) => cycle.status === 'active').length} active cycles - ${farmHarvestSummary.totalHarvestKg.toLocaleString('th-TH')} kg harvest - net ${farmLedgerSummary.netProfit.toLocaleString('th-TH')} THB`,
      route: '/app/farm-records',
    }),
    createModule({
      id: 'ai_safety',
      title: adminModuleLabels.ai_safety,
      summary: 'AI proxy, credit state, warnings และ safety review preview',
      status: aiProxyStatus.networkCallsEnabled ? 'blocked' : 'attention',
      metricLabel: 'safety items',
      metricValue: aiSafetyItems,
      readinessLabel: `${aiProxyStatus.modeLabel} · ${aiCreditSummary.totalAvailable} local credits available`,
      route: '/app/ai-proxy-status',
    }),
    createModule({
      id: 'plant_analysis',
      title: adminModuleLabels.plant_analysis,
      summary: 'ภาพวิเคราะห์โรคพืชยัง local/mock และไม่มี upload จริง',
      status: 'mock_only',
      metricLabel: 'storage',
      metricValue: 'local',
      readinessLabel: 'ยังไม่มี Supabase Storage หรือ Vision AI จริง',
      route: '/app/analyze',
    }),
    createModule({
      id: 'guest_sync',
      title: adminModuleLabels.guest_sync,
      summary: 'Guest Sync adapter และ dry-run status จาก M16',
      status: guestSyncStatus.networkCallsEnabled ? 'blocked' : 'mock_only',
      metricLabel: 'mode',
      metricValue: guestSyncStatus.modeLabel,
      readinessLabel: guestSyncStatus.readinessLabel,
      route: '/app/guest-sync-status',
    }),
    createModule({
      id: 'auth',
      title: adminModuleLabels.auth,
      summary: 'Phone/LINE auth boundary ยังเป็น local mock และไม่มี admin auth',
      status: phoneAuthStatus.networkCallsEnabled || lineAuthStatus.networkCallsEnabled ? 'blocked' : 'mock_only',
      metricLabel: 'sessions',
      metricValue: Number(phoneAuthStatus.isSessionActive) + Number(lineAuthStatus.isSessionActive),
      readinessLabel: `${phoneAuthStatus.modeLabel} · ${lineAuthStatus.modeLabel}`,
      route: '/app/auth/status',
    }),
    createModule({
      id: 'system_health',
      title: adminModuleLabels.system_health,
      summary: 'Supabase, backend flags, network boundary และ mock-only health',
      status: supabaseStatus.canCreateClient ? 'attention' : 'mock_only',
      metricLabel: 'Supabase',
      metricValue: supabaseStatus.canCreateClient ? 'ready' : 'off',
      readinessLabel: supabaseStatus.label,
      route: '/app/account-preview',
    }),
  ];

  const systemHealth = deriveSystemHealth(modules.map((module) => module.status));

  const summary: AdminDashboardSummary = {
    contentItems: allContentItems.length,
    publishedContent,
    contentDrafts,
    contentInReview,
    youtubeImportCandidates: youtubeImportPlan.candidateCount,
    pendingCommunityReports: pendingReports,
    moderationQueueItems: moderationQueueItems.length,
    cropPriceSources: cropPriceSources.length,
    cropPriceItems: cropPriceItems.length,
    cropWatchItems: cropWatchState.watches.length,
    farmRecordItems: farmRecordsState.farmActivityRecords.length + farmRecordsState.farmFinanceEntries.length + farmRecordsState.farmHarvestRecords.length,
    aiSafetyItems,
    systemHealth,
  };

  const reviewQueues: AdminReviewQueueSummary[] = [
    {
      id: 'queue-content',
      moduleId: 'content',
      title: 'Content review',
      pending: contentDrafts,
      inReview: contentReviewDemand,
      completed: publishedContent,
      total: allContentItems.length + youtubeImportPlan.candidateCount,
      note: 'รวมบทความ fixture และแผนนำเข้า YouTube ที่ต้องตรวจ transcript/safety',
    },
    {
      id: 'queue-moderation',
      moduleId: 'moderation',
      title: 'Community moderation',
      pending: pendingReports + moderationQueueItems.filter((item) => item.status === 'pending_review').length,
      inReview: moderationQueueItems.filter((item) => item.status === 'reviewed').length,
      completed: moderationQueueItems.filter((item) => item.status === 'action_taken' || item.status === 'dismissed').length,
      total: moderationQueueItems.length,
      note: 'รวม local reports และ mock moderator queue จาก M23',
    },
    {
      id: 'queue-price',
      moduleId: 'crop_prices',
      title: 'Crop price review',
      pending: sourceNeedsReview + sourcePlanned,
      inReview: cropPriceSources.filter((source) => source.status === 'fixture_only').length,
      completed: 0,
      total: cropPriceSources.length,
      note: 'ยังไม่มี production source validation หรือ import job จริง',
    },
  ];

  const dynamicRisks: AdminRiskItem[] = [
    ...adminFixtureRisks,
    ...aiProxyStatus.warnings.map((warning, index) => ({
      id: `admin-ai-warning-${index}`,
      moduleId: 'ai_safety' as const,
      title: 'AI proxy safety warning',
      description: warning,
      severity: 'medium' as const,
      recommendedAction: 'คง provider keys และ credit enforcement ไว้ฝั่ง backend เท่านั้น',
    })),
    ...guestSyncStatus.warnings.slice(0, 2).map((warning, index) => ({
      id: `admin-guest-sync-warning-${index}`,
      moduleId: 'guest_sync' as const,
      title: 'Guest Sync boundary warning',
      description: warning,
      severity: 'medium' as const,
      recommendedAction: 'อย่าเขียน sync marker จริงจนกว่าจะมี auth และ backend-owned sync',
    })),
  ];

  return {
    rolePreview: 'owner',
    summary,
    modules,
    tasks: adminFixtureTasks,
    risks: dynamicRisks,
    auditLogs: adminFixtureAuditLogs,
    reviewQueues,
    healthCards: modules.filter((module) =>
      ['guest_sync', 'auth', 'system_health', 'ai_safety', 'plant_analysis'].includes(module.id),
    ),
    boundaries: adminDashboardBoundaries,
  };
}
