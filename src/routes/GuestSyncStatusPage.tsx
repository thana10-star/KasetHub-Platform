import { CloudUpload, Database, KeyRound, Phone, PlayCircle, ShieldCheck, Smartphone, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { Button } from '@/components/ui/Button';
import {
  getGuestSyncAdapterStatus,
  runGuestMemorySyncDryRun,
} from '@/services/backend/guest-sync-adapter';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import { buildGuestSyncPayloadPreview } from '@/services/backend/guest-sync-payload-builder';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import type {
  GuestSyncMockScenario,
  MockGuestSyncResponse,
} from '@/server/guest-sync/mock-guest-sync.types';

const testScenarios: Array<{ label: string; value: GuestSyncMockScenario }> = [
  { label: 'success', value: 'success' },
  { label: 'partial success', value: 'partial_success' },
  { label: 'duplicate merge', value: 'duplicate_merge' },
  { label: 'failed retryable', value: 'failed_retryable' },
];

const statusTone: Record<MockGuestSyncResponse['status'], 'success' | 'warning' | 'danger'> = {
  success: 'success',
  partial_success: 'warning',
  rejected: 'danger',
  failed: 'danger',
};

function ResponsePreview({ response }: { response: MockGuestSyncResponse }) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-extrabold text-kaset-ink">Response preview</h2>
        <StatusPill tone={statusTone[response.status]}>{response.status}</StatusPill>
      </div>
      <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
        <p className="break-all">syncRequestId: {response.syncRequestId}</p>
        <p>dryRun: {response.dryRun ? 'true' : 'false'}</p>
        <p>create: {response.mergeSummary.recordsToCreate.estimatedTotal}</p>
        <p>merge: {response.mergeSummary.recordsToMerge.estimatedTotal}</p>
        <p>skip: {response.mergeSummary.recordsSkipped.estimatedTotal}</p>
        <p>retryable: {response.retryable ? 'true' : 'false'}</p>
      </div>
    </Card>
  );
}

export function GuestSyncStatusPage() {
  const { state } = useGuestMemory();
  const [response, setResponse] = useState<MockGuestSyncResponse | null>(null);
  const syncStatus = getGuestSyncAdapterStatus();
  const edgeReadiness = useMemo(() => runGuestSyncStagingReadiness(), []);
  const payloadPreview = useMemo(
    () =>
      buildGuestSyncPayloadPreview(
        state,
        {
          savedItems: true,
          farmRecords: true,
          recentAIQuestions: false,
        },
        'phone',
      ),
    [state],
  );

  function runScenario(scenario: GuestSyncMockScenario) {
    setResponse(
      runGuestMemorySyncDryRun({
        payload: payloadPreview.payload,
        scenario,
      }),
    );
  }

  return (
    <div>
      <PageHeader title="สถานะ Guest Sync" subtitle="ตรวจ boundary การซิงก์แบบจำลอง ไม่มีการเขียน cloud จริง" showBack />
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
                  M16
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">Guest Memory Sync Boundary</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ตรวจว่าแอปรู้จัก payload, consent, merge preview และ failure handling โดยไม่ใช้ Supabase หรือ network จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Adapter mode</h2>
                <StatusPill tone={syncStatus.mode === 'local_fixture' ? 'success' : 'warning'}>
                  {syncStatus.modeLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{syncStatus.readinessLabel}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Backend flag</p>
                  <p className="text-base font-extrabold text-kaset-deep">{syncStatus.backendSyncEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Local handler</p>
                  <p className="text-base font-extrabold text-kaset-deep">{syncStatus.localHandlerEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Network</p>
                  <p className="text-base font-extrabold text-kaset-deep">{syncStatus.networkCallsEnabled ? 'เปิด' : 'ปิด'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Service role</p>
                  <p className="text-base font-extrabold text-kaset-deep">
                    {syncStatus.serviceRoleAvailableInFrontend ? 'พบ' : 'ไม่มี'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="กฎความปลอดภัยของข้อมูล">
          Local Guest Memory จะไม่ถูกลบหลัง sync failure และในระบบจริงควร mark ว่าซิงก์แล้วหลัง backend ยืนยัน success เท่านั้น
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CloudUpload aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Guest Sync Edge Function plan</h2>
                <StatusPill tone={edgeReadiness.blockerItems.length > 0 ? 'danger' : 'warning'}>
                  {edgeReadiness.levelLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เตรียม contract สำหรับ POST /functions/v1/{edgeReadiness.endpointName} แต่ยังไม่ deploy ไม่เรียก network และยังไม่เปิด cloud sync
              </p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
                edge flag: {edgeReadiness.flags.enableGuestSyncEdge ? 'เปิด' : 'ปิด'} · mode: {edgeReadiness.flags.guestSyncEdgeMode}
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/guest-sync-edge">
                เปิด Edge Function staging plan
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">รองรับใน proof of concept</h2>
          <div className="mt-3 grid gap-3">
            <div className="flex gap-3 rounded-lg bg-kaset-mist p-3">
              <Phone aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
              <p className="text-sm leading-6 text-slate-700">ผู้สมัครในอนาคต: {syncStatus.supportedProviders.join(', ')}</p>
            </div>
            <div className="flex gap-3 rounded-lg bg-kaset-mist p-3">
              <UsersRound aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
              <p className="text-sm leading-6 text-slate-700">Record types: {syncStatus.supportedRecordTypes.join(', ')}</p>
            </div>
            <div className="flex gap-3 rounded-lg bg-kaset-mist p-3">
              <KeyRound aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
              <p className="text-sm leading-6 text-slate-700">service-role key ต้องอยู่ backend/edge function เท่านั้น</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <PlayCircle aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">ทดสอบ handler จำลอง</h2>
          </div>
          <div className="grid gap-2">
            {testScenarios.map((item) => (
              <Button key={item.value} onClick={() => runScenario(item.value)} variant="secondary">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </Card>

        {response ? <ResponsePreview response={response} /> : null}

        {syncStatus.lastSyncStatus ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <Smartphone aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
              <div>
                <h2 className="font-extrabold text-kaset-ink">สถานะล่าสุดในเครื่องนี้</h2>
                <p className="mt-1 break-all text-sm leading-6 text-slate-600">{syncStatus.lastSyncStatus.syncRequestId}</p>
                <p className="text-sm leading-6 text-slate-600">
                  {syncStatus.lastSyncStatus.status} · {syncStatus.lastSyncStatus.mode}
                </p>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
