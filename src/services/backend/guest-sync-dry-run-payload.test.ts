import { describe, expect, test } from 'vitest';
import { buildGuestSyncDryRunPayload } from '@/services/backend/guest-sync-dry-run-payload';
import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';
import type { PhoneAuthMockSession } from '@/services/auth/phone-auth.types';
import type { PhoneAuthStagingSessionPreview } from '@/services/auth/phone-auth-staging-adapter.types';
import type { GuestMemoryState } from '@/services/guest-memory/guest-memory.types';

const generatedAt = '2026-05-24T12:00:00.000Z';

const mockSession: PhoneAuthMockSession = {
  version: 1,
  mockUserId: 'phone-mock-user-1234567890',
  phoneNumberMasked: '081-xxx-7890',
  provider: 'phone',
  createdAt: generatedAt,
  expiresAt: '2026-05-25T12:00:00.000Z',
};

const realSession: PhoneAuthStagingSessionPreview = {
  source: 'supabase_auth',
  userIdMasked: 'abc123...7890',
  phoneNumberMasked: '081-xxx-7890',
  createdAt: generatedAt,
  accessTokenPresent: true,
  refreshTokenPresent: true,
};

function createGuestMemory(): GuestMemoryState {
  return {
    version: 1,
    profile: {
      guestId: 'guest-m64-test',
      displayName: 'Guest',
      createdAt: generatedAt,
      updatedAt: generatedAt,
      mode: 'guest',
    },
    savedItems: [
      {
        id: 'saved-1',
        itemType: 'analysis_result',
        itemId: 'leaf-check-1',
        title: 'บันทึกตรวจใบ',
        summary: 'สรุปโรคพืชแบบ local',
        sourceRoute: '/app/analyze',
        tags: ['rice'],
        savedAt: generatedAt,
        updatedAt: generatedAt,
        metadata: {
          safeNote: 'keep this note',
          rawPhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB',
          otpCode: '123456',
          sessionToken: 'secret-session-token',
          providerKey: 'provider-secret',
          nested: {
            base64Image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
            publicLabel: 'safe nested label',
          },
        },
      },
    ],
    likes: [
      {
        id: 'like-1',
        itemType: 'article',
        itemId: 'article-1',
        title: 'บทความที่ถูกใจ',
        sourceRoute: '/app/learn',
        likedAt: generatedAt,
        metadata: { safe: true },
      },
    ],
    followedTopics: [
      {
        id: 'topic-1',
        topicType: 'crop',
        title: 'ข้าว',
        sourceRoute: '/app/prices',
        followedAt: generatedAt,
        tags: ['rice'],
        metadata: { safe: true },
      },
    ],
    recentAIQuestions: [
      {
        id: 'question-1',
        question: 'ใบเหลืองทำอย่างไร',
        sourceRoute: '/app/ai',
        askedAt: generatedAt,
        answerSummary: 'คำตอบย่อแบบ local',
        metadata: { safe: true },
      },
    ],
    farmRecords: [],
    migrations: [],
    updatedAt: generatedAt,
  };
}

function createCalculatorSummary(): CalculatorResultSummary {
  return {
    id: 'calculator-summary-1',
    category: 'cost_estimate',
    calculatorLabel: 'คำนวณต้นทุน',
    calculatorShortLabel: 'ต้นทุน',
    summaryTitle: 'สรุปต้นทุน',
    inputRecap: ['input recap should stay out of sync preview metadata'],
    resultRecap: ['ต้นทุนรวม 2,000 บาท', 'ต้นทุนต่อไร่ 1,000 บาท'],
    warningRecap: ['ตรวจสอบตัวเลขจริงอีกครั้ง'],
    safetyDisclaimer: 'ผลคำนวณเบื้องต้น',
    calculatorRoute: '/app/calculators/cost',
    shareText: 'share text should stay out of dry-run payload',
    shareMetadata: {
      native: { title: 'native', description: 'native text', url: '/app/calculators/cost' },
      line: { title: 'line', description: 'line text', url: '/app/calculators/cost' },
      facebook: { title: 'facebook', description: 'facebook text', url: '/app/calculators/cost' },
    },
    createdAt: generatedAt,
    createdAtLabel: '24 พ.ค. 2026',
    localOnlyNote: 'local only',
  };
}

