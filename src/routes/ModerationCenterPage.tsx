import { ClipboardList, EyeOff, Flag, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { communityPosts } from '@/data/mockData';
import { useCommunityModeration } from '@/hooks/useCommunityModeration';
import {
  communityReportReasonLabels,
  mockModeratorQueueItems,
  moderationActionLabels,
  moderationStatusLabels,
} from '@/services/community-moderation/community-moderation-fixtures';
import {
  communityModerationLocalOnlyNotice,
  createLocalModeratorQueueItems,
} from '@/services/community-moderation/community-moderation-service';
import type { ModerationStatus } from '@/services/community-moderation/community-moderation.types';

const statusTone: Record<ModerationStatus, 'success' | 'warning' | 'info' | 'neutral'> = {
  pending_review: 'warning',
  reviewed: 'info',
  action_taken: 'success',
  dismissed: 'neutral',
};

function formatDateTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

function getPostLabel(postId: string) {
  const post = communityPosts.find((item) => item.id === postId);
  return post ? `${post.topic} · ${post.author}` : postId;
}

export function ModerationCenterPage() {
  const {
    clearLocalModerationDemo,
    counts,
    hiddenPosts,
    reports,
    unhidePost,
  } = useCommunityModeration();
  const queueItems = [...createLocalModeratorQueueItems(reports), ...mockModeratorQueueItems];

  return (
    <div>
      <PageHeader title="ศูนย์รายงานชุมชน" subtitle="ตัวอย่าง moderation center ในเครื่องนี้" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="p-5">
            <Badge className="bg-white/15 text-white" tone="green">
              Local/mock only
            </Badge>
            <h2 className="mt-3 text-2xl font-extrabold leading-8">ตรวจรายงานและโพสต์ที่ซ่อนแบบตัวอย่าง</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/90">
              {counts.pendingReports} รายงานรอตรวจ · {counts.hiddenPosts} โพสต์ที่ซ่อนในเครื่องนี้
            </p>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่มีผู้ดูแลระบบจริง">
          {communityModerationLocalOnlyNotice} หน้านี้เป็น UX foundation สำหรับ admin/moderator ในอนาคตเท่านั้น
        </NoticeBox>

        <div className="grid grid-cols-2 gap-3">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep"
            to="/app/community-rules"
          >
            กติกาชุมชน
          </Link>
          <Button className="min-h-12 px-4 text-sm" onClick={clearLocalModerationDemo} variant="secondary">
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            ล้างเดโม
          </Button>
        </div>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">รายงานในเครื่อง</h2>
            <Badge tone="neutral">{reports.length} รายงาน</Badge>
          </div>
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card className="p-4" key={report.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                    <Flag aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="gold">{communityReportReasonLabels[report.reason]}</Badge>
                      <StatusPill tone={statusTone[report.status]}>{moderationStatusLabels[report.status]}</StatusPill>
                    </div>
                    <h3 className="mt-2 font-extrabold text-kaset-ink">{getPostLabel(report.postId)}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{report.note || 'ไม่มีหมายเหตุเพิ่มเติม'}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{formatDateTime(report.createdAt)}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-5 text-center">
              <Flag aria-hidden="true" className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 font-extrabold text-kaset-ink">ยังไม่มีรายงานในเครื่องนี้</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">กลับไปที่ชุมชนแล้วกดรายงานโพสต์ตัวอย่างเพื่อทดสอบ UX</p>
            </Card>
          )}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">โพสต์ที่ซ่อน</h2>
            <Badge tone="neutral">{hiddenPosts.length} โพสต์</Badge>
          </div>
          {hiddenPosts.length > 0 ? (
            hiddenPosts.map((hiddenPost) => (
              <Card className="p-4" key={hiddenPost.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                    <EyeOff aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge tone="neutral">ซ่อนในเครื่องนี้</Badge>
                    <h3 className="mt-2 font-extrabold text-kaset-ink">{getPostLabel(hiddenPost.postId)}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      เหตุผล: {hiddenPost.reason === 'user_hidden' ? 'ผู้ใช้ซ่อนเอง' : communityReportReasonLabels[hiddenPost.reason]}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{formatDateTime(hiddenPost.hiddenAt)}</p>
                    <Button className="mt-3 min-h-11 px-4 text-sm" onClick={() => unhidePost(hiddenPost.postId)} variant="secondary">
                      <RotateCcw aria-hidden="true" className="h-4 w-4" />
                      แสดงอีกครั้ง
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-5 text-center">
              <EyeOff aria-hidden="true" className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 font-extrabold text-kaset-ink">ยังไม่มีโพสต์ที่ซ่อน</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">การซ่อนโพสต์เป็น local-only และยกเลิกได้เสมอ</p>
            </Card>
          )}
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-kaset-ink">คิวผู้ดูแลตัวอย่าง</h2>
            <Badge tone="sky">{queueItems.length} รายการ</Badge>
          </div>
          {queueItems.map((item) => (
            <Card className="p-4" key={item.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  {item.source === 'local_report' ? (
                    <ClipboardList aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone={statusTone[item.status]}>{moderationStatusLabels[item.status]}</StatusPill>
                    <Badge tone={item.source === 'local_report' ? 'gold' : 'sky'}>
                      {item.source === 'local_report' ? 'จากเครื่องนี้' : 'คิวตัวอย่าง'}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-extrabold text-kaset-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    เหตุผล: {communityReportReasonLabels[item.reason]} · แนวทาง: {moderationActionLabels[item.recommendedAction]}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <NoticeBox tone="info" title="แผนในอนาคตสำหรับผู้ดูแล">
          ระบบจริงควรมีบัญชีผู้ดูแล, audit log, queue review, action history, appeal/correction flow และ RLS ก่อนเปิดให้เขียนข้อมูลจริง
        </NoticeBox>
      </div>
    </div>
  );
}
