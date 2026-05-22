import type { GuestSyncRecordCounts } from '@/services/backend/guest-sync-endpoint.types';
import type {
  GuestSyncMockScenario,
  GuestSyncSkippedRecord,
  MockGuestSyncHandlerResult,
  MockGuestSyncRequest,
  MockGuestSyncResponse,
} from '@/server/guest-sync/mock-guest-sync.types';

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyCounts(): GuestSyncRecordCounts {
  return {
    savedItems: 0,
    likes: 0,
    followedTopics: 0,
    farmRecords: 0,
    recentAIQuestions: 0,
    estimatedTotal: 0,
  };
}

function createCounts(input: Omit<GuestSyncRecordCounts, 'estimatedTotal'>): GuestSyncRecordCounts {
  return {
    ...input,
    estimatedTotal:
      input.savedItems + input.likes + input.followedTopics + input.farmRecords + input.recentAIQuestions,
  };
}

function determineScenario(request: MockGuestSyncRequest): GuestSyncMockScenario {
  if (!request.consent.savedItems && request.localRecordCounts.savedItems + request.localRecordCounts.likes + request.localRecordCounts.followedTopics > 0) {
    return 'missing_consent';
  }

  if (!request.consent.farmRecords && request.localRecordCounts.farmRecords > 0) {
    return 'missing_consent';
  }

  return request.scenario ?? 'success';
}

function getSkippedRecords(request: MockGuestSyncRequest, scenario: GuestSyncMockScenario): GuestSyncSkippedRecord[] {
  const skipped: GuestSyncSkippedRecord[] = [];

  if (!request.consent.recentAIQuestions && request.localRecordCounts.recentAIQuestions > 0) {
    skipped.push({
      recordType: 'recent_ai_questions',
      count: request.localRecordCounts.recentAIQuestions,
      reason: 'ผู้ใช้ยังไม่ยินยอมให้ซิงก์ประวัติคำถาม AI',
    });
  }

  if (scenario === 'partial_success') {
    skipped.push({
      recordType: 'farm_records',
      count: Math.min(1, request.localRecordCounts.farmRecords),
      reason: 'ตัวอย่างบางรายการต้องรอการตรวจสิทธิ์เจ้าของข้อมูล',
    });
  }

  if (scenario === 'missing_consent') {
    skipped.push({
      recordType: 'saved_items',
      count: request.localRecordCounts.savedItems,
      reason: 'ยังไม่ได้รับความยินยอมสำหรับข้อมูลที่บันทึกไว้',
    });
  }

  return skipped.filter((item) => item.count > 0);
}

