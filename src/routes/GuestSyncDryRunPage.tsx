import {
  AlertTriangle,
  ClipboardCheck,
  CloudUpload,
  Database,
  EyeOff,
  FileText,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  getSavedCalculatorResultSummaries,
  subscribeCalculatorResultSummaries,
} from '@/services/agri-calculators/calculator-result-summary-service';
import { getPhoneAuthStagingAdapterStatus } from '@/services/auth/phone-auth-staging-adapter';
import { buildGuestSyncDryRunPayload } from '@/services/backend/guest-sync-dry-run-payload';
import type {
  GuestSyncDryRunConsentInput,
  GuestSyncDryRunRecordGroup,
  GuestSyncDryRunRecordGroupKey,
} from '@/services/backend/guest-sync-dry-run-payload.types';
import { useCropWatch } from '@/hooks/useCropWatch';
import { useGuestMemory } from '@/hooks/useGuestMemory';

const groupOrder: GuestSyncDryRunRecordGroupKey[] = [
  'savedItems',
  'farmRecords',
  'recentAiQuestions',
  'cropWatches',
  'calculatorSavedResults',
  'followedTopics',
  'likes',
];

const defaultConsent: GuestSyncDryRunConsentInput = {
  savedItems: true,
  farmRecords: true,
  recentAiQuestions: false,
  cropWatches: true,
  calculatorSavedResults: true,
  followedTopics: true,
  likes: true,
};

function CountCard({ group }: { group: GuestSyncDryRunRecordGroup }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-kaset-ink">{group.label}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            {group.includedInPayload ? 'รวมใน payload preview' : 'ยังไม่รวมใน preview'}
          </p>
        </div>
        <StatusPill tone={group.includedInPayload ? 'success' : group.count > 0 ? 'warning' : 'neutral'}>
          {group.count.toLocaleString('th-TH')}
        </StatusPill>
      </div>
    </Card>
  );
}

