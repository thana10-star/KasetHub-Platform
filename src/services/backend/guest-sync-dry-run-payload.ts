import { getAuthOwnershipStatus } from '@/services/auth/auth-ownership-status';
import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';
import type {
  BuildGuestSyncDryRunPayloadInput,
  GuestSyncDryRunBlocker,
  GuestSyncDryRunConsentInput,
  GuestSyncDryRunPayload,
  GuestSyncDryRunRecordGroup,
  GuestSyncDryRunRecordGroupKey,
  GuestSyncDryRunRecordPreview,
  GuestSyncDryRunSensitiveValueInput,
} from '@/services/backend/guest-sync-dry-run-payload.types';

const defaultConsent: GuestSyncDryRunConsentInput = {
  savedItems: true,
  farmRecords: true,
  recentAiQuestions: false,
  cropWatches: true,
  calculatorSavedResults: true,
  followedTopics: true,
  likes: true,
};

const groupLabels: Record<GuestSyncDryRunRecordGroupKey, string> = {
  savedItems: 'รายการที่บันทึกไว้',
  farmRecords: 'ประวัติฟาร์ม',
  recentAiQuestions: 'คำถาม AI ล่าสุด',
  cropWatches: 'พืชที่ติดตามราคา',
  calculatorSavedResults: 'สรุปผลเครื่องคำนวณ',
  followedTopics: 'หัวข้อที่ติดตาม',
  likes: 'รายการถูกใจ',
};

const conflictPolicies: Record<GuestSyncDryRunRecordGroupKey, string> = {
  savedItems: 'merge by itemType + itemId',
  farmRecords: 'keep both unless same local id',
  recentAiQuestions: 'sync only with optional explicit consent',
  cropWatches: 'merge by cropKey + preferred market',
  calculatorSavedResults: 'safe summary only, merge by local summary id',
  followedTopics: 'merge by topic id',
  likes: 'or true wins',
};

const duplicateKeys: Record<GuestSyncDryRunRecordGroupKey, string> = {
  savedItems: 'itemType:itemId',
  farmRecords: 'local farm record id',
  recentAiQuestions: 'local question id',
  cropWatches: 'cropKey:preferredMarketId',
  calculatorSavedResults: 'summary id',
  followedTopics: 'topicType:id',
  likes: 'itemType:itemId',
};

const sensitiveKeyPattern =
  /(otp|token|session|service[_-]?role|provider[_-]?key|api[_-]?key|anon[_-]?key|secret|password|authorization|supabase[_-]?key|refresh|access|raw[_-]?(photo|image)|image[_-]?(blob|base64)|photo[_-]?file|file[_-]?(data|blob)|base64|blob)/i;
const base64ImagePattern = /^data:image\/[a-z0-9.+-]+;base64,/i;
const longBase64Pattern = /^[A-Za-z0-9+/]{160,}={0,2}$/;

function now() {
  return new Date().toISOString();
}

function stableHash(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isSensitiveString(value: string) {
  return base64ImagePattern.test(value) || longBase64Pattern.test(value);
}

function sanitizeValue(value: unknown, excluded: Set<string>, path = 'value'): unknown {
  if (typeof value === 'string') {
    if (isSensitiveString(value)) {
      excluded.add(path);
      return '[filtered]';
    }
    return value.length > 180 ? `${value.slice(0, 177)}...` : value;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 8).map((item, index) => sanitizeValue(item, excluded, `${path}.${index}`));
  }

  if (!isObject(value)) {
    return undefined;
  }

  const safeEntries = Object.entries(value)
    .filter(([key]) => {
      const shouldKeep = !sensitiveKeyPattern.test(key);
      if (!shouldKeep) excluded.add(`${path}.${key}`);
      return shouldKeep;
    })
    .slice(0, 12)
    .map(([key, item]) => [key, sanitizeValue(item, excluded, `${path}.${key}`)] as const)
    .filter(([, item]) => item !== undefined);

  return Object.fromEntries(safeEntries);
}

function titleFrom(value: GuestSyncDryRunSensitiveValueInput, fallback: string) {
  if ('title' in value && typeof value.title === 'string') return value.title;
  if ('cropName' in value && typeof value.cropName === 'string') return value.cropName;
  if ('summaryTitle' in value && typeof value.summaryTitle === 'string') return value.summaryTitle;
  if ('question' in value && typeof value.question === 'string') return value.question;
  return fallback;
}

