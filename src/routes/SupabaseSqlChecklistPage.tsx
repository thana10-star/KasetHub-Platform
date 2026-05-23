import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  KeyRound,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { summarizeSupabaseSetupProgress } from '@/services/supabase/supabase-setup-progress';
import { buildSupabaseStagingProjectChecklist } from '@/services/supabase/supabase-staging-project-checklist';
import type { SupabaseStagingChecklistItem } from '@/services/supabase/supabase-staging-project-checklist.types';
import { validateSupabaseSqlDraft } from '@/services/supabase/supabase-sql-draft-validator';
import type { SupabaseSqlExpectedArtifact } from '@/services/supabase/supabase-sql-draft-validator.types';

function ArtifactList({ artifacts, title }: { artifacts: SupabaseSqlExpectedArtifact[]; title: string }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-kaset-ink">{title}</h2>
        <StatusPill tone="info">{artifacts.length.toLocaleString('th-TH')} รายการ</StatusPill>
      </div>
      <div className="grid gap-2">
        {artifacts.map((artifact) => (
          <Card className="p-3" key={`${title}-${artifact.name}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-extrabold text-kaset-ink">{artifact.name}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{artifact.note}</p>
              </div>
              <Badge tone="neutral">{artifact.category}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ChecklistSection({ icon: Icon, items, title }: { icon: typeof CheckCircle2; items: string[]; title: string }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
        <h2 className="text-lg font-extrabold text-kaset-ink">{title}</h2>
      </div>
      {items.map((item) => (
        <Card className="p-3" key={item}>
          <p className="text-sm font-bold leading-6 text-kaset-ink">{item}</p>
        </Card>
      ))}
    </section>
  );
}

function M40ChecklistSection({ icon: Icon, items, title }: { icon: typeof CheckCircle2; items: SupabaseStagingChecklistItem[]; title: string }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
        <h2 className="text-lg font-extrabold text-kaset-ink">{title}</h2>
      </div>
      {items.map((item) => (
        <Card className="p-4" key={item.id}>
          <h3 className="font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
          {item.evidence ? (
            <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-xs font-bold leading-5 text-kaset-deep">
              เก็บหลักฐาน: {item.evidence}
            </p>
          ) : null}
        </Card>
      ))}
    </section>
  );
}

export function SupabaseSqlChecklistPage() {
  const validation = useMemo(() => validateSupabaseSqlDraft(), []);
  const m40Checklist = useMemo(() => buildSupabaseStagingProjectChecklist(), []);
  const setupProgress = useMemo(() => summarizeSupabaseSetupProgress(), []);

  return (
    <div>
      <PageHeader title="Supabase SQL Staging Checklist" subtitle="คู่มือตรวจ SQL/RLS แบบ manual ก่อนรันจริงบน staging" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Database aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <Badge className="bg-white/15 text-white" tone="green">
                  manual only
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ได้รัน SQL จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้เป็น checklist จาก draft ใน repo เท่านั้น ไม่เชื่อมต่อ Supabase ไม่อ่านไฟล์จาก browser ไม่รัน migration และไม่เขียนข้อมูล
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="danger" title="Stop if unsure">
          หยุดทันทีถ้าไม่แน่ใจว่า project เป็น staging, ถ้าเห็น production data, ถ้าพบ service-role key ใน frontend, หรือถ้ายังไม่มี rollback plan
        </NoticeBox>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-amber-800">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-amber-950">M40 Supabase staging project + SQL run prep</h2>
                <StatusPill tone="warning">manual guide only</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                ขั้นตอนนี้ยังเป็นคู่มือ ยังไม่ได้เชื่อมต่อจริง รัน SQL เฉพาะ staging เท่านั้น และหยุดทันทีถ้า SQL Editor แสดง error
              </p>
              <div className="mt-3 grid gap-2">
                {m40Checklist.docLinks.slice(0, 3).map((doc) => (
                  <p className="rounded-lg bg-white p-3 text-xs font-bold leading-5 text-amber-950" key={doc.path}>
                    {doc.label}: {doc.path}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">M41 current staging progress</h2>
                <StatusPill tone={setupProgress.nextStep ? 'warning' : 'success'}>
                  {setupProgress.completedCount}/{setupProgress.totalCount}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-700">Next safe step: {setupProgress.nextSafeStep}</p>
              <p className="mt-2 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-kaset-deep">
                blockers: {setupProgress.blockers.slice(0, 2).join(' · ') || 'ไม่มี blocker ใน local checklist'} · ยังไม่เปิด auth · ยังไม่เปิด cloud sync
              </p>
              <Link className="mt-3 inline-flex text-sm font-extrabold text-kaset-deep" to="/app/supabase-setup-guide">
                เปิด M41 setup guide
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center">
            <Database aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-xl font-extrabold text-kaset-ink">{validation.expectedTables.length}</p>
            <p className="text-[11px] font-bold text-slate-500">tables</p>
          </Card>
          <Card className="p-3 text-center">
            <ShieldCheck aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-xl font-extrabold text-kaset-ink">{validation.expectedPolicies.length}</p>
            <p className="text-[11px] font-bold text-slate-500">RLS policies</p>
          </Card>
          <Card className="p-3 text-center">
            <ListChecks aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-xl font-extrabold text-kaset-ink">{validation.expectedIndexes.length}</p>
            <p className="text-[11px] font-bold text-slate-500">indexes</p>
          </Card>
          <Card className="p-3 text-center">
            <KeyRound aria-hidden="true" className="mx-auto h-5 w-5 text-kaset-deep" />
            <p className="mt-2 text-xl font-extrabold text-kaset-ink">{validation.expectedTriggers.length}</p>
            <p className="text-[11px] font-bold text-slate-500">triggers</p>
          </Card>
        </section>

        <M40ChecklistSection icon={Database} items={m40Checklist.projectCreationChecklist} title="M40 project creation checklist" />
        <M40ChecklistSection icon={ClipboardList} items={m40Checklist.sqlExecutionChecklist} title="M40 SQL run prep checklist" />
        <M40ChecklistSection icon={CheckCircle2} items={m40Checklist.postSqlVerificationChecklist} title="M40 post-SQL verification checklist" />

        <ChecklistSection icon={ClipboardList} items={validation.executionOrder} title="SQL execution order" />
        <ChecklistSection icon={CheckCircle2} items={validation.manualVerificationChecklist} title="Manual verification checklist" />

        <ArtifactList artifacts={validation.expectedTables} title="Expected tables" />
        <ArtifactList artifacts={validation.expectedPolicies} title="Expected RLS policies" />
        <ArtifactList artifacts={validation.expectedIndexes} title="Expected indexes" />
        <ArtifactList artifacts={validation.expectedTriggers} title="Expected triggers" />

        <NoticeBox tone="warning" title="Missing / future draft notes">
          <ul className="grid gap-2">
            {validation.missingDraftNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </NoticeBox>

        <ChecklistSection icon={AlertTriangle} items={validation.stagingExecutionWarnings} title="Staging execution warnings" />

        <NoticeBox tone="danger" title="Production blockers">
          <ul className="grid gap-2">
            {validation.productionBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <FileText aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">เอกสารที่ต้องเปิดคู่กัน</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ใช้ `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md` และ `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md` ระหว่างรันด้วยมือบน Supabase Dashboard
              </p>
              <div className="mt-4 grid gap-2">
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/supabase-readiness">
                  เปิด readiness
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep" to="/app/supabase-connection">
                  เปิด connection dry run
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/admin">
                  กลับ Admin Dashboard
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/supabase-setup-guide">
                  เปิด M41 setup guide
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
