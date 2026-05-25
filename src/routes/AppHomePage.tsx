import { ArticleCard } from '@/components/kaset/ArticleCard';
import { CommunityPostCard } from '@/components/kaset/CommunityPostCard';
import { HeroCard } from '@/components/kaset/HeroCard';
import { PriceRow } from '@/components/kaset/PriceRow';
import { QuickActionGrid } from '@/components/kaset/QuickActionGrid';
import { VideoCard } from '@/components/kaset/VideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { articles, communityPosts, cropPrices, videos } from '@/data/mockData';
import { useFarmRecords } from '@/hooks/useFarmRecords';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { Bell, ClipboardList, CloudSun, Sprout, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildHomeFarmHubViewModel, type HomeFarmHubQuickAction } from '@/routes/home-farm-hub-model';

const farmHubQuickActionIcons: Record<HomeFarmHubQuickAction['id'], typeof Sprout> = {
  'my-farm': Sprout,
  'farm-work': ClipboardList,
  'farm-money': Wallet,
  weather: CloudSun,
};

export function AppHomePage() {
  const featuredVideo = videos.find((video) => video.isFeatured) ?? videos[0];
  const notificationCenter = useNotificationCenter();
  const farmRecords = useFarmRecords();
  const farmHub = buildHomeFarmHubViewModel(farmRecords.state);

  return (
    <div>
      <PageHeader title="หน้าแรก" subtitle="ความรู้และเครื่องมือเกษตรไทย" />
      <div className="grid gap-5 px-5 pb-6">
        <HeroCard />

        <section aria-labelledby="home-farm-hub-title" className="grid gap-3">
          <Card className="overflow-hidden border-kaset-deep/10">
            <div className="bg-kaset-deep px-5 py-5 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                  <Sprout aria-hidden="true" className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-kaset-mint">Home Farm Hub</p>
                  <h2 id="home-farm-hub-title" className="text-2xl font-extrabold leading-tight">
                    ฟาร์มของฉัน
                  </h2>
                  <p className="mt-1 text-base leading-7 text-emerald-50">
                    บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน กำไร และผลผลิต
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  className="inline-flex min-h-[56px] items-center justify-center rounded-lg bg-white px-4 py-3 text-center text-base font-extrabold leading-6 text-kaset-deep transition hover:bg-kaset-mint"
                  to={farmHub.primaryRoute}
                >
                  เปิดฟาร์มของฉัน
                </Link>
                <Link
                  className="inline-flex min-h-[56px] items-center justify-center rounded-lg bg-kaset-mint px-4 py-3 text-center text-base font-extrabold leading-6 text-kaset-deep transition hover:bg-white"
                  to={farmHub.recordsRoute}
                >
                  เปิดสมุดฟาร์ม
                </Link>
              </div>
            </div>

            <div className="grid gap-4 p-4">
              {farmHub.hasFarmData ? (
                <div className="grid grid-cols-2 gap-2">
                  {farmHub.facts.map((fact) => (
                    <div className="rounded-lg bg-kaset-mist p-3" key={fact.id}>
                      <p className="text-xs font-bold leading-5 text-slate-500">{fact.label}</p>
                      <p className="mt-1 break-words text-lg font-extrabold leading-6 text-kaset-deep">{fact.value}</p>
                      {fact.helper ? <p className="mt-1 text-xs leading-5 text-slate-600">{fact.helper}</p> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-kaset-mist p-4 text-base font-bold leading-7 text-kaset-ink">
                  {farmHub.emptyStateCopy}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                {farmHub.quickActions.map((action) => {
                  const Icon = farmHubQuickActionIcons[action.id];

                  return (
                    <Link
                      className="flex min-h-[72px] items-center gap-3 rounded-lg border border-kaset-deep/10 bg-white px-3 py-3 text-left transition hover:bg-kaset-mint/70"
                      key={action.id}
                      to={action.route}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-extrabold leading-5 text-kaset-ink">{action.label}</span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{action.helper}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <p className="rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-600 ring-1 ring-kaset-deep/10">
                ข้อมูลสรุปนี้อ่านจากข้อมูลในเครื่องนี้เท่านั้น ยังไม่มีการซิงก์ขึ้นคลาวด์
              </p>
            </div>
          </Card>
        </section>

        <NoticeBox tone="success" title="ใช้งานได้ทันที ไม่ต้องสมัคร">
          บันทึกบทความ วิดีโอ คำถาม AI และประวัติฟาร์มไว้ในเครื่องนี้ได้ก่อน สมัครภายหลังเมื่ออยากสำรองข้อมูล
        </NoticeBox>

        <Link to="/app/notifications">
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <Bell aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-kaset-ink">ศูนย์แจ้งเตือน</h2>
                  <Badge tone={notificationCenter.digest.unreadCount > 0 ? 'gold' : 'green'}>
                    {notificationCenter.digest.unreadCount} ยังไม่อ่าน
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  รวมอากาศ ราคา My Farm ชุมชน และระบบแบบ local/mock ยังไม่มี push จริง
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <section className="grid gap-3">
          <SectionHeader title="ทางลัด" />
          <QuickActionGrid />
        </section>

        <section className="grid gap-3">
          <SectionHeader actionHref="/app/youtube" actionLabel="ดูทั้งหมด" title="แนะนำสำหรับคุณ" />
          <VideoCard featured video={featuredVideo} />
        </section>

        <section className="grid gap-3">
          <SectionHeader actionHref="/app/community" actionLabel="เปิดชุมชน" title="คำถามล่าสุดในชุมชน" />
          <CommunityPostCard compact post={communityPosts[0]} />
        </section>

        <section className="grid gap-3">
          <SectionHeader actionHref="/app/prices" actionLabel="ดูราคา" title="ราคาพืชผลตัวอย่าง" />
          <Card>
            {cropPrices.slice(0, 3).map((price) => (
              <PriceRow key={price.id} price={price} />
            ))}
          </Card>
        </section>

        <section className="grid gap-3">
          <SectionHeader actionHref="/app/articles" actionLabel="อ่านต่อ" title="บทความและข่าว" />
          <ArticleCard article={articles[0]} />
        </section>
      </div>
    </div>
  );
}
