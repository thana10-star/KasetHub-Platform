import {
  CheckCircle2,
  CloudUpload,
  Database,
  KeyRound,
  LineChart,
  Lock,
  MessageCircle,
  Phone,
  Server,
  ShieldCheck,
  ToggleLeft,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { getGuestSyncAdapterStatus } from '@/services/backend/guest-sync-adapter';
import { runGuestSyncStagingReadiness } from '@/services/backend/guest-sync-staging-readiness';
import { createGuestToCloudSyncPlan } from '@/services/backend/guest-to-cloud-sync-planner';
import { getAccountStatus } from '@/services/account/account-status-service';
import { runPhoneAuthStagingReview } from '@/services/auth/phone-auth-staging-review';
import { useGuestMemory } from '@/hooks/useGuestMemory';

const backupOptions = [
  {
    label: 'เบอร์โทร',
    description: 'ตัวเลือกหลักในอนาคต เหมาะกับเกษตรกรที่ไม่ใช้อีเมล',
    icon: Phone,
  },
  {
    label: 'LINE',
    description: 'เชื่อมบัญชีสำหรับผู้ใช้ที่ติดตามจาก LINE หรือกลุ่มชุมชน',
    icon: MessageCircle,
  },
  {
    label: 'Google',
    description: 'ตัวเลือกเสริมสำหรับผู้ใช้ที่คุ้นเคยกับบัญชี Google',
    icon: KeyRound,
  },
];

export function AccountPreviewPage() {
  const { state, counts } = useGuestMemory();
  const syncPlan = createGuestToCloudSyncPlan(state);
  const accountStatus = getAccountStatus(state);
  const supabaseStatus = accountStatus.supabase;
  const guestSyncStatus = getGuestSyncAdapterStatus();
  const guestSyncEdge = runGuestSyncStagingReadiness();
  const m61Review = runPhoneAuthStagingReview();

  return (
    <div>
      <PageHeader title="สำรองข้อมูลในอนาคต" subtitle="พรีวิวบัญชีผู้ใช้ ยังไม่เชื่อมต่อจริง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <UserRound aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  Guest mode
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ใช้งานต่อได้เลย ไม่ต้องสมัคร</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ข้อมูลที่บันทึกไว้ตอนนี้อยู่ในเครื่องนี้เท่านั้น สมัครด้วยเบอร์โทรหรือ LINE ในอนาคตเพื่อสำรองข้อมูล
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="M16 ทดสอบซิงก์แบบไม่เขียนข้อมูลจริง">
          หน้านี้แสดงความพร้อมของ Guest Sync และพาไปทดสอบ dry run ได้ ข้อมูลในเครื่องยังเป็นตัวจริงและจะไม่ถูกลบเมื่อทดสอบล้มเหลว
        </NoticeBox>

        <NoticeBox tone="info" title="SQL schema draft ready">
          M18 เตรียมร่าง SQL migration และ RLS policy แล้ว แต่ยังไม่ได้เชื่อมต่อ Supabase จริง และยังไม่ได้รัน migration
        </NoticeBox>

        <NoticeBox tone="warning" title="Supabase staging readiness">
          ยังไม่ได้เชื่อมต่อ Supabase จริง ห้ามใส่ service-role key ใน frontend และต้องทดสอบบน staging ก่อน production
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-readiness">
              เปิด readiness checklist
            </Link>
            <Link className="inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-connection">
              เปิด connection dry run
            </Link>
            <Link className="inline-flex text-sm font-extrabold text-kaset-deep" to="/app/auth/phone-staging">
              เปิด Phone OTP staging checklist
            </Link>
            <Link className="inline-flex text-sm font-extrabold text-kaset-deep" to="/app/auth/phone-staging-test">
              เปิด M61 Phone Auth staging test
            </Link>
            <Link className="inline-flex text-sm font-extrabold text-kaset-deep" to="/app/guest-sync-edge">
              เปิด Guest Sync Edge plan
            </Link>
          </div>
        </NoticeBox>

        <NoticeBox tone="warning" title="M61 Phone Auth staging status">
          {m61Review.levelLabel} · current mode {m61Review.flags.phoneAuthMode} · ข้อมูล Guest Memory จะยังไม่ขึ้น cloud จนกว่า Phone Auth staging และ ownership/RLS จะผ่านจริง
        </NoticeBox>

        {accountStatus.phoneMockSession ? (
          <NoticeBox tone="success" title="มี Phone mock session">
            ยืนยันเบอร์โทรจำลองแล้ว {accountStatus.phoneMockSession.phoneNumberMasked} ใช้ได้เฉพาะการทดสอบ ownership gate ยังไม่ใช่บัญชีจริง
          </NoticeBox>
        ) : (
          <NoticeBox tone="warning" title="ยังไม่ได้ยืนยันเบอร์โทรจำลอง">
            อนาคตการซิงก์จริงต้องมีเจ้าของบัญชีที่ยืนยันแล้วก่อน ตอนนี้ไปยืนยันเบอร์โทรจำลองได้จากหน้าสมัคร
          </NoticeBox>
        )}

        <NoticeBox tone={accountStatus.lineMockSession ? 'success' : 'info'} title="LINE Login boundary">
          {accountStatus.lineMockSession
            ? `มี LINE mock session: ${accountStatus.lineMockSession.displayName} แต่ยังไม่เชื่อม LINE จริง`
            : 'LINE เป็น provider เสริมสำหรับผู้ใช้ไทย แต่ยังเป็น mock-only และควรผูกกับเบอร์โทรก่อนซิงก์จริง'}{' '}
          {accountStatus.linkingPlan.recommendedAction}
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.savedItems}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">รายการบันทึก</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.followedTopics}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">หัวข้อติดตาม</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.farmRecords}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">My Farm</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{accountStatus.localMemoryCount}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">ข้อมูลในเครื่อง</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <Server aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">สถานะ Backend Readiness</h2>
                <Badge tone={supabaseStatus.canCreateClient ? 'green' : 'neutral'}>{supabaseStatus.label}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{supabaseStatus.description}</p>
              <div className="mt-4 rounded-lg bg-kaset-mist p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                  <p className="text-sm font-extrabold text-kaset-ink">Guest mode active</p>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{accountStatus.description}</p>
              </div>
              <div className="mt-4 grid gap-2">
                {supabaseStatus.flags.map((flag) => (
                  <div className="rounded-lg border border-kaset-deep/10 bg-white p-3" key={flag.key}>
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                        {flag.key === 'supabase' ? (
                          <Database aria-hidden="true" className="h-4 w-4" />
                        ) : (
                          <ToggleLeft aria-hidden="true" className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-extrabold text-kaset-ink">{flag.label}</p>
                          <Badge tone={flag.isActive ? 'green' : 'neutral'}>{flag.isActive ? 'เปิด' : 'ปิด'}</Badge>
                        </div>
                        <p className="mt-1 text-xs font-bold text-kaset-deep">{flag.statusLabel}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{flag.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {supabaseStatus.warnings.length > 0 ? (
                <div className="mt-4 rounded-lg bg-amber-50 p-3">
                  <p className="text-sm font-extrabold text-amber-950">ตรวจสอบก่อนเปิดใช้งานจริง</p>
                  <ul className="mt-2 grid gap-1">
                    {supabaseStatus.warnings.map((warning) => (
                      <li className="text-sm leading-6 text-amber-900" key={warning}>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <CloudUpload aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">สถานะ Guest Sync</h2>
                <StatusPill tone={guestSyncStatus.mode === 'local_fixture' ? 'success' : 'warning'}>
                  {guestSyncStatus.modeLabel}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{guestSyncStatus.readinessLabel}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                backend flag: {guestSyncStatus.backendSyncEnabled ? 'เปิด' : 'ปิด'} · local handler:{' '}
                {guestSyncStatus.localHandlerEnabled ? 'เปิด' : 'ปิด'} · service role: ไม่มีใน frontend
              </p>
              <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
                Edge Function plan: {guestSyncEdge.endpointName} · {guestSyncEdge.levelLabel} · ยังไม่เรียก endpoint จริง
              </p>
              <div className="mt-4 grid gap-2">
                <Link to="/app/auth/sync-preview">
                  <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
                    ทดสอบ Sync Preview
                  </span>
                </Link>
                <Link to="/app/guest-sync-status">
                  <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
                    ดูสถานะ Guest Sync
                  </span>
                </Link>
                <Link to="/app/guest-sync-edge">
                  <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-kaset-deep ring-1 ring-kaset-deep/10 transition hover:bg-kaset-mist">
                    ดู Guest Sync Edge plan
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <CloudUpload aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">แผนซิงก์ Guest Memory</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ระบบจะเตรียมอัปโหลดข้อมูลในเครื่องนี้เมื่อผู้ใช้สมัครบัญชีในอนาคต โดยยังไม่ส่งข้อมูลจริงในเวอร์ชันนี้
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{syncPlan.savedItemsToCreate.length}</p>
                  <p className="text-xs font-semibold text-slate-500">saved_items</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{syncPlan.likesToCreate.length}</p>
                  <p className="text-xs font-semibold text-slate-500">likes</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{syncPlan.topicsToFollow.length}</p>
                  <p className="text-xs font-semibold text-slate-500">followed_topics</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-lg font-extrabold text-kaset-deep">{syncPlan.farmRecordsToCreate.length}</p>
                  <p className="text-xs font-semibold text-slate-500">farm_records</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-bold text-kaset-deep">รวมประมาณ {syncPlan.estimatedRecords} records</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <Link to="/app/auth">
              <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
                เปิดตัวอย่างสมัคร/สำรองข้อมูล
              </span>
            </Link>
            <Link to="/app/auth/sync-preview">
              <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
                ดู Sync Preview
              </span>
            </Link>
          </div>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">ตัวเลือกสำรองข้อมูลในอนาคต</h2>
          {backupOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Card className="p-4" key={option.label}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-kaset-ink">{option.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{option.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <Lock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
            <div>
              <h2 className="font-extrabold text-amber-950">ยังไม่เชื่อมต่อบัญชีจริงในเวอร์ชันนี้</h2>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                หน้านี้เป็นพรีวิว UX และแผน sync เท่านั้น ไม่มี Supabase ไม่มี OTP ไม่มี LINE Login และไม่มี network request
              </p>
            </div>
          </div>
        </Card>

        {syncPlan.warnings.length > 0 ? (
          <Card className="p-4">
            <div className="flex gap-3">
              <LineChart aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
              <div>
                <h2 className="font-extrabold text-kaset-ink">ข้อควรระวังในการซิงก์</h2>
                <ul className="mt-2 grid gap-2">
                  {syncPlan.warnings.map((warning) => (
                    <li className="text-sm leading-6 text-slate-600" key={warning}>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ) : null}

        <Button className="w-full" disabled>
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          เตรียมสำรองข้อมูล
        </Button>
      </div>
    </div>
  );
}