export function GuestSyncDryRunPage() {
  const { state } = useGuestMemory();
  const cropWatch = useCropWatch();
  const [consent, setConsent] = useState<GuestSyncDryRunConsentInput>(defaultConsent);
  const [calculatorSummaries, setCalculatorSummaries] = useState(() => getSavedCalculatorResultSummaries());
  const phoneStaging = getPhoneAuthStagingAdapterStatus();

  useEffect(() => {
    const refresh = () => setCalculatorSummaries(getSavedCalculatorResultSummaries());
    refresh();
    return subscribeCalculatorResultSummaries(refresh);
  }, []);

  const payload = useMemo(
    () =>
      buildGuestSyncDryRunPayload({
        guestMemory: state,
        cropWatches: cropWatch.watches,
        calculatorSavedResults: calculatorSummaries.savedResults,
        consent,
        phoneMockSession: phoneStaging.localMockSession,
        supabaseSessionPreview: phoneStaging.supabaseSessionPreview,
      }),
    [calculatorSummaries.savedResults, consent, cropWatch.watches, phoneStaging.localMockSession, phoneStaging.supabaseSessionPreview, state],
  );

  const groups = groupOrder.map((key) => payload.groups[key]);
  const firstRecordPreviews = groups.flatMap((group) =>
    group.records.slice(0, 2).map((record) => ({ ...record, groupLabel: group.label })),
  );

  function toggleConsent(key: GuestSyncDryRunRecordGroupKey) {
    setConsent((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div>
      <PageHeader
        title="Guest Sync dry-run payload"
        subtitle="สร้าง payload จำลองสำหรับย้าย Guest Memory แบบ local-only ยังไม่อัปโหลดข้อมูลจริง"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <CloudUpload aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  M64 dry run
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">ยังไม่อัปโหลดข้อมูลจริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ช่วยดูว่าข้อมูลในเครื่องจะถูกจัดกลุ่มอย่างไร ก่อน milestone ที่มี backend-owned validation, owner/RLS check, consent จริง และ audit log
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" icon={LockKeyhole} title="Sync remains blocked">
          uploadAllowed {String(payload.uploadAllowed)} · noCloudSync {String(payload.noCloudSync)} · noSupabaseWrite{' '}
          {String(payload.noSupabaseWrite)} · service-role key ต้องไม่อยู่ใน frontend
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <CountCard group={payload.groups.savedItems} />
          <CountCard group={payload.groups.farmRecords} />
          <CountCard group={payload.groups.recentAiQuestions} />
          <CountCard group={payload.groups.cropWatches} />
          <CountCard group={payload.groups.calculatorSavedResults} />
          <CountCard group={payload.groups.followedTopics} />
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-kaset-ink">รวมใน preview</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">เฉพาะข้อมูลที่ผ่าน consent preview</p>
              </div>
              <StatusPill tone="info">{payload.totalIncludedRecords.toLocaleString('th-TH')}</StatusPill>
            </div>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Consent preview</h2>
                <StatusPill tone={payload.consentPreview.accepted ? 'success' : 'warning'}>
                  {payload.consentPreview.accepted ? 'พร้อมตรวจต่อ' : 'ยังไม่ครบ'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{payload.consentPreview.localOnlyWarning}</p>
              <div className="mt-3 grid gap-2">
                {groups.map((group) => (
                  <label
                    className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-kaset-mist p-3"
                    key={group.key}
                  >
                    <span className="min-w-0">
                      <span className="block font-extrabold text-kaset-ink">{group.label}</span>
                      <span className="block text-xs font-bold leading-5 text-slate-500">
                        {group.count.toLocaleString('th-TH')} รายการ · {group.conflictPolicy}
                      </span>
                    </span>
                    <input
                      checked={consent[group.key]}
                      className="h-6 w-6 shrink-0 accent-kaset-leaf"
                      onChange={() => toggleConsent(group.key)}
                      type="checkbox"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-3 grid gap-2">
                {payload.consentPreview.checklist.map((item) => (
                  <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10" key={item.id}>
                    <div className="flex flex-wrap gap-2">
                      <p className="font-extrabold text-kaset-ink">{item.label}</p>
                      <StatusPill tone={item.status === 'ready' ? 'success' : item.status === 'missing' ? 'danger' : 'warning'}>
                        {item.status}
                      </StatusPill>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <KeyRound aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Idempotency preview</h2>
              <div className="mt-3 grid gap-2 text-sm font-bold leading-6 text-slate-700">
                <p className="break-all rounded-lg bg-kaset-mist p-3">syncRequestId: {payload.idempotencyPreview.syncRequestId}</p>
                <p className="break-all rounded-lg bg-kaset-mist p-3">idempotencyKey: {payload.idempotencyPreview.idempotencyKey}</p>
              </div>
              <div className="mt-3 grid gap-2">
                {payload.idempotencyPreview.duplicateHandlingPreview.map((line) => (
                  <p className="rounded-lg bg-white p-3 text-xs font-bold leading-5 text-slate-600 ring-1 ring-kaset-deep/10" key={line}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Owner scope และ audit preview</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Real session</p>
                  <p className="text-base font-extrabold text-kaset-deep">{payload.ownerScope.realSessionDetected ? 'พบ' : 'ยังไม่พบ'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Mock session</p>
                  <p className="text-base font-extrabold text-kaset-deep">{payload.ownerScope.mockSessionDetected ? 'พบ' : 'ไม่พบ'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Owner id</p>
                  <p className="break-all text-base font-extrabold text-kaset-deep">{payload.ownerScope.maskedOwnerId ?? 'ยังไม่มี'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Audit write</p>
                  <p className="text-base font-extrabold text-kaset-deep">{payload.auditPreview.wouldWriteAuditLog ? 'จะเขียน' : 'ไม่เขียน'}</p>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
                {payload.ownerScope.authUidExpectation}
              </p>
              <p className="mt-2 break-all rounded-lg bg-white p-3 text-xs font-bold leading-5 text-slate-600 ring-1 ring-kaset-deep/10">
                auditEventId: {payload.auditPreview.auditEventId}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
              <FileText aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Payload preview</h2>
                <Badge tone="gold">safe summary only</Badge>
              </div>
              {firstRecordPreviews.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {firstRecordPreviews.map((record) => (
                    <div className="rounded-lg bg-kaset-mist p-3" key={`${record.groupLabel}-${record.localId}`}>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="neutral">{record.groupLabel}</Badge>
                        <span className="text-xs font-bold leading-5 text-slate-500">{record.createdAt}</span>
                      </div>
                      <p className="mt-2 font-extrabold text-kaset-ink">{record.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{record.safeSummary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-slate-600">
                  ยังไม่มี record preview เพราะไม่มีข้อมูล local หรือยังไม่ให้ consent กลุ่มข้อมูล
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-800">
              <EyeOff aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Privacy filters</h2>
              <div className="mt-3 grid gap-2">
                {payload.privacyFilterNotes.map((note) => (
                  <p className="rounded-lg bg-white p-3 text-xs font-bold leading-5 text-slate-600 ring-1 ring-kaset-deep/10" key={note}>
                    {note}
                  </p>
                ))}
              </div>
              <p className="mt-3 break-all rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                filtered fields: {payload.excludedSensitiveFields.length > 0 ? payload.excludedSensitiveFields.join(', ') : 'ยังไม่พบ field เสี่ยง'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Blockers</h2>
                <StatusPill tone="danger">{payload.blockers.length}</StatusPill>
              </div>
              <div className="mt-3 grid gap-2">
                {payload.blockers.map((blocker) => (
                  <div className="rounded-lg bg-rose-50 p-3" key={blocker.id}>
                    <p className="font-extrabold text-rose-900">{blocker.label}</p>
                    <p className="mt-1 text-sm leading-6 text-rose-800">{blocker.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={ClipboardCheck} title="Next safe step">
          {payload.nextSafeStep}
        </NoticeBox>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/ownership-rls-gate">
            เปิด Ownership/RLS gate
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/auth/sync-preview">
            กลับไป Sync Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
