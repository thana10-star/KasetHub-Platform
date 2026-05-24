import { CheckCircle2, CloudUpload, Info, KeyRound, Link2, ListChecks, Lock, MessageCircle, Phone, RotateCcw, ShieldCheck, Server } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  getGuestSyncAdapterStatus,
  runGuestMemorySyncDryRun,
} from '@/services/backend/guest-sync-adapter';
import { buildOwnershipRlsGateStatus } from '@/services/backend/ownership-rls-gate';
import {
  createGuestSyncIdempotencyKeyPreview,
  runGuestSyncStagingReadiness,
} from '@/services/backend/guest-sync-staging-readiness';
import { createAccountLinkingPlan } from '@/services/auth/account-linking-planner';
import { getAuthOwnershipStatus } from '@/services/auth/auth-ownership-status';
import { getLineAuthAdapterStatus } from '@/services/auth/line-auth-adapter';
import { getPhoneAuthAdapterStatus } from '@/services/auth/phone-auth-adapter';
import { getPhoneAuthStagingAdapterStatus } from '@/services/auth/phone-auth-staging-adapter';
import { runPhoneAuthStagingReview } from '@/services/auth/phone-auth-staging-review';
import type {
  GuestSyncAuthProviderCandidate,
  GuestSyncConsentOptions,
} from '@/services/backend/guest-sync-endpoint.types';
import { buildGuestSyncPayloadPreview } from '@/services/backend/guest-sync-payload-builder';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import type {
  GuestSyncMockScenario,
  MockGuestSyncResponse,
} from '@/server/guest-sync/mock-guest-sync.types';

const providers: Array<{ label: string; value: GuestSyncAuthProviderCandidate }> = [
  { label: 'เบอร์โทร', value: 'phone' },
  { label: 'LINE', value: 'line' },
  { label: 'Google', value: 'google' },
];

const scenarioOptions: Array<{ label: string; value: GuestSyncMockScenario; description: string }> = [
  {
    label: 'สำเร็จ',
    value: 'success',
    description: 'จำลองการรับข้อมูลทั้งหมดและเตรียมสร้างรายการใหม่',
  },
  {
    label: 'สำเร็จบางส่วน',
    value: 'partial_success',
    description: 'จำลองบางรายการต้องรอตรวจสิทธิ์ แต่ข้อมูลในเครื่องยังอยู่ครบ',
  },
  {
    label: 'รวมรายการซ้ำ',
    value: 'duplicate_merge',
    description: 'จำลอง saved items ซ้ำและรวมด้วย itemType + itemId',
  },
  {
    label: 'ยังไม่ยินยอม',
    value: 'missing_consent',
    description: 'จำลอง backend ปฏิเสธเพราะขาด consent สำคัญ',
  },
  {
    label: 'ล้มเหลว ลองใหม่ได้',
    value: 'failed_retryable',
    description: 'จำลอง backend ล้มเหลวชั่วคราว โดยไม่แตะข้อมูล local',
  },
];

const statusTone: Record<MockGuestSyncResponse['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  success: 'success',
  partial_success: 'warning',
  rejected: 'danger',
  failed: 'danger',
};

const statusCopy: Record<MockGuestSyncResponse['status'], string> = {
  success: 'สำเร็จ',
  partial_success: 'สำเร็จบางส่วน',
  rejected: 'ถูกปฏิเสธ',
  failed: 'ล้มเหลว',
};

