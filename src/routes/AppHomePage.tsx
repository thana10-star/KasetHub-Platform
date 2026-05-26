import { ArticleCard } from '@/components/kaset/ArticleCard';
import { CommunityPostCard } from '@/components/kaset/CommunityPostCard';
import { HeroCard } from '@/components/kaset/HeroCard';
import { QuickActionGrid } from '@/components/kaset/QuickActionGrid';
import { VideoCard } from '@/components/kaset/VideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { articles, communityPosts, videos } from '@/data/mockData';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { buildHomeFarmHubViewModel } from '@/routes/home-farm-hub-model';
import { AI_HOME_PROMPT_EXAMPLES } from '@/services/ai/ai-farmer-assistant-copy';
import { Bell, Bot, CloudSun, HelpCircle, Sprout, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppHomePage() {
  const featuredVideo = videos.find((video) => video.isFeatured) ?? videos[0];
  const notificationCenter = useNotificationCenter();
  const farmHub = buildHomeFarmHubViewModel();

  return (
    <div>
      <PageHeader title="หน้าแรก" subtitle="ความรู้และเครื่องมือเกษตรไทย" />
      <div className="grid gap-5 px-5 pb-6">
        <HeroCard />

        <section aria-labelledby="home-ai-title" data-testid="home-ai-primary-entry">
          <Card className="overflow-hidden bg-kaset-deep text-white">
            <div className="p-4">
              <div className="flex gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                  <Bot aria-hidden="true" className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id="home-ai-title" className="text-xl font-extrabold leading-7">
                    ถาม AI เกษตร
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-emerald-50/90">
                    ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์ม
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {AI_HOME_PROMPT_EXAMPLES.map((example) => (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white" key={example}>
                        {example}
                      </span>
                    ))}
                  </div>
                  <Link
                    className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-white px-4 text-base font-extrabold leading-6 text-kaset-deep transition hover:bg-kaset-mint"
                    to="/app/ai"
                  >
                    ถาม AI ตอนนี้
                  </Link>
                  <p className="mt-2 text-xs font-semibold leading-5 text-emerald-50/80">
                    ใช้เป็นข้อมูลเบื้องต้น ควรตรวจสอบกับผู้เชี่ยวชาญก่อนลงมือจริง
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-3 sm:grid-cols-2" aria-label="ทางลัดสำคัญ">
          <Link to="/app/weather">
            <Card className="h-full p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                  <CloudSun aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold leading-6 text-kaset-ink">สภาพอากาศเกษตร</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">เช็กฝน ลม และความเสี่ยงก่อนวางแผนงานในไร่</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/app/prices">
            <Card className="h-full p-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800">
                  <Tags aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold leading-6 text-kaset-ink">ราคาเกษตร</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">ดูรายการสินค้าที่เตรียมเชื่อมแหล่งข้อมูลราคา</p>
                </div>
              </div>
            </Card>
          </Link>
        </section>

        <section aria-labelledby="home-farm-hub-title">
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                <Sprout aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-kaset-deep">{farmHub.eyebrow}</p>
                <h2 id="home-farm-hub-title" className="mt-1 text-xl font-extrabold leading-7 text-kaset-ink">
                  {farmHub.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{farmHub.subtitle}</p>
                <Link
                  className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-kaset-deep px-4 text-base font-extrabold leading-6 text-white transition hover:bg-kaset-ink"
                  to={farmHub.primaryRoute}
                >
                  {farmHub.primaryLabel}
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <NoticeBox tone="success" title="ใช้งานได้ทันที ไม่ต้องสมัคร">
          บันทึกบทความ วิดีโอ คำถาม AI และประวัติฟาร์มไว้ในเครื่องนี้ได้ก่อน สมัครภายหลังเมื่ออยากสำรองข้อมูล
        </NoticeBox>

        <Link to="/app/help">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <HelpCircle aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold leading-6 text-kaset-ink">เริ่มใช้แอพ</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">ดูวิธีเริ่มจากฟาร์มของฉันและสมุดฟาร์ม</p>
              </div>
            </div>
          </Card>
        </Link>

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
                  รวมอากาศ ราคา ฟาร์มของฉัน และชุมชนไว้ให้ติดตามในแอพ
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
          <SectionHeader actionHref="/app/articles" actionLabel="อ่านต่อ" title="บทความและข่าว" />
          <ArticleCard article={articles[0]} />
        </section>
      </div>
    </div>
  );
}
