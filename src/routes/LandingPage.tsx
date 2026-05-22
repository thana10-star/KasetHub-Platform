import { ArrowRight, Bell, Bot, LineChart, PlaySquare, ShieldCheck, Sprout, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '@/components/kaset/ArticleCard';
import { HeroCard } from '@/components/kaset/HeroCard';
import { PriceRow } from '@/components/kaset/PriceRow';
import { QuickActionGrid } from '@/components/kaset/QuickActionGrid';
import { VideoCard } from '@/components/kaset/VideoCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { articles, cropPrices, platformHighlights, videos } from '@/data/mockData';

export function LandingPage() {
  const featuredVideo = videos.find((video) => video.isFeatured) ?? videos[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(35,163,107,0.18),_transparent_34%),linear-gradient(180deg,_#f5fbf7,_#ffffff_55%,_#edf8f0)] text-kaset-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link className="inline-flex items-center gap-3" to="/">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-kaset-deep text-white shadow-soft">
            <Sprout aria-hidden="true" className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-lg font-extrabold text-kaset-deep">KasetHub</span>
            <span className="block text-xs font-semibold text-slate-500">Platform M01</span>
          </span>
        </Link>
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-kaset-deep px-4 text-sm font-bold text-white shadow-soft"
          to="/app"
        >
          เปิดพรีวิว
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-4 lg:grid-cols-[1fr_430px] lg:items-start lg:gap-14">
        <section className="pt-8 lg:pt-16">
          <Badge tone="green">ตัวอย่างผลิตภัณฑ์สำหรับเกษตรกรไทย</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-kaset-ink sm:text-5xl">
            KasetHub Platform
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            แพลตฟอร์มความรู้ ชุมชน และผู้ช่วย AI ด้านเกษตร ออกแบบเพื่อเริ่มจากเว็บแอปและขยายสู่มือถือ แอดมิน
            API และระบบนิเวศเกษตรในอนาคต
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button className="pointer-events-none">
              <Bot aria-hidden="true" className="h-4 w-4" />
              AI ผู้ช่วยเกษตร
            </Button>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-kaset-deep shadow-soft ring-1 ring-kaset-deep/10"
              to="/app/youtube"
            >
              <PlaySquare aria-hidden="true" className="h-4 w-4" />
              YouTube Hub
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {platformHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <Card className="p-4" key={item.title}>
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h2 className="text-base font-extrabold text-kaset-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/80 p-4 shadow-soft ring-1 ring-kaset-deep/8">
              <UsersRound aria-hidden="true" className="mb-3 h-5 w-5 text-kaset-leaf" />
              <p className="text-2xl font-extrabold">ชุมชน</p>
              <p className="text-sm text-slate-500">ถาม ตอบ แบ่งปัน</p>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-soft ring-1 ring-kaset-deep/8">
              <LineChart aria-hidden="true" className="mb-3 h-5 w-5 text-kaset-gold" />
              <p className="text-2xl font-extrabold">ราคา</p>
              <p className="text-sm text-slate-500">ข้อมูลตัวอย่าง</p>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-soft ring-1 ring-kaset-deep/8">
              <ShieldCheck aria-hidden="true" className="mb-3 h-5 w-5 text-sky-600" />
              <p className="text-2xl font-extrabold">ปลอด API Key</p>
              <p className="text-sm text-slate-500">พร้อมต่อยอด</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[430px] rounded-[2rem] border border-white/80 bg-kaset-mist p-3 shadow-[0_28px_80px_rgba(15,90,61,0.18)]">
          <div className="max-h-[820px] overflow-hidden rounded-[1.6rem] bg-kaset-mist">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-xs font-bold text-kaset-leaf">KasetHub</p>
                <h2 className="text-xl font-extrabold">พรีวิวหน้าแอป</h2>
              </div>
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-kaset-deep shadow-soft">
                <Bell aria-hidden="true" className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </span>
            </div>
            <div className="grid gap-5 px-4 pb-5">
              <HeroCard />
              <QuickActionGrid />
              <SectionHeader title="วิดีโอแนะนำ" />
              <VideoCard featured video={featuredVideo} />
              <SectionHeader title="ราคาตัวอย่าง" />
              <Card>
                {cropPrices.slice(0, 2).map((price) => (
                  <PriceRow key={price.id} price={price} />
                ))}
              </Card>
              <SectionHeader title="บทความล่าสุด" />
              <ArticleCard article={articles[0]} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
