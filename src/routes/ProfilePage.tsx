import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpenCheck,
  Bot,
  Calculator,
  ChevronRight,
  ClipboardCheck,
  CloudOff,
  CloudSun,
  CloudUpload,
  DatabaseBackup,
  FileLock2,
  FileText,
  GitBranch,
  HelpCircle,
  History,
  Languages,
  LifeBuoy,
  Link2,
  LogIn,
  LockKeyhole,
  LogOut,
  Ruler,
  Server,
  ShieldCheck,
  Settings,
  Sprout,
  UserRound,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { demoUser } from '@/data/mockData';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { getAccountStatus } from '@/services/account/account-status-service';
import { getCommunityAuthorDisplayName } from '@/services/community/community-author-display';
import {
  getCachedSupabaseAuthSessionSnapshot,
  getCurrentSupabaseAuthSession,
  signOutSupabaseAuth,
  subscribeToSupabaseAuthSession,
  type SupabaseAuthSessionSnapshot,
} from '@/services/auth/supabase-auth-session';
import type { AppRoute } from '@/types/kaset';

type ProfileMenuHref = AppRoute | `${AppRoute}#${string}`;
type ProfileMenuTone = 'primary' | 'privacy' | 'help' | 'advanced';
type ProfileStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type ProfileMenuItem = {
  label: string;
  description: string;
  icon: LucideIcon;
  href?: ProfileMenuHref;
  status?: string;
  statusTone?: ProfileStatusTone;
};

type ProfileMenuGroup = {
  title: string;
  subtitle: string;
  tone: ProfileMenuTone;
  items: ProfileMenuItem[];
};

