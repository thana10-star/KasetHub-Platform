import { Plus, Search, UsersRound } from 'lucide-react';
import { CommunityPostCard } from '@/components/kaset/CommunityPostCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { communityPosts } from '@/data/mockData';

const topics = ['ทั้งหมด', 'ข้าว', 'ทุเรียน', 'ดินและปุ๋ย', 'ผักปลอดภัย'];

export function CommunityPage() {
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

        <NoticeBox tone="warning" title="ชุมชนตัวอย่าง">
          โพสต์ในหน้านี้เป็นข้อมูลสาธิต ก่อนใช้งานจริงควรมีระบบรายงานโพสต์และผู้ดูแลชุมชน
        </NoticeBox>

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
          {communityPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </section>
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
    </div>
  );
}
