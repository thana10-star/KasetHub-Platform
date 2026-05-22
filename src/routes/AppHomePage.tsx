import { ArticleCard } from '@/components/kaset/ArticleCard';
import { CommunityPostCard } from '@/components/kaset/CommunityPostCard';
import { HeroCard } from '@/components/kaset/HeroCard';
import { PriceRow } from '@/components/kaset/PriceRow';
import { QuickActionGrid } from '@/components/kaset/QuickActionGrid';
import { VideoCard } from '@/components/kaset/VideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { articles, communityPosts, cropPrices, videos } from '@/data/mockData';

export function AppHomePage() {
  const featuredVideo = videos.find((video) => video.isFeatured) ?? videos[0];

  return (
    <div>
      <PageHeader title="หน้าแรก" subtitle="ความรู้และเครื่องมือเกษตรไทย" />
      <div className="grid gap-5 px-5 pb-6">
        <HeroCard />

        <NoticeBox tone="success" title="ใช้งานได้ทันที ไม่ต้องสมัคร">
          บันทึกบทความ วิดีโอ คำถาม AI และประวัติฟาร์มไว้ในเครื่องนี้ได้ก่อน สมัครภายหลังเมื่ออยากสำรองข้อมูล
        </NoticeBox>

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