const profileMenuGroups: ProfileMenuGroup[] = [
  {
    title: 'บัญชีของฉัน',
    subtitle: 'เรื่องบัญชี ภาษา และสิ่งที่บันทึกไว้',
    tone: 'primary',
    items: [
      {
        label: 'สถานะบัญชี',
        description: 'ดูสถานะการใช้งานบนเครื่องนี้',
        icon: ShieldCheck,
        href: '/app/auth/status',
      },
      {
        label: 'สมัครหรือสำรองข้อมูลภายหลัง',
        description: 'บัญชีและการสำรองข้อมูลจะเพิ่มในเวอร์ชันถัดไป',
        icon: UserRound,
        href: '/app/auth',
        status: 'เร็ว ๆ นี้',
        statusTone: 'neutral',
      },
      {
        label: 'ภาษา',
        description: 'เลือกภาษาไทยหรืออังกฤษในอนาคต',
        icon: Languages,
        status: 'เร็ว ๆ นี้',
        statusTone: 'info',
      },
      {
        label: 'วิดีโอที่บันทึกไว้',
        description: 'กลับไปดูวิดีโอเกษตรที่เก็บไว้',
        icon: BookOpenCheck,
        href: '/app/saved-videos',
      },
      {
        label: 'บทความที่บันทึกไว้',
        description: 'เปิดบทความที่เก็บไว้อ่านภายหลัง',
        icon: BookOpenCheck,
        href: '/app/saved-articles',
      },
      {
        label: 'ตั้งค่าการแจ้งเตือน',
        description: 'จัดการรายการแจ้งเตือนที่บันทึกไว้ในเครื่องนี้',
        icon: Bell,
        href: '/app/notification-settings',
      },
    ],
  },
  {
    title: 'ข้อมูลและความเป็นส่วนตัว',
    subtitle: 'ข้อมูลสำคัญของฟาร์มยังอยู่ในเครื่องนี้',
    tone: 'privacy',
    items: [
      {
        label: 'ฟาร์มของฉัน',
        description: 'ดูสมุดฟาร์ม ต้นทุน ผลผลิต และสถานะข้อมูล',
        icon: Sprout,
        href: '/app/my-farm',
      },
      {
        label: 'ตั้งค่าฟาร์มของฉัน',
        description: 'ดูสถานะข้อมูลในเครื่องและแผนสำรองในอนาคต',
        icon: Settings,
        href: '/app/my-farm/settings',
      },
      {
        label: 'ข้อมูลและความเป็นส่วนตัว',
        description: 'สำรอง กู้คืน และตรวจสอบสถานะการซิงก์',
        icon: LockKeyhole,
        href: '/app/farm-records#farm-records-export',
      },
      {
        label: 'กู้คืนข้อมูลฟาร์ม',
        description: 'กู้คืนจากไฟล์สำรองในเครื่องนี้เมื่อพร้อม',
        icon: DatabaseBackup,
        href: '/app/farm-records#farm-records-restore',
      },
      {
        label: 'การซิงก์ข้อมูล',
        description: 'ยังไม่เปิดใช้งาน ข้อมูลยังอยู่ในเครื่องนี้',
        icon: CloudOff,
        href: '/app/farm-records#farm-records-sync',
        status: 'ปิดอยู่',
        statusTone: 'warning',
      },
      {
        label: 'ข้อมูลที่บันทึกไว้ในเครื่องนี้',
        description: 'ดูข้อมูลที่แอพบันทึกไว้ในเครื่องนี้',
        icon: Sprout,
        href: '/app/memory',
      },
      {
        label: 'ความเป็นส่วนตัวของรูปภาพ',
        description: 'ขอบเขตรูปภาพและการวิเคราะห์ภาพ',
        icon: FileLock2,
        href: '/app/image-privacy',
      },
      {
        label: 'สำรองข้อมูลในอนาคต',
        description: 'แผนบัญชีและการสำรองข้อมูลสำหรับเวอร์ชันถัดไป',
        icon: CloudUpload,
        href: '/app/account-preview',
      },
    ],
  },
  {
    title: 'ช่วยเหลือ',
    subtitle: 'คำแนะนำและทางลัดที่ใช้บ่อย',
    tone: 'help',
    items: [
      {
        label: 'วิธีใช้แอพ',
        description: 'คู่มือเริ่มต้นสำหรับเกษตรกร',
        icon: HelpCircle,
        href: '/app/help',
      },
      {
        label: 'ติดต่อทีมงาน',
        description: 'ช่องทางช่วยเหลือจะเพิ่มในเวอร์ชันถัดไป',
        icon: LifeBuoy,
        status: 'เร็ว ๆ นี้',
        statusTone: 'info',
      },
      {
        label: 'เครื่องคำนวณเกษตร',
        description: 'ปุ๋ย ระยะปลูก ต้นทุน และผลผลิต',
        icon: Calculator,
        href: '/app/calculators',
      },
      {
        label: 'สภาพอากาศเกษตร',
        description: 'ดูอากาศและคำเตือนจากพื้นที่โดยประมาณ',
        icon: CloudSun,
        href: '/app/weather',
      },
      {
        label: 'คำนวณพื้นที่แปลง',
        description: 'แปลงไร่ งาน ตารางวา',
        icon: Ruler,
        href: '/app/farm-area',
      },
      {
        label: 'คลังความรู้เกษตรออฟไลน์',
        description: 'อ่านบทความที่เตรียมไว้ในแอป',
        icon: BookOpenCheck,
        href: '/app/articles/offline',
      },
      {
        label: 'ชุมชนเกษตร',
        description: 'อ่านเรื่องเล่า ถามปัญหา และแบ่งปันประสบการณ์',
        icon: UsersRound,
        href: '/app/community',
      },
      {
        label: 'กติกาชุมชน',
        description: 'อ่านกติกาก่อนถามตอบในชุมชน',
        icon: ShieldCheck,
        href: '/app/community-rules',
      },
    ],
  },
  {
    title: 'สำหรับทีมงานหรือทดสอบ',
    subtitle: 'เครื่องมือภายใน สถานะความพร้อม และหน้าทดสอบ',
    tone: 'advanced',
    items: [
      {
        label: 'Admin',
        description: 'ภาพรวมผู้ดูแลแบบ local/mock',
        icon: ShieldCheck,
        href: '/app/admin',
      },
      {
        label: 'ตรวจสอบระบบ',
        description: 'QA และ route review สำหรับทีมงาน',
        icon: ClipboardCheck,
        href: '/app/qa',
      },
      {
        label: 'บันทึกทดสอบผู้ใช้',
        description: 'เช็กลิสต์ภาคสนามแบบ static/local ไม่มีการส่งข้อมูล',
        icon: ClipboardCheck,
        href: '/app/field-test-feedback',
      },
      {
        label: 'ภาพรวม MVP ภายใน',
        description: 'ภาพรวม route coverage และสถานะความพร้อม',
        icon: ClipboardCheck,
        href: '/app/mvp-snapshot',
      },
      {
        label: 'แผนขั้นต่อไป',
        description: 'แผนขั้นต่อไปแบบไม่เปิด backend จริง',
        icon: GitBranch,
        href: '/app/next-phase',
      },
      {
        label: 'สถานะความพร้อม Supabase staging',
        description: 'เช็กลิสต์ staging เท่านั้น ยังไม่เชื่อม production',
        icon: Server,
        href: '/app/supabase-readiness',
      },
      {
        label: 'คู่มือ Supabase staging',
        description: 'คู่มือ setup แบบ manual review',
        icon: ClipboardCheck,
        href: '/app/supabase-setup-guide',
      },
      {
        label: 'เช็กลิสต์ Phone OTP staging',
        description: 'แผนทดสอบ phone auth ยังไม่ส่ง OTP จริง',
        icon: ShieldCheck,
        href: '/app/auth/phone-staging',
      },
      {
        label: 'สถานะ AI Proxy',
        description: 'ขอบเขต backend/AI proxy แบบ disabled by default',
        icon: Bot,
        href: '/app/ai-proxy-status',
      },
      {
        label: 'เครดิตและประวัติ AI',
        description: 'เครดิต local และประวัติการใช้ AI ตัวอย่าง',
        icon: History,
        href: '/app/ai-credits',
      },
      {
        label: 'ทดสอบระบบรูปภาพก่อนวิเคราะห์',
        description: 'image preflight readiness แบบ local',
        icon: FileLock2,
        href: '/app/image-preflight',
      },
      {
        label: 'ศูนย์รายงานชุมชน',
        description: 'moderation center แบบ local/mock',
        icon: ClipboardCheck,
        href: '/app/moderation-center',
      },
      {
        label: 'ตัวอย่างผู้ดูแลเนื้อหา',
        description: 'content admin preview สำหรับทีมงาน',
        icon: FileText,
        href: '/app/content-admin-preview',
      },
      {
        label: 'สถานะความพร้อม Guest Sync',
        description: 'สถานะและ Edge Function plan แบบไม่ sync จริง',
        icon: CloudUpload,
        href: '/app/guest-sync-status',
      },
      {
        label: 'แผน Guest Sync Edge Function',
        description: 'contract review ไม่มีการเรียก backend',
        icon: CloudUpload,
        href: '/app/guest-sync-edge',
      },
      {
        label: 'กติกาเชื่อมบัญชี Phone + LINE',
        description: 'account linking preview สำหรับ future auth',
        icon: Link2,
        href: '/app/auth/linking',
      },
    ],
  },
];

