import {
  BookOpenCheck,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Eye,
  FileText,
  GitBranch,
  Hand,
  History,
  ImageUp,
  ListChecks,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { LargeActionButton } from '@/components/ui/LargeActionButton';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { runPhaseDecisionPlan } from '@/services/phase-planning/phase-decision-service';
import { runMvpReadinessAudit } from '@/services/qa/mvp-readiness-audit';
import { CalculatorRewardedAdsPlanningCard } from '@/routes/calculators/CalculatorUi';
import type { AppRoute } from '@/types/kaset';

const checklist = [
  {
    title: 'ตัวหนังสืออ่านง่าย',
    detail: 'หัวข้อใหญ่ขึ้น ข้อความหลักใช้ระยะบรรทัดกว้างขึ้น และลดข้อความเทคนิคในหน้าหลัก',
    icon: Eye,
  },
  {
    title: 'ปุ่มกดสบายมือ',
    detail: 'ปุ่มหลักและเมนูสำคัญมีพื้นที่แตะใหญ่ขึ้น เหมาะกับมือถือและผู้ใช้สูงวัย',
    icon: Hand,
  },
  {
    title: 'คำเตือนชัดเจน',
    detail: 'AI และการวิเคราะห์โรคพืชย้ำว่าเป็นคำแนะนำเบื้องต้น ไม่ใช่ผลยืนยันทางการแพทย์พืช',
    icon: ShieldCheck,
  },
  {
    title: 'สมัครทีหลังได้',
    detail: 'ยังคงหลักการใช้งานแบบ Guest ก่อน และบอกตรง ๆ ว่าข้อมูลอยู่ในเครื่องนี้',
    icon: UserRoundCheck,
  },
  {
    title: 'เครดิต AI เข้าใจง่าย',
    detail: 'แยกจำนวนที่ถามได้วันนี้ เครดิตจากโฆษณาจำลอง และค่าเครดิตตามประเภทคำถาม',
    icon: Sparkles,
  },
  {
    title: 'อัปโหลดรูปไม่ทำให้กังวล',
    detail: 'หน้าวิเคราะห์บอกว่ารูปยังไม่ถูกอัปโหลดจริง และมีลิงก์อ่านเรื่องความเป็นส่วนตัว',
    icon: ImageUp,
  },
];

const reviewedRoutes: Array<{ label: string; route: AppRoute }> = [
  { label: 'Calculator AI adapter status', route: '/app/calculators/ai-adapter-status' },
  { label: 'Calculator AI endpoint plan', route: '/app/calculators/ai-endpoint-plan' },
  { label: 'Calculator AI Edge contract', route: '/app/calculators/ai-edge-contract' },
  { label: 'Calculator AI Edge dry run', route: '/app/calculators/ai-edge-dry-run' },
  { label: 'หน้าแรก', route: '/app' },
  { label: 'Admin Dashboard', route: '/app/admin' },
  { label: 'Internal MVP snapshot', route: '/app/mvp-snapshot' },
  { label: 'Next Phase Decision', route: '/app/next-phase' },
  { label: 'Supabase readiness', route: '/app/supabase-readiness' },
  { label: 'Supabase connection dry run', route: '/app/supabase-connection' },
  { label: 'Supabase setup guide', route: '/app/supabase-setup-guide' },
  { label: 'Supabase SQL checklist', route: '/app/supabase-sql-checklist' },
  { label: 'Env safety', route: '/app/env-safety' },
  { label: 'Phone OTP staging checklist', route: '/app/auth/phone-staging' },
  { label: 'Phone Auth staging test review', route: '/app/auth/phone-staging-test' },
  { label: 'Ownership/RLS sync gate review', route: '/app/ownership-rls-gate' },
  { label: 'Guest Sync dry-run payload', route: '/app/guest-sync-dry-run' },
  { label: 'Guest Sync Edge plan', route: '/app/guest-sync-edge' },
  { label: 'My Farm Hub', route: '/app/my-farm' },
  { label: 'My Farm settings', route: '/app/my-farm/settings' },
  { label: 'Notification Center', route: '/app/notifications' },
  { label: 'Notification settings', route: '/app/notification-settings' },
  { label: 'M75 real weather API / local fallback', route: '/app/weather' },
  { label: 'M76 weather QA / cache / coarse location', route: '/app/weather/qa' },
  { label: 'M77 weather local preferences', route: '/app/weather/preferences' },
  { label: 'เครื่องคำนวณเกษตร', route: '/app/calculators' },
  { label: 'ความปลอดภัยเครื่องคำนวณ', route: '/app/calculators/safety' },
  { label: 'QA เครื่องคำนวณเกษตร', route: '/app/calculators/qa' },
  { label: 'ผลคำนวณที่บันทึกไว้', route: '/app/calculators/saved-results' },
  { label: 'ตัวอย่าง export เครื่องคำนวณ', route: '/app/calculators/export-preview' },
  { label: 'แผน AI อธิบายผลคำนวณ', route: '/app/calculators/ai-explanation-preview' },
  { label: 'สถาปัตยกรรม AI backend เครื่องคำนวณ', route: '/app/calculators/ai-architecture' },
  { label: 'คำนวณผสมยา', route: '/app/calculators/spray-mix' },
  { label: 'คำนวณระยะปลูก', route: '/app/calculators/plant-spacing' },
  { label: 'คำนวณปุ๋ย', route: '/app/calculators/fertilizer' },
  { label: 'คำนวณผลผลิต', route: '/app/calculators/yield-estimate' },
  { label: 'คำนวณต้นทุน', route: '/app/calculators/cost' },
  { label: 'คำนวณพื้นที่แปลง', route: '/app/farm-area' },
  { label: 'คู่มือวัดพื้นที่แปลง', route: '/app/farm-area-guide' },
  { label: 'AI ผู้ช่วยเกษตร', route: '/app/ai' },
  { label: 'วิเคราะห์โรคพืช', route: '/app/analyze' },
  { label: 'Image preflight', route: '/app/image-preflight' },
  { label: 'YouTube Hub', route: '/app/youtube' },
  { label: 'ชุมชน', route: '/app/community' },
  { label: 'กติกาชุมชน', route: '/app/community-rules' },
  { label: 'ศูนย์รายงานชุมชน', route: '/app/moderation-center' },
  { label: 'ราคาพืชผล', route: '/app/prices' },
  { label: 'บทความ', route: '/app/articles' },
  { label: 'คลังความรู้เกษตรออฟไลน์', route: '/app/articles/offline' },
  { label: 'QA คลังบทความออฟไลน์', route: '/app/articles/offline-qa' },
  { label: 'M67 เตรียมบทความเต็มออฟไลน์', route: '/app/articles/full-content-readiness' },
  { label: 'M68 pilot article draft review', route: '/app/articles/pilot-draft-review' },
  { label: 'M69 pilot article editorial review', route: '/app/articles/editorial-review' },
  { label: 'M70 editorial evidence and human release gate', route: '/app/articles/editorial-evidence' },
  { label: 'M71 offline article release audit', route: '/app/articles/release-audit' },
  { label: 'M72 offline article CMS persistence plan', route: '/app/articles/cms-persistence-plan' },
  { label: 'M73 offline article CMS migration review', route: '/app/articles/cms-migration-review' },
  { label: 'M74 offline article CMS SQL drafts', route: '/app/articles/cms-sql-drafts' },
  { label: 'ตัวอย่างผู้ดูแลเนื้อหา', route: '/app/content-admin-preview' },
  { label: 'โปรไฟล์', route: '/app/profile' },
  { label: 'ข้อมูลในเครื่องนี้', route: '/app/memory' },
  { label: 'สมัคร/สำรองข้อมูล', route: '/app/auth' },
  { label: 'เครดิต AI', route: '/app/ai-credits' },
];

const knownRisks = [
  'ข้อมูลหลายส่วนยังเป็นโหมดจำลอง จึงต้องคงป้ายบอกสถานะให้ชัด',
  'หน้าที่มี developer panel ยังเหมาะกับ prototype มากกว่าผู้ใช้จริง',
  'ยังไม่มีการทดสอบกับผู้ใช้สูงวัยจริงในภาคสนาม',
  'ยังไม่มีระบบอ่านออกเสียงหรือปรับขนาดตัวอักษรจากในแอป',
];

const nextTasks = [
  'ทดสอบกับเกษตรกร 5-8 คน แล้วจดคำที่ยังอ่านยากหรือสับสน',
  'เพิ่มตัวเลือกขนาดตัวอักษรเมื่อเริ่มทำ mobile app หรือ PWA',
  'แยก developer/debug panel ออกจากหน้าผู้ใช้จริงก่อน production',
  'ตรวจสีและ contrast ด้วยเครื่องมืออัตโนมัติเมื่อเริ่มทำ design system เต็มรูปแบบ',
];

export function QAPage() {
  const mvpAudit = runMvpReadinessAudit();
  const phaseDecision = runPhaseDecisionPlan();

  return (
    <div>
      <PageHeader title="ตรวจความพร้อม UX" subtitle="เช็กความอ่านง่ายและความชัดเจนสำหรับเกษตรกรไทย" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <ListChecks aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <StatusPill className="bg-white/15 text-white ring-white/20" tone="success">
                  M15 Visual QA
                </StatusPill>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">ใช้ง่ายขึ้น อ่านง่ายขึ้น กดง่ายขึ้น</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  หน้านี้สรุปการปรับ UX สำหรับผู้ใช้ที่ไม่ถนัดเทคโนโลยี โดยยังไม่เพิ่ม backend หรือ API จริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" title="หลักการของ M15">
          ใช้คำสั้นลง ปุ่มใหญ่ขึ้น และบอกสถานะสำคัญให้ตรงไปตรงมา เช่น ข้อมูลอยู่ในเครื่องนี้ ยังไม่อัปโหลดรูปจริง และ AI เป็นคำแนะนำเบื้องต้น
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ClipboardCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">M30 Internal MVP Snapshot</h2>
                <StatusPill tone="warning">ยังไม่ใช่ Production App</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {mvpAudit.routeCount} routes · {mvpAudit.routeGroups.length} groups · {mvpAudit.highRiskCount} high-risk modules · ยังเป็น Internal MVP / Prototype
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-kaset-mist p-2">
              <p className="font-extrabold text-kaset-deep">{mvpAudit.statusCounts.ready_mock}</p>
              <p className="text-[11px] font-bold text-slate-500">ready mock</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2">
              <p className="font-extrabold text-amber-900">{mvpAudit.statusCounts.needs_backend + mvpAudit.statusCounts.needs_real_api}</p>
              <p className="text-[11px] font-bold text-amber-900">needs backend/API</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-2">
              <p className="font-extrabold text-rose-800">{mvpAudit.statusCounts.blocked}</p>
              <p className="text-[11px] font-bold text-rose-800">blocked</p>
            </div>
          </div>
          <LargeActionButton
            className="mt-4"
            icon={ClipboardCheck}
            label="เปิด Internal MVP Snapshot"
            description="ดู route coverage, module readiness, production blockers และ next phase"
            to="/app/mvp-snapshot"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={BrainCircuit}
            label="เปิด calculator AI Edge contract"
            description="ดู contract calculator-ai-explain, server-only provider key, audit, rate-limit hook และ timeout behavior"
            to="/app/calculators/ai-edge-contract"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={BrainCircuit}
            label="เปิด calculator AI Edge dry-run"
            description="ดู endpoint URL gate, validation fixtures, secret checklist, audit/rate-limit preview และ no-fetch proof"
            to="/app/calculators/ai-edge-dry-run"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={Phone}
            label="เปิด Phone Auth staging test"
            description="ดู M61 checklist ก่อนทดสอบ Supabase Phone OTP staging จริง โดยยังไม่ส่ง OTP จากแอป"
            to="/app/auth/phone-staging-test"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={ShieldCheck}
            label="เปิด Ownership/RLS sync gate"
            description="ดู M63 owner, consent, idempotency, audit และ RLS gate ก่อนอัปโหลด Guest Memory จริง"
            to="/app/ownership-rls-gate"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={ClipboardCheck}
            label="เปิด Guest Sync dry-run payload"
            description="ดู M64 payload preview, consent preview, idempotency key, audit preview และ privacy filter โดยยังไม่อัปโหลดข้อมูลจริง"
            to="/app/guest-sync-dry-run"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={BookOpenCheck}
            label="เปิดคลังความรู้เกษตรออฟไลน์"
            description="ตรวจ M65 offline article library, image placeholders, safety notes และ CMS fallback plan"
            to="/app/articles/offline"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={ShieldCheck}
            label="เปิด QA คลังบทความออฟไลน์"
            description="ตรวจ M66 editorial checklist, version fixtures, image warnings และกติกา CMS override"
            to="/app/articles/offline-qa"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={FileText}
            label="เปิด M67 full-content readiness"
            description="ดู pilot templates, source placeholders, publish gate และ expert escalation ก่อนเพิ่มบทความเต็ม"
            to="/app/articles/full-content-readiness"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={BookOpenCheck}
            label="เปิด M68 pilot article draft"
            description="ดูร่างบทความ ดิน 6 ชนิด รู้จักก่อนปลูก พร้อม checklist และ publish blockers"
            to="/app/articles/pilot-draft-review"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={UserRoundCheck}
            label="เปิด M69 pilot editorial review"
            description="ตรวจ reviewer sign-off, source metadata, image review และ second pilot draft โดยยังไม่ publish final"
            to="/app/articles/editorial-review"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={ShieldCheck}
            label="เปิด M70 editorial evidence"
            description="ดู evidence packet, completion simulation และ human release gate ที่ยัง block final publish"
            to="/app/articles/editorial-evidence"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={History}
            label="เปิด M71 release audit"
            description="ดู blocked release attempts, reviewer history, diff preview และ automation bypass policy"
            to="/app/articles/release-audit"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={Database}
            label="เปิด M72 CMS persistence plan"
            description="ดู future tables, role rules, release audit write contract, fallback policy และ migration checklist"
            to="/app/articles/cms-persistence-plan"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={Database}
            label="เปิด M73 CMS migration review"
            description="ดู table DDL review plan, RLS expectations, rollback plan และ seed fixtures โดยยังไม่ run migration"
            to="/app/articles/cms-migration-review"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={Database}
            label="เปิด M74 CMS SQL drafts"
            description="ดู schema/RLS/seed/rollback draft artifacts ที่ยังไม่ run SQL และไม่ได้อยู่ใน migrations"
            to="/app/articles/cms-sql-drafts"
            variant="white"
          />
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <GitBranch aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">M36 Next Phase Decision</h2>
                <StatusPill tone="warning">ยังไม่เปิดระบบจริง</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {phaseDecision.recommendation.title} · {phaseDecision.overallReadiness.score}% readiness · main ยังเป็น stable prototype
              </p>
            </div>
          </div>
          <LargeActionButton
            className="mt-4"
            icon={GitBranch}
            label="เปิด Next Phase Decision"
            description="ดู recommended order, staging branch plan, blockers และ risk register"
            to="/app/next-phase"
            variant="soft"
          />
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Calculator aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">M50 Calculator QA</h2>
                <StatusPill tone="success">local fixtures</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ตรวจสูตรผสมยา ระยะปลูก ปุ๋ย ผลผลิต และต้นทุนด้วย expected vs actual พร้อมคำเตือน validation
              </p>
            </div>
          </div>
          <LargeActionButton
            className="mt-4"
            icon={Calculator}
            label="เปิด QA เครื่องคำนวณ"
            description="ดู test case deterministic, pass/warn/fail และขอบเขตความปลอดภัย"
            to="/app/calculators/qa"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={ShieldCheck}
            label="เปิดความปลอดภัยเครื่องคำนวณ"
            description="ดูขอบเขตปุ๋ย สารเคมี AI และ sponsor ก่อนใช้ตัวเลขจริง"
            to="/app/calculators/safety"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={History}
            label="เปิดผลคำนวณที่บันทึกไว้"
            description="ดูสรุป local-only ที่คัดลอก แชร์ซ้ำ หรือลบออกจากเครื่องนี้ได้"
            to="/app/calculators/saved-results"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={BrainCircuit}
            label="เปิดแผน AI อธิบายผล"
            description="ดูขอบเขต prompt/policy ที่ยังไม่เรียก AI จริง และไม่เปลี่ยนผลคำนวณ"
            to="/app/calculators/ai-explanation-preview"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={ShieldCheck}
            label="เปิด AI backend architecture"
            description="ดู snapshot lock, policy version, audit log และ rate limit ก่อนเปิด AI จริง"
            to="/app/calculators/ai-architecture"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={BrainCircuit}
            label="à¹€à¸›à¸´à¸” calculator AI adapter status"
            description="à¸”à¸¹ mode, backend flag, network flag à¹à¸¥à¸° local fixture response à¹à¸šà¸šà¹„à¸¡à¹ˆà¹€à¸£à¸µà¸¢à¸ AI à¸ˆà¸£à¸´à¸‡"
            to="/app/calculators/ai-adapter-status"
            variant="white"
          />
          <LargeActionButton
            className="mt-3"
            icon={BrainCircuit}
            label="เปิด calculator AI endpoint plan"
            description="ดู checklist backend-only prompt execution, lock hash, policy, audit, rate limit และ no-network boundary"
            to="/app/calculators/ai-endpoint-plan"
            variant="soft"
          />
          <LargeActionButton
            className="mt-3"
            icon={BrainCircuit}
            label="เปิด calculator AI Edge contract"
            description="ดู contract calculator-ai-explain, server-only provider key, audit, rate-limit hook และ timeout behavior"
            to="/app/calculators/ai-edge-contract"
            variant="white"
          />
        </Card>

        <CalculatorRewardedAdsPlanningCard compact />

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-kaset-ink">เช็กลิสต์ UX</h2>
            <StatusPill tone="success">พร้อมสำหรับ prototype</StatusPill>
          </div>
          <div className="grid gap-3">
            {checklist.map((item) => {
              const Icon = item.icon;

              return (
                <Card className="p-4" key={item.title}>
                  <div className="flex gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                        <StatusPill tone="success">ตรวจแล้ว</StatusPill>
                      </div>
                      <p className="mt-1 kh-readable text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold text-kaset-ink">หน้าที่ตรวจแล้ว</h2>
          <div className="grid gap-3">
            {reviewedRoutes.map((item) => (
              <LargeActionButton
                className="min-h-[78px]"
                icon={CheckCircle2}
                key={item.route}
                label={item.label}
                to={item.route}
                variant="white"
              />
            ))}
          </div>
        </section>

        <NoticeBox tone="warning" title="ความเสี่ยง UX ที่ยังต้องตามต่อ">
          <ul className="grid gap-2">
            {knownRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <BookOpenCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">งาน polish ถัดไป</h2>
          </div>
          <div className="grid gap-2">
            {nextTasks.map((task) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={task}>
                {task}
              </p>
            ))}
          </div>
        </Card>

        <NoticeBox tone="info" icon={MessageCircle} title="หมายเหตุสำหรับ prototype">
          ยังไม่มี backend, auth, AI จริง, Supabase write หรือ upload รูปจริง การตรวจนี้เน้นความชัดเจนของหน้าจอและความพร้อมก่อนทดสอบกับผู้ใช้จริง
        </NoticeBox>
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">Next phase checklist</h2>
          </div>
          <div className="grid gap-2">
            {mvpAudit.qaChecklist.map((task) => (
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={task}>
                {task}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