function routeFrom(value: GuestSyncDryRunSensitiveValueInput) {
  if ('sourceRoute' in value && typeof value.sourceRoute === 'string') return value.sourceRoute;
  if ('calculatorRoute' in value && typeof value.calculatorRoute === 'string') return value.calculatorRoute;
  return '/app';
}

function dateFrom(value: GuestSyncDryRunSensitiveValueInput, generatedAt: string) {
  if ('savedAt' in value && typeof value.savedAt === 'string') return value.savedAt;
  if ('createdAt' in value && typeof value.createdAt === 'string') return value.createdAt;
  if ('likedAt' in value && typeof value.likedAt === 'string') return value.likedAt;
  if ('followedAt' in value && typeof value.followedAt === 'string') return value.followedAt;
  if ('askedAt' in value && typeof value.askedAt === 'string') return value.askedAt;
  if ('updatedAt' in value && typeof value.updatedAt === 'string') return value.updatedAt;
  return generatedAt;
}

function idFrom(value: GuestSyncDryRunSensitiveValueInput, fallback: string) {
  return 'id' in value && typeof value.id === 'string' ? value.id : fallback;
}

function safeSummaryFrom(value: GuestSyncDryRunSensitiveValueInput, fallback: string) {
  if ('summary' in value && typeof value.summary === 'string') return value.summary;
  if ('resultRecap' in value && Array.isArray(value.resultRecap)) {
    return value.resultRecap.filter((item): item is string => typeof item === 'string').slice(0, 2).join(' · ');
  }
  if ('answerSummary' in value && typeof value.answerSummary === 'string') return value.answerSummary;
  if ('diseaseName' in value && typeof value.diseaseName === 'string') return value.diseaseName;
  if ('latestPriceLabel' in value && typeof value.latestPriceLabel === 'string') return value.latestPriceLabel;
  return fallback;
}

function createRecordPreview(
  value: GuestSyncDryRunSensitiveValueInput,
  fallback: string,
  generatedAt: string,
  excluded: Set<string>,
): GuestSyncDryRunRecordPreview {
  return {
    localId: idFrom(value, fallback),
    title: titleFrom(value, fallback),
    sourceRoute: routeFrom(value),
    createdAt: dateFrom(value, generatedAt),
    safeSummary: safeSummaryFrom(value, 'local-only summary'),
    metadataPreview: (sanitizeValue('metadata' in value ? value.metadata : {}, excluded, `${fallback}.metadata`) as Record<string, unknown>) ?? {},
  };
}

function createCalculatorSummaryPreview(
  summary: CalculatorResultSummary,
  generatedAt: string,
  excluded: Set<string>,
): GuestSyncDryRunRecordPreview {
  return {
    localId: summary.id,
    title: summary.summaryTitle,
    sourceRoute: summary.calculatorRoute,
    createdAt: summary.createdAt || generatedAt,
    safeSummary: summary.resultRecap.slice(0, 3).join(' · ') || summary.calculatorShortLabel,
    metadataPreview: sanitizeValue(
      {
        category: summary.category,
        calculatorLabel: summary.calculatorLabel,
        warnings: summary.warningRecap.slice(0, 3),
        localOnly: true,
      },
      excluded,
      `calculatorSavedResults.${summary.id}`,
    ) as Record<string, unknown>,
  };
}

function createGroup(
  key: GuestSyncDryRunRecordGroupKey,
  records: GuestSyncDryRunRecordPreview[],
  consentGranted: boolean,
): GuestSyncDryRunRecordGroup {
  const consentRequired = true;
  return {
    key,
    label: groupLabels[key],
    count: records.length,
    consentRequired,
    consentGranted,
    includedInPayload: records.length > 0 && consentGranted,
    conflictPolicy: conflictPolicies[key],
    records: consentGranted ? records : [],
  };
}

function createBlocker(id: string, label: string, detail: string): GuestSyncDryRunBlocker {
  return { id, label, detail };
}

