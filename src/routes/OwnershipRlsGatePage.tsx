import { ClipboardCheck, CloudUpload, Database, KeyRound, LockKeyhole, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { buildOwnershipRlsGateStatus } from '@/services/backend/ownership-rls-gate';
import { getPhoneAuthStagingAdapterStatus } from '@/services/auth/phone-auth-staging-adapter';
import { useGuestMemory } from '@/hooks/useGuestMemory';

const checkTone = {
  pass: 'success',
  warn: 'warning',
  block: 'danger',
} as const;

function totalGuestMemoryRecords(counts: ReturnType<typeof useGuestMemory>['counts']) {
  return counts.savedItems + counts.likedPosts + counts.followedTopics + counts.farmRecords + counts.recentAIQuestions;
}

export function OwnershipRlsGatePage() {
  const { counts } = useGuestMemory();
  const phoneStaging = getPhoneAuthStagingAdapterStatus();
  const gate = buildOwnershipRlsGateStatus({
    phoneMockSession: phoneStaging.localMockSession,
    supabaseSessionPreview: phoneStaging.supabaseSessionPreview,
    guestMemoryRecordCount: totalGuestMemoryRecords(counts),
  });

  return (
    <div>
      <PageHeader
        title="Ownership / RLS sync gate"
        subtitle="ตรวจ owner, consent, idempotency, audit และ RLS ก่อนอัปโหลด Guest Memory"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ShieldCheck aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  M63 review gate
                </StatusPill>
                <h2 className="mt-3 text-xl font-extrabold leading-7">ยังไม่อัปโหลดข้อมูลจริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้ตรวจเงื่อนไขก่อน sync เท่านั้น ไม่มี Supabase app table write ไม่มี cloud sync และไม่มี service-role key ใน frontend
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" icon={LockKeyhole} title="Guest Memory upload remains blocked">
          {gate.statusLabel} · syncAllowed {String(gate.syncAllowed)} · no real upload {String(gate.noGuestMemoryUpload)} · no Supabase app writes{' '}
          {String(gate.noSupabaseAppWrites)}
        </NoticeBox>

        <NoticeBox tone="warning" icon={ClipboardCheck} title="M64 dry-run payload builder">
          สร้าง payload preview ในเครื่องได้แล้วสำหรับ saved items, farm records, AI questions, crop watch, calculator summaries, follows และ likes แต่ uploadAllowed ยังเป็น false เสมอ
          <Link className="mt-3 inline-flex font-bold text-kaset-deep" to="/app/guest-sync-dry-run">
            เปิด Guest Sync dry-run payload
          </Link>
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <UserRoundCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Ownership gate status</h2>
                <StatusPill tone={gate.realSessionDetected ? 'warning' : 'danger'}>{gate.statusCode}</StatusPill>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Real session</p>
                  <p className="text-base font-extrabold text-kaset-deep">{gate.realSessionDetected ? 'พบ' : 'ยังไม่พบ'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Mock session</p>
                  <p className="text-base font-extrabold text-kaset-deep">{gate.mockSessionDetected ? 'พบ' : 'ไม่พบ'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Owner id</p>
                  <p className="break-all text-base font-extrabold text-kaset-deep">{gate.expectedOwnerIdMasked ?? 'ยังไม่มี'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Local records</p>
                  <p className="text-base font-extrabold text-kaset-deep">{gate.guestMemoryRecordCount.toLocaleString('th-TH')}</p>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
                Next safe step: {gate.nextSafeStep}
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">Gate checks</h2>
            <Badge tone="gold">{gate.blockers.length} blockers</Badge>
          </div>
          {gate.checks.map((check) => (
            <Card className="p-4" key={check.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
                  <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-kaset-ink">{check.label}</h3>
                    <StatusPill tone={checkTone[check.status]}>{check.status}</StatusPill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{check.detail}</p>
                  <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">{check.evidence}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-amber-900">{check.nextAction}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Consent / idempotency / audit checklist</h2>
              <div className="mt-3 grid gap-2">
                {[...gate.consentRequirements, ...gate.idempotencyRequirements, ...gate.auditRequirements].map((item) => (
                  <div className="rounded-lg bg-kaset-mist p-3" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
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
              <Database aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">RLS expectations</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ต้องตรวจแบบ owner-scoped dry-run ก่อน sync จริง: own-only read/write, anon blocked, service-role backend only
              </p>
              <div className="mt-3 grid gap-2">
                {gate.rlsExpectations.map((item) => (
                  <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10" key={item.id}>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="sky">{item.tableGroup}</Badge>
                      <StatusPill tone="warning">{item.status}</StatusPill>
                    </div>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{item.expectation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" icon={KeyRound} title="Service-role boundary">
          service-role key ต้องอยู่ฝั่ง backend หรือ Edge Function เท่านั้น หากพบ key ลักษณะ service-role ใน frontend ให้หยุด sync, ลบค่า env และ rotate key ทันที
        </NoticeBox>

        <div className="grid gap-3">
          <LargeActionButton icon={ClipboardCheck} label="เปิด Guest Sync dry-run payload" description="ดู consent preview, idempotency key, audit preview และ privacy filter ก่อน milestone อัปโหลดจริง" to="/app/guest-sync-dry-run" variant="soft" />
          <LargeActionButton icon={CloudUpload} label="เปิด Sync Preview" description="ดู payload dry-run local-only ยังไม่ upload จริง" to="/app/auth/sync-preview" variant="soft" />
          <LargeActionButton icon={Database} label="เปิด Guest Sync Status" description="ดู adapter/Edge Function plan แบบ no-cloud-write" to="/app/guest-sync-status" variant="white" />
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/account-preview">
            กลับไปหน้า Account Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
