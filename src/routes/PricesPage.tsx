import { MapPin, RefreshCw } from 'lucide-react';
import { PriceRow } from '@/components/kaset/PriceRow';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { cropPrices } from '@/data/mockData';
import { useGuestMemory } from '@/hooks/useGuestMemory';

const categories = ['ทั้งหมด', 'ข้าว', 'ผลไม้', 'พืชไร่', 'ผัก'];

export function PricesPage() {
  const { followTopic, isFollowingTopic, unfollowTopic } = useGuestMemory();

  return (
    <div>
      <PageHeader title="ราคาพืชผล" subtitle="ข้อมูลตัวอย่างสำหรับการออกแบบหน้าจอ" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="bg-kaset-deep p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold text-emerald-50">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                ประเทศไทย · ตลาดตัวอย่าง
              </p>
              <h2 className="mt-3 text-2xl font-extrabold">ติดตามราคาพืชผลวันนี้</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">ข้อมูลทั้งหมดเป็น mock data ยังไม่ใช่ราคาตลาดจริง</p>
            </div>
            <Button className="bg-white px-3 text-kaset-deep hover:bg-kaset-mint" variant="primary">
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ราคาเป็นข้อมูลตัวอย่าง">
          ใช้ดูรูปแบบการติดตามราคาเท่านั้น ยังไม่ใช่ราคาตลาดจริง ก่อนขายผลผลิตควรตรวจสอบจากแหล่งราคาที่เชื่อถือได้อีกครั้ง
        </NoticeBox>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex min-w-max gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => {
                  if (category === 'ทั้งหมด') {
                    return;
                  }

                  const topicId = `crop-price-${category}`;
                  if (isFollowingTopic(topicId)) {
                    unfollowTopic(topicId);
                    return;
                  }

                  followTopic({
                    id: topicId,
                    topicType: 'price',
                    title: category,
                    sourceRoute: '/app/prices',
                    tags: ['ราคาพืชผล', category],
                    metadata: {},
                  });
                }}
                type="button"
              >
                <Badge
                  className={index === 0 || isFollowingTopic(`crop-price-${category}`) ? 'bg-kaset-deep text-white' : ''}
                  tone="neutral"
                >
                  {category}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <Card className="p-4">
          <h2 className="font-extrabold text-kaset-ink">ติดตามราคาพืชที่สนใจ</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            แตะหมวดราคาเพื่อบันทึกหัวข้อไว้ในเครื่องนี้ และเตรียมรองรับการแจ้งเตือนในอนาคต
          </p>
        </Card>

        <Card>
          {cropPrices.map((price) => (
            <PriceRow key={price.id} price={price} />
          ))}
        </Card>
      </div>
    </div>
  );
}
