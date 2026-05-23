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

export function SupabaseSqlChecklistPage() {
  const validation = useMemo(() => validateSupabaseSqlDraft(), []);

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
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