describe('guest sync dry-run payload builder', () => {
  test('M64 payload excludes raw image and base64 values', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      generatedAt,
    });

    const previewText = JSON.stringify(payload.groups.savedItems.records[0]);

    expect(previewText).not.toContain('data:image');
    expect(previewText).not.toContain('rawPhoto');
    expect(previewText).not.toContain('base64Image');
    expect(payload.excludedSensitiveFields).toEqual(
      expect.arrayContaining(['savedItems.0.metadata.rawPhoto', 'savedItems.0.metadata.nested.base64Image']),
    );
    expect(payload.noRawPhotos).toBe(true);
  });

  test('M64 payload excludes OTP, session, service, and provider keys', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      generatedAt,
    });

    const previewText = JSON.stringify(payload.groups.savedItems.records[0]);

    expect(previewText).not.toContain('123456');
    expect(previewText).not.toContain('secret-session-token');
    expect(previewText).not.toContain('provider-secret');
    expect(payload.excludedSensitiveFields).toEqual(
      expect.arrayContaining([
        'savedItems.0.metadata.otpCode',
        'savedItems.0.metadata.sessionToken',
        'savedItems.0.metadata.providerKey',
      ]),
    );
  });

  test('M64 mock session does not allow upload', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      phoneMockSession: mockSession,
      supabaseSessionPreview: null,
      generatedAt,
    });

    expect(payload.ownerScope.mockSessionDetected).toBe(true);
    expect(payload.ownerScope.realSessionDetected).toBe(false);
    expect(payload.blockers.map((blocker) => blocker.id)).toContain('mock-session-only');
    expect(payload.uploadAllowed).toBe(false);
  });

  test('M64 missing consent blocks the selected group', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      supabaseSessionPreview: realSession,
      consent: { savedItems: false },
      generatedAt,
    });

    expect(payload.groups.savedItems.count).toBe(1);
    expect(payload.groups.savedItems.records).toHaveLength(0);
    expect(payload.blockers.map((blocker) => blocker.id)).toContain('missing-consent-savedItems');
    expect(payload.consentPreview.accepted).toBe(false);
  });

  test('M64 missing ownership blocks sync', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      phoneMockSession: null,
      supabaseSessionPreview: null,
      generatedAt,
    });

    expect(payload.ownerScope.realSessionDetected).toBe(false);
    expect(payload.ownerScope.ownerVerifiedForUpload).toBe(false);
    expect(payload.blockers.map((blocker) => blocker.id)).toContain('missing-real-session');
  });

  test('M64 idempotency key is generated for dry-run payloads', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      supabaseSessionPreview: realSession,
      generatedAt,
    });

    expect(payload.idempotencyPreview.syncRequestId).toMatch(/^guest-sync-dry-run-/);
    expect(payload.idempotencyPreview.idempotencyKey).toContain('guest-m64-test');
    expect(payload.idempotencyPreview.ready).toBe(true);
  });

  test('M64 audit preview is generated without writes', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      supabaseSessionPreview: realSession,
      generatedAt,
    });

    expect(payload.auditPreview.auditEventId).toMatch(/^audit-preview-/);
    expect(payload.auditPreview.wouldWriteAuditLog).toBe(false);
    expect(payload.auditPreview.eventTypes).toContain('upload_blocked_m64');
    expect(payload.noSupabaseWrite).toBe(true);
  });

  test('M64 calculator saved results are included as safe summary only', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      calculatorSavedResults: [createCalculatorSummary()],
      supabaseSessionPreview: realSession,
      generatedAt,
    });

    const record = payload.groups.calculatorSavedResults.records[0];
    const recordText = JSON.stringify(record);

    expect(record.safeSummary).toContain('ต้นทุนรวม 2,000 บาท');
    expect(record.metadataPreview).toMatchObject({ localOnly: true, category: 'cost_estimate' });
    expect(recordText).not.toContain('share text should stay out');
    expect(recordText).not.toContain('input recap should stay out');
  });

  test('M64 always returns uploadAllowed false', () => {
    const payload = buildGuestSyncDryRunPayload({
      guestMemory: createGuestMemory(),
      calculatorSavedResults: [createCalculatorSummary()],
      supabaseSessionPreview: realSession,
      generatedAt,
    });

    expect(payload.uploadAllowed).toBe(false);
    expect(payload.noCloudSync).toBe(true);
    expect(payload.blockers.map((blocker) => blocker.id)).toContain('m64-upload-disabled');
  });
});