const groupToneClass: Record<ProfileMenuTone, string> = {
  primary: 'bg-kaset-mint text-kaset-deep',
  privacy: 'bg-emerald-100 text-emerald-800',
  help: 'bg-sky-100 text-sky-800',
  advanced: 'bg-slate-100 text-slate-700',
};

const rowIconToneClass: Record<ProfileMenuTone, string> = {
  primary: 'bg-kaset-mint text-kaset-deep',
  privacy: 'bg-emerald-100 text-emerald-800',
  help: 'bg-sky-100 text-sky-800',
  advanced: 'bg-slate-100 text-slate-600',
};

function ProfileMenuRow({ item, tone }: { item: ProfileMenuItem; tone: ProfileMenuTone }) {
  const Icon = item.icon;
  const rowClassName = cx(
    'flex min-h-[76px] w-full items-center gap-3 border-t border-kaset-deep/8 px-4 py-4 text-left first:border-t-0',
    item.href && 'transition hover:bg-kaset-mint/45',
    tone === 'advanced' && 'min-h-[68px] bg-white/70',
  );
  const content = (
    <>
      <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-lg', rowIconToneClass[tone])}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold leading-6 text-kaset-ink">{item.label}</span>
        <span className="mt-0.5 block text-sm leading-5 text-slate-600">{item.description}</span>
      </span>
      {item.status ? (
        <StatusPill className="shrink-0" tone={item.statusTone ?? 'neutral'}>
          {item.status}
        </StatusPill>
      ) : null}
      {item.href ? <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" /> : null}
    </>
  );

  if (!item.href) {
    return <div className={rowClassName}>{content}</div>;
  }

  return (
    <Link className={rowClassName} to={item.href}>
      {content}
    </Link>
  );
}

function ProfileMenuGroupCard({ group }: { group: ProfileMenuGroup }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg ${groupToneClass[group.tone]}`}>
          {group.tone === 'advanced' ? (
            <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
          ) : group.tone === 'privacy' ? (
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          ) : group.tone === 'help' ? (
            <BookOpenCheck aria-hidden="true" className="h-5 w-5" />
          ) : (
            <UserRound aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">{group.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{group.subtitle}</p>
        </div>
      </div>
      <div>
        {group.items.map((item) => (
          <ProfileMenuRow item={item} key={`${group.title}-${item.label}`} tone={group.tone} />
        ))}
      </div>
    </Card>
  );
}

type ProfilePageProps = {
  authSessionOverride?: SupabaseAuthSessionSnapshot;
};

export function ProfilePage({ authSessionOverride }: ProfilePageProps = {}) {
  const { savedCount } = useSavedArticles();
  const { savedCount: savedVideoCount } = useSavedVideos();
  const { counts, state } = useGuestMemory();
  const notificationCenter = useNotificationCenter();
  const accountStatus = getAccountStatus(state);
  const [authSession, setAuthSession] = useState<SupabaseAuthSessionSnapshot>(
    () => authSessionOverride ?? getCachedSupabaseAuthSessionSnapshot(),
  );
  const [authStatusMessage, setAuthStatusMessage] = useState('');

  const primaryMenuGroups = profileMenuGroups.filter((group) => group.tone !== 'advanced');
  const communityDisplayName = getCommunityAuthorDisplayName({
    currentUserEmail: authSession.email,
    ownedByCurrentUser: authSession.isSignedIn,
  });

  useEffect(() => {
    if (authSessionOverride) {
      setAuthSession(authSessionOverride);
      return undefined;
    }

    let active = true;
    void getCurrentSupabaseAuthSession().then((snapshot) => {
      if (active) setAuthSession(snapshot);
    });
    const unsubscribe = subscribeToSupabaseAuthSession((snapshot) => {
      if (active) setAuthSession(snapshot);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [authSessionOverride]);

  async function handleSignOut() {
    const result = await signOutSupabaseAuth();
    if (result.ok) {
      setAuthSession(result.session);
      setAuthStatusMessage('ออกจากระบบแล้ว');
      return;
    }

    setAuthStatusMessage(result.message);
  }

  return (
    <div>
      <PageHeader title="โปรไฟล์และการตั้งค่า" subtitle="บัญชี ข้อมูลในเครื่อง และความช่วยเหลือ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-kaset-mint text-kaset-deep shadow-soft">
              <UserRound aria-hidden="true" className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <Badge tone="green">{demoUser.badge}</Badge>
              <h2 className="mt-2 text-xl font-extrabold leading-7 text-kaset-ink">{demoUser.name}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {demoUser.province} · {demoUser.plan}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">สนใจ: {demoUser.cropFocus}</p>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="สิ่งที่ควรรู้ตอนนี้">
          <p>ข้อมูลสำคัญของฟาร์มยังอยู่ในเครื่องนี้</p>
          <p>การซิงก์ขึ้นคลาวด์ยังไม่เปิดใช้งาน</p>
          <p>บางการตั้งค่าจะเพิ่มในเวอร์ชันถัดไป</p>
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
                  {accountStatus.phoneMockSession ? 'บัญชีในเครื่อง' : 'ใช้งานได้ทันที'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{accountStatus.description}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                บันทึกไว้ในเครื่องนี้: {counts.farmRecords} ฟาร์ม · {counts.savedArticles} บทความ ·{' '}
                {counts.savedVideos} วิดีโอ · {counts.recentAIQuestions} คำถาม AI
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4" aria-labelledby="profile-community-login-title">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              {authSession.isSignedIn ? (
                <UserCheck aria-hidden="true" className="h-5 w-5" />
              ) : (
                <LogIn aria-hidden="true" className="h-5 w-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="profile-community-login-title" className="font-extrabold text-kaset-ink">
                  {authSession.isSignedIn ? 'เข้าสู่ระบบแล้ว' : 'เข้าสู่ระบบ'}
                </h2>
                <StatusPill tone={authSession.isSignedIn ? 'success' : 'warning'}>
                  {authSession.isSignedIn ? 'พร้อมใช้ชุมชน' : 'ยังไม่ได้เข้าสู่ระบบ'}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {authSession.isSignedIn
                  ? authSession.email ?? 'ใช้บัญชีนี้สำหรับชุมชนและฟีเจอร์ที่ต้องมีบัญชี'
                  : 'ใช้สำหรับชุมชนและฟีเจอร์ที่ต้องมีบัญชี'}
              </p>
              {authSession.isSignedIn ? (
                <div className="mt-3 rounded-lg border border-kaset-deep/10 bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">ชื่อที่แสดงในชุมชน</p>
                  <p className="mt-1 break-words text-sm font-extrabold text-kaset-ink">{communityDisplayName}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    ใช้ชื่อนี้ในชุมชนจนกว่าจะมีการตั้งชื่อโปรไฟล์
                  </p>
                </div>
              ) : null}
              {authSession.isSignedIn ? (
                <Button className="mt-3 w-full" onClick={handleSignOut} variant="secondary">
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  ออกจากระบบ
                </Button>
              ) : (
                <Link
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-kaset-deep px-5 text-[15px] font-bold leading-5 text-white"
                  to="/app/login"
                >
                  <LogIn aria-hidden="true" className="h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              )}
              {authStatusMessage ? (
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{authStatusMessage}</p>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-extrabold text-kaset-ink">ข้อมูลในเครื่องนี้</h2>
            <StatusPill tone="warning">คลาวด์ปิดอยู่</StatusPill>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-kaset-mist p-3 text-center">
              <p className="text-xl font-extrabold text-kaset-deep">{notificationCenter.digest.unreadCount}</p>
              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">ยังไม่อ่าน</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3 text-center">
              <p className="text-xl font-extrabold text-kaset-deep">{savedCount}</p>
              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">บทความ</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3 text-center">
              <p className="text-xl font-extrabold text-kaset-deep">{savedVideoCount}</p>
              <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">วิดีโอ</p>
            </div>
          </div>
        </Card>

        {primaryMenuGroups.map((group) => (
          <ProfileMenuGroupCard group={group} key={group.title} />
        ))}

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
              <CloudOff aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-kaset-ink">สถานะระบบตอนนี้</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ใช้งานได้จากข้อมูลในเครื่องนี้ก่อน การสำรองขึ้นคลาวด์และช่องทางช่วยเหลือจริงยังเป็นแผนสำหรับเวอร์ชันถัดไป
              </p>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="secondary">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            ออกจากระบบ
          </Button>
        </Card>
      </div>
    </div>
  );
}
