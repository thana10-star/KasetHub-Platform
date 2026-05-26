import {
  Bell,
  Camera,
  Copy,
  EyeOff,
  Flag,
  Heart,
  Link as LinkIcon,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  communityReadOnlyGateMessage,
  getCommunityReadiness,
} from '@/services/community/community-service';
import { communityImagePolicy, communityStorageGateMessage } from '@/services/community/community-storage-service';
import {
  communityPostCategories,
  communityReportReasonLabels,
  communityReportReasons,
  type CommunityPostCategory,
} from '@/services/community/community.types';

const safetyNotes = [
  'อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ',
  'ข้อมูลจากชุมชนควรตรวจสอบก่อนนำไปใช้จริง',
  'เรื่องสารเคมีควรตรวจฉลากและคำแนะนำเจ้าหน้าที่ก่อนใช้',
];

function getCommunityShareUrl() {
  if (typeof window === 'undefined') {
    return '/app/community';
  }

  return new URL('/app/community', window.location.origin).toString();
}

export function CommunityPage() {
  const readiness = useMemo(() => getCommunityReadiness(), []);
  const [selectedCategory, setSelectedCategory] = useState<CommunityPostCategory>('ปัญหาพืช');
  const [activeFilter, setActiveFilter] = useState<CommunityPostCategory | 'ทั้งหมด'>('ทั้งหมด');
  const [shareStatus, setShareStatus] = useState<string>('');

  const shareText = 'ชุมชนเกษตร KasetHub: อ่าน แบ่งปัน และถามปัญหาเกษตรกับคนทำเกษตร';
  const shareUrl = getCommunityShareUrl();
  const encodedShareText = encodeURIComponent(`${shareText} ${shareUrl}`);
  const encodedShareUrl = encodeURIComponent(shareUrl);

  async function handleShare() {
    const payload = {
      title: 'ชุมชนเกษตร',
      text: shareText,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(payload);
        setShareStatus('เปิดหน้าต่างแชร์แล้ว');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('คัดลอกลิงก์แล้ว');
        return;
      }

      setShareStatus('คัดลอกลิงก์จากช่องที่แสดงได้');
    } catch {
      setShareStatus('ยังแชร์ไม่ได้ในอุปกรณ์นี้');
    }
  }

  return (
    <div>
      <PageHeader
        title="ชุมชนเกษตร"
        subtitle="อ่าน แบ่งปัน และถามปัญหาเกษตรกับคนทำเกษตร"
        showBack
      />

      <div className="grid gap-5 px-5 pb-24">
        <NoticeBox tone="info" title="ชุมชนพร้อมเชื่อมต่อฐานข้อมูลแล้ว เหลือทดสอบบัญชีและสิทธิ์ก่อนเปิดโพสต์จริง">
          {communityReadOnlyGateMessage} ระบบเขียนโพสต์ยังปิดด้วย feature flag จนกว่าการทดสอบสองบัญชี, RLS, storage และ backend notification จะผ่านครบ
        </NoticeBox>

        <Card className="p-4" aria-labelledby="community-composer-title">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <UsersRound aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="community-composer-title" className="text-lg font-extrabold leading-7 text-kaset-ink">
                  เขียนโพสต์
                </h2>
                <Badge tone="gold">อ่านและแชร์ได้ก่อน</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เล่าเรื่องฟาร์ม ถามปัญหาพืช หรือแชร์ประสบการณ์
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                {readiness.writeGateMessage}
              </p>
            </div>
          </div>

          <label className="mt-4 block text-sm font-extrabold text-kaset-ink" htmlFor="community-post-text">
            ข้อความโพสต์
          </label>
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-kaset-deep/10 bg-slate-50 p-3 text-sm leading-6 text-slate-600 outline-none"
            disabled
            id="community-post-text"
            placeholder={readiness.writeGateMessage}
          />

          <div className="mt-4">
            <p className="text-sm font-extrabold text-kaset-ink">หมวดหมู่</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {communityPostCategories.map((category) => (
                <button
                  className={
                    selectedCategory === category
                      ? 'min-h-10 rounded-full bg-kaset-deep px-3 text-sm font-extrabold text-white'
                      : 'min-h-10 rounded-full bg-white px-3 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
                  }
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button className="justify-center" disabled variant="secondary">
              <Camera aria-hidden="true" className="h-4 w-4" />
              {communityStorageGateMessage}
            </Button>
            <Button disabled>
              <Send aria-hidden="true" className="h-4 w-4" />
              เปิดเขียนหลังตรวจความปลอดภัย
            </Button>
          </div>

          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-950">
            อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ
          </p>
        </Card>

        <section aria-labelledby="community-feed-title" className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="community-feed-title" className="text-lg font-extrabold text-kaset-ink">
                โพสต์ล่าสุด
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">ไม่มีโพสต์จริงให้แสดงจนกว่า backend ชุมชนจะเปิดใช้งาน</p>
            </div>
            <Badge tone="neutral">ไม่ใช้โพสต์ปลอม</Badge>
          </div>

          <div className="-mx-5 overflow-x-auto px-5">
            <div className="flex min-w-max gap-2">
              {(['ทั้งหมด', ...communityPostCategories] as const).map((category) => (
                <button
                  className={
                    activeFilter === category
                      ? 'min-h-10 rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white'
                      : 'min-h-10 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10'
                  }
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <Card className="border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white text-kaset-deep shadow-soft">
              <MessageCircle aria-hidden="true" className="h-7 w-7" />
            </span>
            <h3 className="mt-3 text-lg font-extrabold text-kaset-ink">ยังไม่มีโพสต์ชุมชนจริง</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              เมื่อระบบบัญชีและ RLS พร้อม หน้านี้จะแสดงเฉพาะโพสต์ published จากฐานข้อมูลจริง ไม่ใช้ชื่อคน ไลก์ หรือคอมเมนต์ปลอม
            </p>
          </Card>
        </section>

        <Card className="p-4" aria-labelledby="community-actions-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Heart aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-actions-title" className="font-extrabold text-kaset-ink">
                การโต้ตอบที่เตรียมไว้สำหรับโพสต์จริง
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Like, คอมเมนต์, report, ซ่อน/ลบโพสต์ของตัวเอง และแจ้งเตือนในแอปจะเปิดเมื่อ owner/auth พร้อม
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Button disabled variant="secondary">
                  <Heart aria-hidden="true" className="h-4 w-4" />
                  Like
                </Button>
                <Button disabled variant="secondary">
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  ตอบกลับ
                </Button>
                <Button disabled variant="secondary">
                  <Flag aria-hidden="true" className="h-4 w-4" />
                  Report
                </Button>
                <Button disabled variant="secondary">
                  <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                  เพิ่มเติม
                </Button>
                <Button disabled variant="secondary">
                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ซ่อนโพสต์
                </Button>
                <Button disabled variant="secondary">
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  ลบโพสต์
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="community-share-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <Share2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-share-title" className="font-extrabold text-kaset-ink">
                แชร์ชุมชน
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ตอนนี้ยังไม่มี URL รายโพสต์ จึงแชร์ไปที่หน้า /app/community พร้อมข้อความสั้น
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <Button onClick={handleShare}>
                  <Share2 aria-hidden="true" className="h-4 w-4" />
                  แชร์
                </Button>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  href={`https://social-plugins.line.me/lineit/share?url=${encodedShareUrl}&text=${encodedShareText}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkIcon aria-hidden="true" className="h-4 w-4" />
                  LINE
                </a>
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/12"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Share2 aria-hidden="true" className="h-4 w-4" />
                  Facebook
                </a>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-kaset-mist p-3 text-xs font-semibold leading-5 text-kaset-ink">
                <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="break-all">{shareStatus || shareUrl}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="community-report-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-800">
              <Flag aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-report-title" className="font-extrabold text-kaset-ink">
                รายงานโพสต์หรือคอมเมนต์
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เหตุผลรายงานพร้อมแล้ว แต่การส่งรายงานจริงจะเปิดพร้อมระบบบัญชีและ moderation queue
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {communityReportReasons.map((reason) => (
                  <div className="rounded-lg bg-kaset-mist p-3 text-sm font-bold text-kaset-ink" key={reason}>
                    {communityReportReasonLabels[reason]}
                  </div>
                ))}
              </div>
              <Button className="mt-3 w-full" disabled variant="secondary">
                <Flag aria-hidden="true" className="h-4 w-4" />
                ส่งรายงานหลังระบบพร้อม
              </Button>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                ข้อความยืนยันเมื่อเปิดใช้จริง: “ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบ”
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="community-notifications-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bell aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-notifications-title" className="font-extrabold text-kaset-ink">
                แจ้งเตือนในแอป
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เมื่อเปิด backend จริง เจ้าของโพสต์จะเห็นแจ้งเตือนเมื่อมีคนไลก์หรือตอบกลับ ไม่มี push notification ใน V1
              </p>
              <Link
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-kaset-deep px-4 text-sm font-extrabold text-white"
                to="/app/notifications"
              >
                เปิดศูนย์แจ้งเตือน
              </Link>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="Community safety note">
          <ul className="grid gap-1">
            {safetyNotes.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        </NoticeBox>

        <Card className="p-4" aria-labelledby="community-readiness-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="community-readiness-title" className="font-extrabold text-kaset-ink">
                สิ่งที่ต้องพร้อมก่อนเปิดโพสต์จริง
              </h2>
              <div className="mt-3 grid gap-2">
                {readiness.blockers.map((blocker) => (
                  <div className="rounded-lg bg-slate-50 p-3" key={blocker.code}>
                    <p className="text-sm font-extrabold text-kaset-ink">{blocker.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{blocker.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
                รูปโพสต์ V1 จำกัด 1 รูปต่อโพสต์, JPG/PNG/WebP, ไม่เกิน {communityImagePolicy.maxSizeBytes / 1024 / 1024}MB และเก็บเฉพาะ path/metadata ในฐานข้อมูล
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