function countIncluded(groups: Record<GuestSyncDryRunRecordGroupKey, GuestSyncDryRunRecordGroup>) {
  return Object.values(groups).reduce((total, group) => total + group.records.length, 0);
}

function countLocal(groups: Record<GuestSyncDryRunRecordGroupKey, GuestSyncDryRunRecordGroup>) {
  return Object.values(groups).reduce((total, group) => total + group.count, 0);
}

export function buildGuestSyncDryRunPayload(input: BuildGuestSyncDryRunPayloadInput): GuestSyncDryRunPayload {
  const generatedAt = input.generatedAt ?? now();
  const excluded = new Set<string>();
  const consent: GuestSyncDryRunConsentInput = { ...defaultConsent, ...input.consent };
  const ownership = getAuthOwnershipStatus({
    phoneMockSession: input.phoneMockSession,
    supabaseSessionPreview: input.supabaseSessionPreview,
  });

  const savedItemRecords = input.guestMemory.savedItems.map((item, index) =>
    createRecordPreview(item, `savedItems.${index}`, generatedAt, excluded),
  );
  const farmRecords = input.guestMemory.farmRecords.map((item, index) =>
    createRecordPreview(item, `farmRecords.${index}`, generatedAt, excluded),
  );
  const recentAiQuestionRecords = input.guestMemory.recentAIQuestions.map((item, index) =>
    createRecordPreview(item, `recentAiQuestions.${index}`, generatedAt, excluded),
  );
  const cropWatchRecords = (input.cropWatches ?? []).map((item, index) =>
    createRecordPreview(item, `cropWatches.${index}`, generatedAt, excluded),
  );
  const calculatorRecords = (input.calculatorSavedResults ?? []).map((item) =>
    createCalculatorSummaryPreview(item, generatedAt, excluded),
  );
  const followedTopicRecords = input.guestMemory.followedTopics.map((item, index) =>
    createRecordPreview(item, `followedTopics.${index}`, generatedAt, excluded),
  );
  const likeRecords = input.guestMemory.likes.map((item, index) =>
    createRecordPreview(item, `likes.${index}`, generatedAt, excluded),
  );

  const groups: Record<GuestSyncDryRunRecordGroupKey, GuestSyncDryRunRecordGroup> = {
    savedItems: createGroup('savedItems', savedItemRecords, consent.savedItems),
    farmRecords: createGroup('farmRecords', farmRecords, consent.farmRecords),
    recentAiQuestions: createGroup('recentAiQuestions', recentAiQuestionRecords, consent.recentAiQuestions),
    cropWatches: createGroup('cropWatches', cropWatchRecords, consent.cropWatches),
    calculatorSavedResults: createGroup('calculatorSavedResults', calculatorRecords, consent.calculatorSavedResults),
    followedTopics: createGroup('followedTopics', followedTopicRecords, consent.followedTopics),
    likes: createGroup('likes', likeRecords, consent.likes),
  };

  const totalLocalRecords = countLocal(groups);
  const totalIncludedRecords = countIncluded(groups);
  const blockers: GuestSyncDryRunBlocker[] = [];

  if (!ownership.realSupabaseSessionDetected) {
    blockers.push(createBlocker('missing-real-session', 'ยังไม่มี real Supabase session', 'ต้องมี Supabase Auth session จริงก่อน upload'));
  }

  if (ownership.localMockSessionDetected && !ownership.realSupabaseSessionDetected) {
    blockers.push(createBlocker('mock-session-only', 'mock session ไม่ใช่ ownership', 'Phone mock ใช้ทดสอบ UX เท่านั้น'));
  }

  Object.values(groups).forEach((group) => {
    if (group.count > 0 && !group.consentGranted) {
      blockers.push(createBlocker(`missing-consent-${group.key}`, `ยังไม่ยินยอม: ${group.label}`, 'ต้องยืนยัน consent ก่อน sync กลุ่มนี้'));
    }
  });

  if (totalLocalRecords === 0) {
    blockers.push(createBlocker('no-local-records', 'ยังไม่มีข้อมูล local', 'ยังไม่มี Guest Memory หรือข้อมูล local ที่จะสร้าง payload'));
  }

  const syncRequestId = `guest-sync-dry-run-${stableHash(`${input.guestMemory.profile.guestId}:${generatedAt}:${totalLocalRecords}`)}`;
  const idempotencyKey = `m64:${input.guestMemory.profile.guestId}:${ownership.userIdMasked ?? 'no-owner'}:${stableHash(syncRequestId)}`;

  return {
    version: '2026-05-m64',
    generatedAt,
    dryRun: true,
    uploadAllowed: false,
    noSupabaseWrite: true,
    noCloudSync: true,
    noRawPhotos: true,
    guestId: input.guestMemory.profile.guestId,
    ownerScope: {
      realSessionDetected: ownership.realSupabaseSessionDetected,
      mockSessionDetected: ownership.localMockSessionDetected,
      ownerVerifiedForUpload: false,
      maskedOwnerId: ownership.userIdMasked,
      authUidExpectation: 'backend must verify owner_id = auth.uid() before any upload',
      syncAllowedByOwnershipGate: false,
    },
    consentPreview: {
      accepted: blockers.filter((blocker) => blocker.id.startsWith('missing-consent')).length === 0 && totalIncludedRecords > 0,
      acceptedAtPreview:
        blockers.filter((blocker) => blocker.id.startsWith('missing-consent')).length === 0 && totalIncludedRecords > 0
          ? generatedAt
          : null,
      checklist: [
        {
          id: 'review-data-groups',
          label: 'ตรวจกลุ่มข้อมูลก่อนอัปโหลด',
          status: totalLocalRecords > 0 ? 'ready' : 'missing',
          detail: 'ผู้ใช้ต้องเห็นจำนวนรายการและประเภทข้อมูลที่จะย้าย',
        },
        {
          id: 'confirm-local-safe',
          label: 'ยืนยันว่า local data ยังไม่ถูกลบ',
          status: 'planned',
          detail: 'ข้อมูลในเครื่องต้องยังอยู่จน backend ยืนยันสำเร็จในอนาคต',
        },
        {
          id: 'explicit-upload-consent',
          label: 'ยืนยันอัปโหลดด้วยตนเอง',
          status: totalIncludedRecords > 0 ? 'ready' : 'missing',
          detail: 'M64 เป็น preview เท่านั้น ยังไม่เก็บ consent จริง',
        },
      ],
      localOnlyWarning: 'ยังไม่อัปโหลดข้อมูลจริง และ consent นี้เป็น preview ในเครื่องเท่านั้น',
    },
    idempotencyPreview: {
      syncRequestId,
      idempotencyKey,
      duplicateHandlingPreview: Object.entries(conflictPolicies).map(([key, policy]) => `${key}: ${policy}`),
      keyScope: 'guest_plus_owner_preview',
      ready: true,
    },
    auditPreview: {
      auditEventId: `audit-preview-${stableHash(`${syncRequestId}:audit`)}`,
      wouldWriteAuditLog: false,
      eventTypes: ['payload_preview_created', 'consent_preview_checked', 'idempotency_preview_created', 'upload_blocked_m64'],
      maskedOwnerId: ownership.userIdMasked,
      recordCount: totalIncludedRecords,
      generatedAt,
    },
    conflictPreview: {
      policies: (Object.keys(conflictPolicies) as GuestSyncDryRunRecordGroupKey[]).map((groupKey) => ({
        groupKey,
        policy: conflictPolicies[groupKey],
        duplicateKey: duplicateKeys[groupKey],
      })),
      warnings: [
        'dry-run only: no merge is executed',
        'future backend must verify owner id and idempotency before merge',
      ],
    },
    groups,
    blockers: [
      ...blockers,
      createBlocker('m64-upload-disabled', 'M64 ยังไม่อนุญาต upload', 'uploadAllowed เป็น false เสมอใน milestone นี้'),
    ],
    privacyFilterNotes: [
      'raw image files are excluded',
      'base64 image blobs are filtered',
      'OTP codes and session tokens are filtered',
      'service-role keys and provider keys are filtered',
      'calculator saved results include safe summary only',
    ],
    excludedSensitiveFields: Array.from(excluded).sort(),
    totalLocalRecords,
    totalIncludedRecords,
    nextSafeStep:
      'Review the dry-run payload, complete ownership/RLS checks, then add backend-owned validation before any real upload.',
  };
}
