import { ArrowRight, Camera, FileText, Flag, ShieldAlert, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  communityRules,
  communitySafetyNotices,
} from '@/services/community-moderation/community-moderation-fixtures';

const ruleIcons = [UsersRound, ShieldAlert, ShieldCheck, FileText, Camera, Flag];

export function CommunityRulesPage() {
  return (
    <div>
      <PageHeader title="กติกาชุมชน" subtitle="แนวทางคุยกันอย่างปลอดภัยใน KasetHub" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="p-5">
            <Badge className="bg-white/15 text-white" tone="green">
              Local safety policy
            </Badge>
            <h2 className="mt-3 text-2xl font-extrabold leading-8">ชุมชนเกษตรกรต้องปลอดภัย น่าเชื่อถือ และไม่หลอกลวง</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/90">
              หน้านี้เป็นกติกาต้นแบบสำหรับโพสต์ ความเห็น รายงาน และการตรวจโดยผู้ดูแลในอนาคต
            </p>
          </div>
        </Card>

        <NoticeBox tone="warning" title="รายงานยังอยู่ในเครื่องนี้">
          รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้ และยังไม่มี backend moderation
        </NoticeBox>

        <NoticeBox tone="danger" title="คำแนะนำเกษตรที่มีความเสี่ยง">
          คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ เจ้าหน้าที่เกษตร หรือฉลากผลิตภัณฑ์ก่อนใช้จริง
        </NoticeBox>

        <section className="grid gap-3">
          {communityRules.map((rule, index) => {
            const Icon = ruleIcons[index] ?? ShieldCheck;

            return (
              <Card className="p-4" key={rule.id}>
                <div className="flex gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-extrabold leading-6 text-kaset-ink">{rule.title}</h2>
                      <Badge tone={rule.tone}>ข้อ {rule.priority}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{rule.summary}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{rule.detail}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <Flag aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">วิธีรายงานโพสต์</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                กดรายงานในโพสต์ เลือกเหตุผล เพิ่มหมายเหตุถ้าต้องการ แล้วดูสถานะได้ที่ศูนย์รายงาน ตัวอย่างนี้ยังไม่ส่งข้อมูลออกจากเครื่อง
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kaset-deep px-3 text-sm font-extrabold text-white"
                  to="/app/community"
                >
                  ไปชุมชน
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kaset-mint px-3 text-sm font-extrabold text-kaset-deep"
                  to="/app/moderation-center"
                >
                  ศูนย์รายงาน
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {communitySafetyNotices.map((notice) => (
          <NoticeBox key={notice.id} tone={notice.tone} title={notice.title}>
            {notice.body}
          </NoticeBox>
        ))}
      </div>
    </div>
  );
}
