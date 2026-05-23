import {
  AlertTriangle,
  CheckCircle2,
  CloudUpload,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  guestSyncStagingAreaLabels,
  guestSyncStagingStatusLabels,
  runGuestSyncStagingReadiness,
} from '@/services/backend/guest-sync-staging-readiness';
import type {
  GuestSyncStagingReadinessItem,
  GuestSyncStagingReadinessStatus,
} from '@/services/backend/guest-sync-edge.types';

const badgeTone: Record<GuestSyncStagingReadinessStatus, 'green' | 'gold' | 'rose'> = {
  pass: 'green',
  warn: 'gold',
  block: 'rose',
};

function ReadinessItemCard({ item }: { item: GuestSyncStagingReadinessItem }) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          {item.status === 'pass' ? (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          ) : (
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge tone={badgeTone[item.status]}>{guestSyncStagingStatusLabels[item.status]}</Badge>
            <Badge tone="neutral">{guestSyncStagingAreaLabels[item.area]}</Badge>
          </div>
          <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
          <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
            หลักฐาน: {item.evidence}
          </p>
          {item.nextAction ? <p className="mt-2 text-xs leading-5 text-slate-500">ขั้นต่อไป: {item.nextAction}</p> : null}
        </div>
      </div>
    </Card>
  );
}

export function GuestSyncEdgePage() {
  const readiness = useMemo(() => runGuestSyncStagingReadiness(), []);

  return (
    <div>
      <PageHeader title="Guest Sync Edge Function Plan" subtitle="แผน staging สำหรับ endpoint จริง โดยยังไม่ deploy และไม่เรียก network" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <CloudUpload aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge className="bg-white/15 text-white" tone="green">
                  M29 contract only
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">{readiness.endpointName}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  เตรียมสัญญา Supabase Edge Function สำหรับซิงก์ Guest Memory หลังมี session เจ้าของบัญชีจริง แต่ในเวอร์ชันนี้ยังไม่ deploy ไม่เรียก endpoint และไม่เขียน Supabase
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่ได้ deploy Edge Function จริง">
          ยังไม่เรียก endpoint จริง ยังไม่เปิด cloud sync ยังไม่เปิด auth จริง และ Local Guest Memory ยังเป็นข้อมูลหลักในเครื่องนี้
        </NoticeBox>

        <section className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{readiness.score}%</p>
            <p className="text-[11px] font-bold text-slate-500">readiness</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-amber-800">{readiness.warningItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">warnings</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-rose-800">{readiness.blockerItems.length}</p>
            <p className="text-[11px] font-bold text-slate-500">blockers</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">Edge Function contract readiness</h2>
                <StatusPill tone={readiness.blockerItems.length > 0 ? 'danger' : 'warning'}>{readiness.levelLabel}</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Endpoint: <span className="font-bold text-kaset-deep">POST /functions/v1/{readiness.endpointName}</span>
              </p>
              <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                request version: {readiness.requestShape.endpointVersion} · no-write/no-call preview
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <UserRoundCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Auth/session requirement</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                การซิงก์จริงต้องมี Supabase user session ที่ตรวจ owner ได้ด้วย auth.uid() ก่อน Edge Function เขียนข้อมูลใด ๆ
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/auth/phone-staging">
                เปิด Phone OTP staging checklist
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <LockKeyhole aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Service-role boundary</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                service-role key ต้องอยู่เฉพาะใน Supabase Edge Function หรือ backend secret store ห้ามอยู่ใน frontend, Vite env, Git repo หรือ Cloudflare public env
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <KeyRound aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Idempotency key preview</h2>
              <p className="mt-1 break-all rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep">
                {readiness.idempotencyPreview}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                retry ด้วย key เดิมต้องไม่สร้างข้อมูลซ้ำ และควรคืนผลเดิมหรือ noop อย่างปลอดภัย
              </p>
            </div>
          </div>
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <RotateCcw aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="text-lg font-extrabold text-kaset-ink">Idempotency / merge rules</h2>
          </div>
          {[
            'saved_items รวมด้วย itemType + itemId',
            'likes ใช้ or-true-wins เพื่อลดรายการซ้ำ',
            'followed_topics รวมตาม topic id',
            'farm_records เก็บทั้งสองฝั่งถ้า local id ไม่ซ้ำ',
            'recent_ai_questions ซิงก์เฉพาะเมื่อผู้ใช้ยินยอม',
          ].map((rule) => (
            <Card className="p-3" key={rule}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{rule}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Staging test checklist</h2>
          {readiness.stagingTestChecklist.map((step) => (
            <Card className="p-3" key={step}>
              <p className="text-sm font-bold leading-6 text-kaset-ink">{step}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">Readiness items</h2>
          {readiness.items.map((item) => (
            <ReadinessItemCard item={item} key={item.id} />
          ))}
        </section>

        <NoticeBox tone="danger" title="Production blockers">
          <ul className="grid gap-2">
            {readiness.productionBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </NoticeBox>

        <NoticeBox tone="info" title="Security boundaries">
          <ul className="grid gap-2">
            {readiness.securityBoundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4">
          <div className="grid gap-2">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/auth/sync-preview">
              เปิด Sync Preview
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/guest-sync-status">
              เปิด Guest Sync Status
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-readiness">
              เปิด Supabase Readiness
            </Link>
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
              กลับ Admin Dashboard
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