export function handleMockGuestSyncRequest(request: MockGuestSyncRequest): MockGuestSyncHandlerResult {
  const scenario = determineScenario(request);
  const duplicateSavedItems = scenario === 'duplicate_merge' ? Math.min(2, request.localRecordCounts.savedItems) : 0;
  const duplicateLikes = scenario === 'duplicate_merge' ? Math.min(1, request.localRecordCounts.likes) : 0;
  const skippedRecords = getSkippedRecords(request, scenario);
  const aiSkipped = skippedRecords
    .filter((item) => item.recordType === 'recent_ai_questions')
    .reduce((total, item) => total + item.count, 0);
  const partialFarmSkipped = skippedRecords
    .filter((item) => item.recordType === 'farm_records')
    .reduce((total, item) => total + item.count, 0);

  const recordsToMerge = createCounts({
    savedItems: duplicateSavedItems,
    likes: duplicateLikes,
    followedTopics: scenario === 'duplicate_merge' ? Math.min(1, request.localRecordCounts.followedTopics) : 0,
    farmRecords: 0,
    recentAIQuestions: 0,
  });

  const recordsSkipped = createCounts({
    savedItems: scenario === 'missing_consent' ? request.localRecordCounts.savedItems : 0,
    likes: scenario === 'missing_consent' ? request.localRecordCounts.likes : 0,
    followedTopics: scenario === 'missing_consent' ? request.localRecordCounts.followedTopics : 0,
    farmRecords: partialFarmSkipped,
    recentAIQuestions: aiSkipped,
  });

  const recordsToCreate =
    scenario === 'missing_consent' || scenario === 'failed_retryable'
      ? emptyCounts()
      : createCounts({
          savedItems: Math.max(0, request.localRecordCounts.savedItems - recordsToMerge.savedItems - recordsSkipped.savedItems),
          likes: Math.max(0, request.localRecordCounts.likes - recordsToMerge.likes - recordsSkipped.likes),
          followedTopics: Math.max(
            0,
            request.localRecordCounts.followedTopics - recordsToMerge.followedTopics - recordsSkipped.followedTopics,
          ),
          farmRecords: Math.max(0, request.localRecordCounts.farmRecords - recordsSkipped.farmRecords),
          recentAIQuestions: Math.max(0, request.localRecordCounts.recentAIQuestions - recordsSkipped.recentAIQuestions),
        });

  const status: MockGuestSyncResponse['status'] =
    scenario === 'failed_retryable'
      ? 'failed'
      : scenario === 'missing_consent'
        ? 'rejected'
        : scenario === 'partial_success'
          ? 'partial_success'
          : 'success';

  const warnings = [
    'Dry run เท่านั้น ไม่มีการเขียนข้อมูลจริง',
    'Guest Memory ในเครื่องนี้จะไม่ถูกลบหลังการทดสอบ',
    'service-role key ต้องอยู่ backend/edge function เท่านั้น ไม่อยู่ใน frontend',
  ];

  if (!request.consent.recentAIQuestions && request.localRecordCounts.recentAIQuestions > 0) {
    warnings.push('ประวัติคำถาม AI ไม่ถูกซิงก์ เพราะผู้ใช้ยังไม่ได้ยินยอม');
  }

  if (scenario === 'duplicate_merge') {
    warnings.push('ตัวอย่างนี้รวมรายการซ้ำด้วย itemType + itemId');
  }

  if (scenario === 'failed_retryable') {
    warnings.push('ตัวอย่างนี้จำลอง backend ล้มเหลวแบบลองใหม่ได้ และยังคงข้อมูล local ไว้ครบ');
  }

  const response: MockGuestSyncResponse = {
    syncRequestId: createId('guest-sync'),
    status,
    dryRun: request.dryRun,
    authProviderCandidate: request.authProviderCandidate,
    createdProfilePreview:
      status === 'failed' || status === 'rejected'
        ? undefined
        : {
            userId: createId('user-preview'),
            displayName: 'KasetHub Guest',
            authProvider: request.authProviderCandidate,
            linkedGuestId: request.payload.guestId,
            isNewProfile: true,
          },
    mergeSummary: {
      totalReceived: request.localRecordCounts.estimatedTotal,
      recordsToCreate,
      recordsToMerge,
      recordsSkipped,
      wouldWriteTables: [
        'profiles',
        'saved_items',
        'likes',
        'followed_topics',
        'farm_records',
        'recent_ai_questions',
        'auth_link_events',
      ],
    },
    skippedRecords,
    conflictSummary: {
      duplicateSavedItemsMerged: recordsToMerge.savedItems,
      duplicateLikesMerged: recordsToMerge.likes,
      followedTopicsMerged: recordsToMerge.followedTopics,
      farmRecordsKeptBoth: status === 'success' || status === 'partial_success' ? recordsToCreate.farmRecords : 0,
      aiHistorySkipped: aiSkipped,
      profileResolution: status === 'rejected' ? 'blocked_until_consent' : 'new_profile_preview',
    },
    warnings,
    retryable: status === 'failed',
    createdAt: now(),
  };

  return {
    adapterPath: request.metadata?.adapterPath === 'local_backend_handler' ? 'local_backend_handler' : 'local_fixture',
    accepted: status === 'success' || status === 'partial_success',
    response,
  };
}
