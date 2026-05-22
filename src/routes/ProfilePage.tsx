import {
  Bookmark,
  BookOpenCheck,
  Bot,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileLock2,
  FileText,
  History,
  Leaf,
  Link2,
  LogOut,
  Server,
  ShieldCheck,
  Settings,
  CloudUpload,
  Sprout,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { demoUser, profileStats } from '@/data/mockData';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { getAccountStatus } from '@/services/account/account-status-service';
import type { AppRoute } from '@/types/kaset';

const menuItems: Array<{ label: string; icon: typeof Clock3; href?: AppRoute }> = [
  { label: 'เครดิตและประวัติ AI', icon: Bot, href: '/app/ai-credits' },
  { label: 'สถานะ AI Proxy', icon: Server, href: '/app/ai-proxy-status' },
  { label: 'ประวัติการใช้ AI', icon: Clock3, href: '/app/ai-credits' },
  { label: 'ประวัติพืชของฉัน', icon: Leaf, href: '/app/my-farm' },
  { label: 'ประวัติวิเคราะห์ภาพ', icon: History, href: '/app/analysis-history' },
  { label: 'ความเป็นส่วนตัวของรูปภาพ', icon: FileLock2, href: '/app/image-privacy' },
  { label: 'สมัคร/สำรองข้อมูล', icon: ShieldCheck, href: '/app/auth' },
  { label: 'สถานะบัญชีทดสอบ', icon: ShieldCheck, href: '/app/auth/status' },
  { label: 'กติกาเชื่อมบัญชี Phone + LINE', icon: Link2, href: '/app/auth/linking' },
  { label: 'ตรวจความพร้อม UX', icon: ClipboardCheck, href: '/app/qa' },
  { label: 'ตัวอย่างผู้ดูแลเนื้อหา', icon: FileText, href: '/app/content-admin-preview' },
  { label: 'สถานะ Guest Sync', icon: CloudUpload, href: '/app/guest-sync-status' },
  { label: 'สำรองข้อมูลในอนาคต', icon: UserRound, href: '/app/account-preview' },
  { label: 'ข้อมูลที่บันทึกไว้ในเครื่องนี้', icon: Sprout, href: '/app/memory' },
  { label: 'บทความที่บันทึกไว้', icon: BookOpenCheck, href: '/app/saved-articles' },
  { label: 'วิดีโอที่บันทึกไว้', icon: Bookmark, href: '/app/saved-videos' },
  { label: 'โพสต์ของฉัน', icon: FileText },
  { label: 'ตั้งค่าบัญชี', icon: Settings },
];

export function ProfilePage() {
  const { savedCount } = useSavedArticles();
  const { savedCount: savedVideoCount } = useSavedVideos();
  const { counts, state } = useGuestMemory();
  const accountStatus = getAccountStatus(state);

  return (
    <div>
      <PageHeader title="โปรไฟล์" subtitle="บัญชีผู้ใช้ตัวอย่าง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden">
          <div className="bg-kaset-deep px-5 pb-14 pt-5 text-white">
            <Badge className="bg-white/15 text-white" tone="green">
              {demoUser.badge}
            </Badge>
          </div>
          <div className="-mt-10 px-5 pb-5">
            <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-kaset-mint text-kaset-deep shadow-soft">
              <UserRound aria-hidden="true" className="h-9 w-9" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-kaset-ink">{demoUser.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {demoUser.province} · {demoUser.plan}
            </p>
            <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700">
              สนใจ: {demoUser.cropFocus}
            </p>
          </div>
        </Card>

        <NoticeBox tone="success" title="โปรไฟล์ตัวอย่างแบบไม่บังคับสมัคร">
          ใช้งานฟีเจอร์หลักได้ก่อน ข้อมูลที่บันทึกไว้จะอยู่ในเครื่องนี้จนกว่าจะมีระบบสำรองข้อมูลจริง
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">สถานะบัญชี</h2>
                <StatusPill tone={accountStatus.phoneMockSession ? 'success' : 'warning'}>
                  {accountStatus.phoneMockSession ? 'phone mock' : 'guest'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{accountStatus.description}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                LINE: {accountStatus.lineMockSession ? accountStatus.lineMockSession.displayName : 'ยังไม่เชื่อมจำลอง'} ·{' '}
                {accountStatus.linkingPlan.label}
              </p>
              <Link to="/app/auth/status">
                <span className="mt-3 inline-flex text-sm font-bold text-kaset-deep">ดูสถานะบัญชีทดสอบ</span>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Bookmark aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">วิดีโอที่บันทึกไว้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {savedVideoCount} รายการ · เก็บวิดีโอจาก YouTube Hub เพื่อกลับมาดูภายหลัง
              </p>
            </div>
          </div>
          <Link to="/app/saved-videos">
            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
              เปิดวิดีโอที่บันทึกไว้
            </span>
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">สมัคร/สำรองข้อมูล</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ใช้งานต่อได้เลย ไม่ต้องสมัคร · สมัครภายหลังเพื่อสำรองข้อมูลที่บันทึกไว้
              </p>
            </div>
          </div>
          <Link to="/app/auth">
            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
              เปิดตัวอย่างการสมัคร
            </span>
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Sprout aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">ข้อมูลที่บันทึกไว้ในเครื่องนี้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ข้อมูลนี้อยู่ในเครื่องนี้เท่านั้น · ใช้งานได้ทันที ไม่ต้องสมัคร
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-kaset-mist p-2 text-center">
              <p className="font-extrabold text-kaset-deep">{counts.savedArticles}</p>
              <p className="text-[10px] font-semibold text-slate-500">บทความ</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-2 text-center">
              <p className="font-extrabold text-kaset-deep">{counts.savedVideos}</p>
              <p className="text-[10px] font-semibold text-slate-500">วิดีโอ</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-2 text-center">
              <p className="font-extrabold text-kaset-deep">{counts.likedPosts}</p>
              <p className="text-[10px] font-semibold text-slate-500">ไลก์</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-2 text-center">
              <p className="font-extrabold text-kaset-deep">{counts.followedTopics}</p>
              <p className="text-[10px] font-semibold text-slate-500">ติดตาม</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-2 text-center">
              <p className="font-extrabold text-kaset-deep">{counts.farmRecords}</p>
              <p className="text-[10px] font-semibold text-slate-500">ฟาร์ม</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-2 text-center">
              <p className="font-extrabold text-kaset-deep">{counts.recentAIQuestions}</p>
              <p className="text-[10px] font-semibold text-slate-500">AI</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            สำรองข้อมูลด้วยเบอร์โทรในอนาคต · สมัครด้วยเบอร์โทรหรือ LINE ในอนาคตเพื่อสำรองและย้ายข้อมูลไปเครื่องอื่น
          </p>
          <Link to="/app/memory">
            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
              เปิดหน่วยความจำ
            </span>
          </Link>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {profileStats.map((stat) => (
            <Card className="p-3 text-center" key={stat.label}>
              <p className="text-xl font-extrabold text-kaset-deep">{stat.value}</p>
              <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-kaset-deep p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
              <BookOpenCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold">บทความที่บันทึกไว้</h2>
              <p className="mt-1 text-sm leading-6 text-emerald-50/90">
                {savedCount} รายการ · บันทึกไว้สำหรับอ่านภายหลัง / เตรียมรองรับโหมดออฟไลน์
              </p>
            </div>
          </div>
          <Link to="/app/saved-articles">
            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-kaset-deep transition hover:bg-kaset-mint">
              เปิดบทความที่บันทึกไว้
            </span>
          </Link>
        </Card>

        <Card className="overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="flex-1 text-[15px] font-bold leading-6 text-kaset-ink">{item.label}</span>
                <ChevronRight aria-hidden="true" className="h-5 w-5 text-slate-400" />
              </>
            );

            if (item.href) {
              return (
                <Link
                  className="flex min-h-[64px] w-full items-center gap-3 border-b border-kaset-deep/8 px-4 py-4 text-left last:border-b-0"
                  key={item.label}
                  to={item.href}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                className="flex min-h-[64px] w-full items-center gap-3 border-b border-kaset-deep/8 px-4 py-4 text-left last:border-b-0"
                key={item.label}
                type="button"
              >
                {content}
              </button>
            );
          })}
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Sprout aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">KasetHub M02</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                โปรไฟล์นี้เป็นข้อมูลตัวอย่างสำหรับทดสอบ retention, sharing และ saved content ก่อนเชื่อมต่อระบบสมาชิกจริง
              </p>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="secondary">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            ออกจากระบบตัวอย่าง
          </Button>
        </Card>
      </div>
    </div>
  );
}
