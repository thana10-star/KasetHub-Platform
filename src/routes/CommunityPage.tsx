import { EyeOff, Flag, Plus, RotateCcw, Search, ShieldCheck, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityPostCard } from '@/components/kaset/CommunityPostCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { communityPosts } from '@/data/mockData';
import { useCommunityModeration } from '@/hooks/useCommunityModeration';
import {
  communityReportReasonLabels,
  communityRules,
  communitySafetyNotices,
} from '@/services/community-moderation/community-moderation-fixtures';
import { communityModerationLocalOnlyNotice } from '@/services/community-moderation/community-moderation-service';
import type { CommunityReportReason } from '@/services/community-moderation/community-moderation.types';
import type { CommunityPost } from '@/types/kaset';

const topics = ['ทั้งหมด', 'ข้าว', 'ทุเรียน', 'ดินและปุ๋ย', 'ผักปลอดภัย'];
const reportReasons = Object.keys(communityReportReasonLabels) as CommunityReportReason[];

export function CommunityPage() {
  const {
    clearLocalModerationDemo,
    counts,
    hidePost,
    hiddenPosts,
    isPostHidden,
    reportCommunityPost,
    reports,
    unhidePost,
  } = useCommunityModeration();
  const [reportingPost, setReportingPost] = useState<CommunityPost | undefined>();
  const [selectedReason, setSelectedReason] = useState<CommunityReportReason>('spam');
  const [reportNote, setReportNote] = useState('');
  const [lastReportPostId, setLastReportPostId] = useState<string | undefined>();

  function openReportSheet(post: CommunityPost) {
    setReportingPost(post);
    setSelectedReason('spam');
    setReportNote('');
  }

  function submitReport() {
    if (!reportingPost) {
      return;
    }

    reportCommunityPost({
      postId: reportingPost.id,
      reason: selectedReason,
      note: reportNote,
      sourceRoute: '/app/community',
      metadata: {
        post: reportingPost,
      },
    });
    setLastReportPostId(reportingPost.id);
    setReportingPost(undefined);
    setReportNote('');
  }

  function getModerationStatusLabel(postId: string) {
    if (lastReportPostId === postId || reports.some((report) => report.postId === postId)) {
      return 'รอตรวจในเครื่อง';
    }

    return undefined;
  }

  return (
    <div>
      <PageHeader title="ชุมชนเกษตรกร" subtitle="ถาม ตอบ และแบ่งปันประสบการณ์" showBack />
      <div className="grid gap-5 px-5 pb-24">
        <section className="rounded-lg bg-white p-4 shadow-card ring-1 ring-kaset-deep/5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <UsersRound aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">ฟีดคำถามตัวอย่าง</h2>
              <p className="mt-1 text-sm text-slate-500">โพสต์ทั้งหมดเป็นข้อมูลสาธิตสำหรับต้นแบบ</p>
            </div>
            <button
              aria-label="ค้นหาโพสต์"
              className="grid h-10 w-10 place-items-center rounded-full bg-kaset-mint text-kaset-deep"
              type="button"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </section>

        <NoticeBox tone="warning" title="ชุมชนและการรายงานเป็นตัวอย่าง">
          {communityModerationLocalOnlyNotice} ไม่มี backend, Supabase write, API ผู้ดูแล หรือการส่งข้อมูลออกจากเครื่อง
        </NoticeBox>

        <NoticeBox tone="danger" title="ความปลอดภัยของคำแนะนำเกษตร">
          คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ ก่อนนำไปใช้จริงในแปลง
        </NoticeBox>

        {lastReportPostId ? (
          <NoticeBox tone="success" title="รับรายงานตัวอย่างแล้ว">
            รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้
          </NoticeBox>
        ) : null}

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">กติกาชุมชนแบบย่อ</h2>
                <Badge tone="gold">local moderation</Badge>
              </div>
              <div className="mt-3 grid gap-2">
                {communityRules.slice(0, 3).map((rule) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={rule.id}>
                    <span className="font-bold text-kaset-ink">{rule.title}: </span>
                    {rule.summary}
                  </p>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-3 text-sm font-extrabold text-white"
                  to="/app/community-rules"
                >
                  อ่านกติกา
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-3 text-sm font-extrabold text-kaset-deep"
                  to="/app/moderation-center"
                >
                  ศูนย์รายงาน
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {topics.map((topic, index) => (
              <Badge className={index === 0 ? 'bg-kaset-deep text-white' : ''} key={topic} tone="neutral">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <section className="grid gap-4">
          {communityPosts.map((post) => {
            const hidden = isPostHidden(post.id);
            const hiddenRecord = hiddenPosts.find((record) => record.postId === post.id);

            if (hidden) {
              return (
                <Card className="border-dashed border-slate-300 bg-slate-50 p-4" key={post.id}>
                  <div className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-slate-600">
                      <EyeOff aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="neutral">ซ่อนในเครื่องนี้</Badge>
                        <Badge tone="sky">ตัวอย่างโพสต์</Badge>
                      </div>
                      <h3 className="mt-2 font-extrabold text-kaset-ink">ซ่อนโพสต์จาก {post.author} แล้ว</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        การซ่อนนี้อยู่ในเครื่องเท่านั้น {hiddenRecord ? `· ${hiddenRecord.hiddenAt}` : ''}
                      </p>
                      <Button className="mt-3 min-h-11 px-4 text-sm" onClick={() => unhidePost(post.id)} variant="secondary">
                        <RotateCcw aria-hidden="true" className="h-4 w-4" />
                        แสดงอีกครั้ง
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            }

            return (
              <CommunityPostCard
                key={post.id}
                moderationStatusLabel={getModerationStatusLabel(post.id)}
                onHide={(item) => hidePost(item.id)}
                onReport={openReportSheet}
                post={post}
              />
            );
          })}
        </section>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <Flag aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">สถานะการรายงานในเครื่อง</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {counts.reports} รายงาน · {counts.hiddenPosts} โพสต์ที่ซ่อน · ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-3 text-sm font-extrabold text-kaset-deep"
                  to="/app/moderation-center"
                >
                  เปิดศูนย์รายงาน
                </Link>
                <Button className="min-h-11 px-3 text-sm" onClick={clearLocalModerationDemo} variant="secondary">
                  ล้างเดโม
                </Button>
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

      <div className="sticky bottom-5 z-10 -mt-20 flex justify-end px-5 pb-5">
        <button
          aria-label="สร้างโพสต์"
          className="grid h-14 w-14 place-items-center rounded-full bg-kaset-deep text-white shadow-[0_14px_30px_rgba(15,90,61,0.28)]"
          type="button"
        >
          <Plus aria-hidden="true" className="h-7 w-7" />
        </button>
      </div>

      {reportingPost ? (
        <div className="fixed inset-0 z-40 flex items-end bg-slate-950/40 px-4 pb-4 sm:items-center sm:justify-center">
          <Card className="w-full max-w-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone="gold">รายงานตัวอย่าง</Badge>
                <h2 className="mt-2 text-xl font-extrabold text-kaset-ink">รายงานโพสต์</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น</p>
              </div>
              <button
                aria-label="ปิด"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600"
                onClick={() => setReportingPost(undefined)}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {reportReasons.map((reason) => (
                <button
                  className={
                    selectedReason === reason
                      ? 'min-h-12 rounded-lg bg-kaset-deep px-3 text-left text-sm font-bold text-white'
                      : 'min-h-12 rounded-lg bg-kaset-mist px-3 text-left text-sm font-bold text-kaset-ink'
                  }
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  type="button"
                >
                  {communityReportReasonLabels[reason]}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm font-extrabold text-kaset-ink" htmlFor="community-report-note">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              className="mt-2 min-h-24 w-full rounded-lg border border-kaset-deep/10 bg-white p-3 text-sm leading-6 text-kaset-ink outline-none focus:ring-2 focus:ring-kaset-leaf"
              id="community-report-note"
              onChange={(event) => setReportNote(event.target.value)}
              placeholder="เพิ่มรายละเอียดถ้าต้องการ"
              value={reportNote}
            />

            <NoticeBox className="mt-4" tone="warning" title="ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้">
              รายงานจะถูกเก็บใน localStorage เพื่อทดสอบ UX เท่านั้น ไม่มีการส่งข้อมูลออกจากเครื่อง
            </NoticeBox>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => setReportingPost(undefined)} variant="secondary">
                ยกเลิก
              </Button>
              <Button onClick={submitReport}>
                <Flag aria-hidden="true" className="h-4 w-4" />
                ส่งรายงาน
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
