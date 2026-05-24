import { FileImage, FileText, ListChecks, ShieldAlert, UserCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  getArticleEvidencePacketSummary,
  getArticleReleaseBlockerLabel,
} from '@/services/content/offline-agri-editorial-evidence';

export function OfflineArticleEditorialEvidencePage() {
  const summary = getArticleEvidencePacketSummary();
  const packet = summary.packets.find((item) => item.articleSlug === 'soil-types-before-planting') ?? summary.packets[0];
  const simulated = summary.simulatedPacket;

  return (
    <div>
      <PageHeader
        title="Editorial evidence"
        subtitle="M70 evidence packet และ human release gate แบบ local-only"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ListChecks aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="warning">
                  human release required
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ยังไม่ได้เผยแพร่จริง</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ต่อให้ metadata และ review ถูกจำลองว่าครบแล้ว ระบบยังต้องมี release reviewer, timestamp, note และ human approval แยกต่างหาก
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={WifiOff} title="offline-first / no publish">
          หน้านี้เป็นหลักฐาน local-only ไม่มี Supabase write ไม่มี CMS write ไม่มี AI generation และไม่มี production publish
        </NoticeBox>

        <Link to="/app/articles/release-audit">
          <Card className="border-rose-200 bg-rose-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-rose-950">M71 release audit</h2>
                <p className="mt-1 text-sm leading-6 text-rose-900">
                  ดู timeline, blocked attempts, diff preview และ automation bypass ที่ยังไม่สามารถ publish จริงได้
                </p>
              </div>
              <StatusPill tone="warning">audit ready</StatusPill>
            </div>
          </Card>
        </Link>

        <Link to="/app/articles/cms-persistence-plan">
          <Card className="border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-extrabold text-sky-950">M72 CMS persistence plan</h2>
                <p className="mt-1 text-sm leading-6 text-sky-900">
                  วางสัญญา backend-owned CMS, role rules และ fallback policy โดยยังไม่เขียน Database จริง
                </p>
              </div>
              <StatusPill tone="warning">no DB write</StatusPill>
            </div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <FileText aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.packetCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">evidence packets</p>
          </Card>
          <Card className="p-4">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{summary.finalPublishAllowedCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">final publish allowed</p>
          </Card>
          <Card className="p-4">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{packet.completedEvidenceCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">completed now</p>
          </Card>
          <Card className="p-4">
            <UserCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <p className="mt-3 text-3xl font-extrabold text-kaset-ink">{packet.missingEvidenceCount}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">missing now</p>
          </Card>
        </section>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="warning">current packet</StatusPill>
            <Badge tone="sky">{packet.articleSlug}</Badge>
            <Badge tone="rose">final publish: no</Badge>
          </div>
          <h2 className="mt-3 text-lg font-extrabold text-kaset-ink">{packet.titleTh}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{packet.escalationNoteTh}</p>

          <div className="mt-4 grid gap-3">
            <section>
              <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                <ListChecks aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                Source evidence
              </h3>
              <div className="mt-2 grid gap-2">
                {packet.sourceEvidence.map((item) => (
                  <div className="rounded-lg bg-sky-50 p-3" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone="warning">{item.status}</StatusPill>
                      <Badge tone="sky">{item.sourceType}</Badge>
                    </div>
                    <h4 className="mt-2 font-extrabold text-sky-950">{item.labelTh}</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.noteTh}</p>
                    <p className="mt-1 text-xs font-bold text-sky-900">{item.citationPlaceholder}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                <UserCheck aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                Reviewer progress
              </h3>
              <div className="mt-2 grid gap-2">
                {packet.reviewerEvidence.map((item) => (
                  <div className="rounded-lg bg-kaset-mist p-3" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone="warning">{item.status}</StatusPill>
                      <Badge tone="neutral">{item.role}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-bold leading-6 text-kaset-deep">{item.reviewerNamePlaceholder}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.noteTh}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-kaset-ink">
                <FileImage aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
                Image evidence
              </h3>
              <div className="mt-2 grid gap-2">
                {packet.imageEvidence.map((item) => (
                  <div className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone="warning">{item.status}</StatusPill>
                      <Badge tone="neutral">max {item.maxSizeKbTarget}KB</Badge>
                    </div>
                    <p className="mt-2 break-all text-xs font-bold text-slate-600">{item.plannedPath}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.altTextTh}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Card>

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="warning">completion simulation</StatusPill>
            <Badge tone="neutral">{simulated.completedEvidenceCount}/{simulated.completedEvidenceCount + simulated.missingEvidenceCount} evidence complete</Badge>
            <Badge tone="rose">still blocked</Badge>
          </div>
          <h2 className="mt-3 font-extrabold text-amber-950">จำลองว่า metadata/review ครบแล้วก็ยัง publish ไม่ได้</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            ระบบยังต้องมี explicit human approval, release reviewer, release timestamp และ release note ก่อนอนุญาตเผยแพร่จริงในอนาคต
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {simulated.releaseGate.blockers.map((blocker) => (
              <Badge key={blocker} tone="rose">
                {getArticleReleaseBlockerLabel(blocker)}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">Human approval requirement</h2>
          <div className="mt-3 grid gap-2">
            {packet.releaseGate.approvalRequirement.missingFields.map((field) => (
              <div className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-900" key={field}>
                {field}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to="/app/articles/editorial-review">
            กลับไป editorial review
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/full-content-readiness">
            เปิด full-content readiness
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/articles/release-audit">
            เปิด M71 release audit
          </Link>
        </div>
      </div>
    </div>
  );
}