function SyncResponseCard({ response }: { response: MockGuestSyncResponse }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-kaset-deep p-5 text-white">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
            <CloudUpload aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <StatusPill className="bg-white/15 text-white ring-white/20" tone="success">
                dry run
              </StatusPill>
              <StatusPill tone={statusTone[response.status]}>{statusCopy[response.status]}</StatusPill>
            </div>
            <h2 className="mt-3 text-xl font-extrabold leading-7">ผลทดสอบซิงก์จำลอง</h2>
            <p className="mt-1 break-all text-xs leading-5 text-emerald-50/90">{response.syncRequestId}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        {response.createdProfilePreview ? (
          <div className="rounded-lg bg-kaset-mist p-3">
            <p className="text-sm font-extrabold text-kaset-ink">โปรไฟล์ที่จะสร้างในอนาคต</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {response.createdProfilePreview.displayName} · {response.createdProfilePreview.authProvider}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{response.mergeSummary.recordsToCreate.estimatedTotal}</p>
            <p className="text-xs font-bold text-slate-500">เตรียมสร้าง</p>
          </div>
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{response.mergeSummary.recordsToMerge.estimatedTotal}</p>
            <p className="text-xs font-bold text-slate-500">รวมรายการซ้ำ</p>
          </div>
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{response.mergeSummary.recordsSkipped.estimatedTotal}</p>
            <p className="text-xs font-bold text-slate-500">ข้ามไว้ก่อน</p>
          </div>
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{response.mergeSummary.totalReceived}</p>
            <p className="text-xs font-bold text-slate-500">รับทั้งหมด</p>
          </div>
        </div>

        <div className="rounded-lg border border-kaset-deep/10 bg-white p-3">
          <p className="text-sm font-extrabold text-kaset-ink">Conflict preview</p>
          <div className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
            <p>saved items ซ้ำ: {response.conflictSummary.duplicateSavedItemsMerged}</p>
            <p>likes ซ้ำ: {response.conflictSummary.duplicateLikesMerged}</p>
            <p>หัวข้อซ้ำ: {response.conflictSummary.followedTopicsMerged}</p>
            <p>My Farm เก็บทั้งสองฝั่ง: {response.conflictSummary.farmRecordsKeptBoth}</p>
            <p>AI history ข้าม: {response.conflictSummary.aiHistorySkipped}</p>
          </div>
        </div>

        {response.skippedRecords.length > 0 ? (
          <div className="grid gap-2">
            <p className="text-sm font-extrabold text-kaset-ink">รายการที่ข้ามไว้ก่อน</p>
            {response.skippedRecords.map((item) => (
              <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900" key={`${item.recordType}-${item.reason}`}>
                {item.recordType}: {item.count} รายการ · {item.reason}
              </p>
            ))}
          </div>
        ) : null}

        <NoticeBox tone={response.retryable ? 'warning' : 'success'} title="ข้อมูลในเครื่องยังปลอดภัย">
          การทดสอบนี้ไม่ลบ ไม่แก้ และไม่ทำเครื่องหมายซิงก์กับ Guest Memory ในเครื่องนี้ หาก backend ล้มเหลว ผู้ใช้ยังใช้งานต่อได้ตามเดิม
        </NoticeBox>

        <div className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          <p className="font-extrabold text-slate-800">Tables preview</p>
          <p className="mt-1">{response.mergeSummary.wouldWriteTables.join(', ') || 'ไม่มีการเขียนข้อมูลจริง'}</p>
        </div>
      </div>
    </Card>
  );
}

export function AuthSyncPreviewPage() {
  const { state, counts } = useGuestMemory();
  const [provider, setProvider] = useState<GuestSyncAuthProviderCandidate>('phone');
  const [scenario, setScenario] = useState<GuestSyncMockScenario>('success');
  const [response, setResponse] = useState<MockGuestSyncResponse | null>(null);
  const [consent, setConsent] = useState<GuestSyncConsentOptions>({
    savedItems: true,
    farmRecords: true,
    recentAIQuestions: false,
  });

  const syncStatus = getGuestSyncAdapterStatus();
  const phoneAuthStatus = getPhoneAuthAdapterStatus();
  const phoneStagingStatus = getPhoneAuthStagingAdapterStatus();
  const ownershipStatus = getAuthOwnershipStatus({
    phoneMockSession: phoneStagingStatus.localMockSession,
    supabaseSessionPreview: phoneStagingStatus.supabaseSessionPreview,
  });
  const ownershipGate = buildOwnershipRlsGateStatus({
    phoneMockSession: phoneStagingStatus.localMockSession,
    supabaseSessionPreview: phoneStagingStatus.supabaseSessionPreview,
    guestMemoryRecordCount: counts.savedItems + counts.likedPosts + counts.followedTopics + counts.farmRecords + counts.recentAIQuestions,
  });
  const m61Review = useMemo(() => runPhoneAuthStagingReview(), []);
  const lineAuthStatus = getLineAuthAdapterStatus();
  const linkingPlan = createAccountLinkingPlan({
    phoneSession: phoneAuthStatus.session,
    lineSession: lineAuthStatus.session,
  });
  const payloadPreview = useMemo(() => buildGuestSyncPayloadPreview(state, consent, provider), [consent, provider, state]);
  const edgeReadiness = useMemo(() => runGuestSyncStagingReadiness(), []);
  const idempotencyKeyPreview = useMemo(
    () => createGuestSyncIdempotencyKeyPreview(payloadPreview.payload.guestId),
    [payloadPreview.payload.guestId],
  );
  const selectedScenario = scenarioOptions.find((item) => item.value === scenario) ?? scenarioOptions[0];
  const summaryRows = [
    { label: 'บันทึกไว้', value: counts.savedItems },
    { label: 'ถูกใจ', value: counts.likedPosts },
    { label: 'ติดตาม', value: counts.followedTopics },
    { label: 'My Farm', value: counts.farmRecords },
    { label: 'คำถาม AI', value: counts.recentAIQuestions },
    { label: 'จะทดสอบซิงก์', value: payloadPreview.estimatedRecordCount },
  ];

  function handleRunDryRun() {
    if (!phoneAuthStatus.session) {
      return;
    }

    setResponse(
      runGuestMemorySyncDryRun({
        payload: payloadPreview.payload,
        scenario,
      }),
    );
  }

  return (
    <div>
      <PageHeader title="ตัวอย่างการสำรองข้อมูล" subtitle="ทดสอบซิงก์จำลอง ยังไม่อัปโหลดจริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <CloudUpload aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="success">
                  Guest Sync POC
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">ลองดูว่าข้อมูลในเครื่องจะซิงก์อย่างไร</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ทดสอบ flow จาก Guest Memory ไปยัง backend-shaped handler โดยไม่ส่งข้อมูลออกจากเครื่องและไม่เขียน cloud จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="ข้อมูลในเครื่องจะไม่หาย">
          ต่อให้ทดสอบแล้วล้มเหลว Guest Memory ยังอยู่ครบ ระบบจริงในอนาคตควรทำเครื่องหมายว่าซิงก์แล้วหลัง backend ยืนยันสำเร็จเท่านั้น
        </NoticeBox>

        <NoticeBox tone="info" icon={Phone} title="Real sync ต้องรอ session ownership จริง">
          ตอนนี้ phone auth ยังเป็น local mock และยังไม่เปิด Supabase Auth จริง การ sync cloud ต้องรอ phone OTP staging ผ่าน, auth.uid() ตรงกับ owner, และผู้ใช้ยินยอมก่อน
          <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/auth/phone-staging">
            เปิด Phone OTP staging checklist
          </Link>
          <Link className="ml-4 mt-3 inline-flex font-bold text-kaset-deep" to="/app/auth/phone-staging-test">
            เปิด M61 staging test plan
          </Link>
        </NoticeBox>

        <NoticeBox tone="warning" title="M61 ownership boundary">
          {m61Review.levelLabel} · cloud sync stays blocked until a real Supabase Phone Auth session proves `auth.uid()` ownership and the user consents to Guest Memory sync.
        </NoticeBox>

        <NoticeBox tone={ownershipStatus.realSupabaseSessionDetected ? 'success' : 'warning'} title="M62 session ownership review">
          real session detected {String(ownershipStatus.realSupabaseSessionDetected)} · sync allowed{' '}
          {String(ownershipStatus.syncAllowed)} · {ownershipStatus.explanation} Next: {ownershipStatus.nextRequiredMilestone}.
        </NoticeBox>

        <NoticeBox tone="danger" title="M63 ownership/RLS gate">
          {ownershipGate.statusLabel} · blockers {ownershipGate.blockers.length} · syncAllowed {String(ownershipGate.syncAllowed)} · next safe step:{' '}
          {ownershipGate.nextSafeStep}
          <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/ownership-rls-gate">
            เปิด Ownership/RLS gate review
          </Link>
        </NoticeBox>

        <NoticeBox tone="warning" icon={ListChecks} title="M64 dry-run payload status">
          สร้าง payload preview แบบ local-only ได้แล้ว แต่ sync ยังถูกบล็อกจนกว่าจะมี ownership, consent, idempotency, audit และ RLS gate ครบ
          <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/guest-sync-dry-run">
            เปิด Guest Sync dry-run payload
          </Link>
        </NoticeBox>

        {phoneAuthStatus.session ? (
          <NoticeBox tone="success" title="ยืนยันเบอร์โทรจำลองแล้ว">
            พร้อมทดสอบ dry-run sync ด้วย session จำลอง {phoneAuthStatus.session.phoneNumberMasked} แต่ยังไม่ใช่บัญชีจริงและยังไม่อัปโหลดข้อมูล
          </NoticeBox>
        ) : (
          <NoticeBox tone="warning" title="กรุณายืนยันเบอร์โทรก่อนทดสอบการสำรองข้อมูล">
            Sync preview ยังดูได้ แต่ปุ่มทดสอบซิงก์จำลองจะเปิดหลังมี phone mock session เพื่อพิสูจน์ว่าอนาคตต้องยืนยันเจ้าของบัญชีก่อนซิงก์
            <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/auth/phone">
              ไปยืนยันเบอร์โทรจำลอง
            </Link>
          </NoticeBox>
        )}

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Link2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Phone + LINE linking</h2>
                <StatusPill tone={linkingPlan.canUseForGuestSyncOwnership ? 'success' : 'warning'}>
                  {linkingPlan.label}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{linkingPlan.description}</p>
              <p className="mt-2 text-sm font-bold text-kaset-deep">{linkingPlan.recommendedAction}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill tone={lineAuthStatus.session ? 'success' : 'warning'}>
                  <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
                  {lineAuthStatus.session ? 'LINE mock active' : 'LINE ยังไม่เชื่อม'}
                </StatusPill>
              </div>
              <Link to="/app/auth/linking">
                <span className="mt-3 inline-flex text-sm font-bold text-kaset-deep">ดูกติกาเชื่อมบัญชี</span>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Server aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">สถานะระบบซิงก์จำลอง</h2>
                <StatusPill tone={syncStatus.mode === 'local_fixture' ? 'success' : 'warning'}>{syncStatus.modeLabel}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{syncStatus.readinessLabel}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                backend flag: {syncStatus.backendSyncEnabled ? 'เปิด' : 'ปิด'} · local handler:{' '}
                {syncStatus.localHandlerEnabled ? 'เปิด' : 'ปิด'} · service role: ไม่มีใน frontend
              </p>
              <Link className="mt-3 inline-flex text-sm font-bold text-kaset-deep" to="/app/guest-sync-status">
                ดูสถานะ Guest Sync
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CloudUpload aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Edge Function readiness</h2>
                <StatusPill tone={edgeReadiness.blockerItems.length > 0 ? 'danger' : 'warning'}>
                  {edgeReadiness.levelLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                แผนจริงในอนาคตคือ <span className="font-bold text-kaset-deep">POST /functions/v1/{edgeReadiness.endpointName}</span> หลังมี Supabase session เจ้าของบัญชีจริงเท่านั้น
              </p>
              <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                ตอนนี้ยังเป็น dry-run local เท่านั้น ไม่มี endpoint call ไม่มี cloud write และไม่ลบ Guest Memory
              </p>
              <Link className="mt-3 inline-flex text-sm font-bold text-kaset-deep" to="/app/guest-sync-edge">
                เปิด Guest Sync Edge Function plan
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <KeyRound aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Idempotency key preview</h2>
              <p className="mt-2 break-all rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep">
                {idempotencyKeyPreview}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ระบบจริงต้องใช้ key นี้เพื่อให้ retry เดิมไม่สร้างข้อมูลซ้ำ และต้องผูกกับ userId เจ้าของบัญชีบน server
              </p>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ListChecks} title="Staging-only checklist">
          <ul className="grid gap-2">
            <li>ต้องมี staging Supabase project, SQL/RLS และ phone auth session จริงก่อน</li>
            <li>service-role key อยู่ใน Edge Function เท่านั้น ห้ามอยู่ใน frontend</li>
            <li>ทดสอบ duplicate merge, partial success, auth missing และ rollback ก่อนเปิด cloud sync</li>
          </ul>
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          {summaryRows.map((row) => (
            <Card className="p-3 text-center" key={row.label}>
              <p className="text-xl font-extrabold text-kaset-deep">{row.value}</p>
              <p className="mt-1 text-[12px] font-bold leading-4 text-slate-500">{row.label}</p>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">วิธีสมัครในอนาคต</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {providers.map((item) => (
              <button
                className={`min-h-12 rounded-full px-3 text-sm font-bold transition ${
                  provider === item.value ? 'bg-kaset-deep text-white' : 'bg-kaset-mint text-kaset-deep hover:bg-emerald-100'
                }`}
                key={item.value}
                onClick={() => setProvider(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">เลือกข้อมูลที่จะสำรอง</h2>
          <div className="mt-3 grid gap-3">
            <label className="flex min-h-[64px] gap-3 rounded-lg bg-kaset-mist p-3 text-[15px] font-bold leading-6 text-kaset-ink">
              <input
                checked={consent.savedItems}
                className="mt-1 h-5 w-5 accent-kaset-deep"
                onChange={(event) => setConsent((current) => ({ ...current, savedItems: event.target.checked }))}
                type="checkbox"
              />
              <span>ยอมรับให้สำรองข้อมูลที่บันทึกไว้ ถูกใจ และหัวข้อที่ติดตาม</span>
            </label>
            <label className="flex min-h-[64px] gap-3 rounded-lg bg-kaset-mist p-3 text-[15px] font-bold leading-6 text-kaset-ink">
              <input
                checked={consent.farmRecords}
                className="mt-1 h-5 w-5 accent-kaset-deep"
                onChange={(event) => setConsent((current) => ({ ...current, farmRecords: event.target.checked }))}
                type="checkbox"
              />
              <span>ยอมรับให้ซิงก์ประวัติฟาร์มของฉัน</span>
            </label>
            <label className="flex min-h-[64px] gap-3 rounded-lg bg-kaset-mist p-3 text-[15px] font-bold leading-6 text-kaset-ink">
              <input
                checked={consent.recentAIQuestions}
                className="mt-1 h-5 w-5 accent-kaset-deep"
                onChange={(event) => setConsent((current) => ({ ...current, recentAIQuestions: event.target.checked }))}
                type="checkbox"
              />
              <span>ซิงก์ประวัติคำถาม AI ด้วย (เลือกได้)</span>
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">โหมดจำลองผลลัพธ์</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {scenarioOptions.map((item) => (
              <button
                className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-bold transition ${
                  scenario === item.value ? 'bg-kaset-deep text-white shadow-soft' : 'bg-kaset-mist text-kaset-deep'
                }`}
                key={item.value}
                onClick={() => setScenario(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">{selectedScenario.description}</p>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <Info aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Payload preview</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Endpoint ในอนาคต: <span className="font-bold text-kaset-deep">POST /functions/v1/{edgeReadiness.endpointName}</span>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{payloadPreview.counts.savedItems}</p>
                  <p className="text-xs font-semibold text-slate-500">saved_items</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{payloadPreview.counts.likes}</p>
                  <p className="text-xs font-semibold text-slate-500">likes</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{payloadPreview.counts.followedTopics}</p>
                  <p className="text-xs font-semibold text-slate-500">followed_topics</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{payloadPreview.counts.farmRecords}</p>
                  <p className="text-xs font-semibold text-slate-500">farm_records</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {payloadPreview.blockedReasons.length > 0 ? (
          <NoticeBox tone="danger" icon={Lock} title="ยังซิงก์ไม่ได้">
            <ul className="grid gap-1">
              {payloadPreview.blockedReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        {payloadPreview.warnings.length > 0 ? (
          <NoticeBox tone="warning" icon={CheckCircle2} title="หมายเหตุ">
            <ul className="grid gap-1">
              {payloadPreview.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </NoticeBox>
        ) : null}

        <Button className="w-full" disabled={!phoneAuthStatus.session} onClick={handleRunDryRun}>
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          ทดสอบซิงก์จำลอง
        </Button>

        {response ? <SyncResponseCard response={response} /> : null}

        <Button className="w-full" disabled variant="soft">
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          เริ่มสำรองข้อมูลจริงยังไม่เปิดในเวอร์ชันนี้
        </Button>
      </div>
    </div>
  );
}
