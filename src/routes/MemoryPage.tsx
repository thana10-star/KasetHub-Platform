import { AlertTriangle, Bot, Bookmark, Download, Heart, Leaf, RotateCcw, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import type { SavedItemType } from '@/services/guest-memory/guest-memory.types';

const filters: Array<'ทั้งหมด' | SavedItemType> = [
  'ทั้งหมด',
  'article',
  'video',
  'community_post',
  'analysis_result',
  'crop_price',
  'ai_answer',
  'tool',
  'future',
];

const typeLabel: Record<SavedItemType, string> = {
  article: 'บทความ',
  video: 'วิดีโอ',
  community_post: 'โพสต์',
  analysis_result: 'ผลวิเคราะห์',
  crop_price: 'ราคา',
  ai_answer: 'คำตอบ AI',
  tool: 'เครื่องมือ',
  future: 'อื่น ๆ',
};

export function MemoryPage() {
  const { state, counts, clearMemory, exportMemory } = useGuestMemory();
  const [activeFilter, setActiveFilter] = useState<'ทั้งหมด' | SavedItemType>('ทั้งหมด');
  const [confirmClear, setConfirmClear] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const filteredItems = useMemo(() => {
    return activeFilter === 'ทั้งหมด'
      ? state.savedItems
      : state.savedItems.filter((item) => item.itemType === activeFilter);
  }, [activeFilter, state.savedItems]);

  function handleExport() {
    const exported = exportMemory();
    setExportMessage(`เตรียมข้อมูลสำรองแล้ว (${exported.state.savedItems.length} รายการ)`);
  }

  function handleClearMemory() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }

    clearMemory();
    setConfirmClear(false);
  }

  return (
    <div>
      <PageHeader title="หน่วยความจำผู้ใช้ทั่วไป" subtitle="บันทึกไว้ในเครื่องนี้ ยังไม่ต้องสมัคร" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Sprout aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <Badge className="bg-white/15 text-white" tone="green">
                  ใช้งานได้ทันที ไม่ต้องสมัคร
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ข้อมูลที่บันทึกไว้จะอยู่ในเครื่องนี้</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  สมัครด้วยเบอร์โทรหรือ LINE ในอนาคตเพื่อสำรองและย้ายข้อมูลไปเครื่องอื่น
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="info" title="ข้อมูลนี้อยู่ในเครื่องนี้เท่านั้น">
          หากเปลี่ยนเครื่องหรือล้างข้อมูลเบราว์เซอร์ ข้อมูลอาจหายได้ ระบบสำรองด้วยเบอร์โทรหรือ LINE จะตามมาในอนาคต
        </NoticeBox>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.savedArticles}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">บทความ</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.savedVideos}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">วิดีโอ</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.likedPosts}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">ไลก์โพสต์</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.followedTopics}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">ติดตาม</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.farmRecords}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">ฟาร์ม</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-extrabold text-kaset-deep">{counts.recentAIQuestions}</p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">คำถาม AI</p>
          </Card>
        </div>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">รายการที่บันทึกไว้</h2>
          <div className="-mx-5 overflow-x-auto px-5">
            <div className="flex min-w-max gap-2">
              {filters.map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)} type="button">
                  <Badge className={activeFilter === filter ? 'bg-kaset-deep text-white' : ''} tone="neutral">
                    {filter === 'ทั้งหมด' ? filter : typeLabel[filter]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-3">
              {filteredItems.map((item) => (
                <Card className="p-4" key={item.id}>
                  <div className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Bookmark aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Badge className="mb-2" tone="green">
                        {typeLabel[item.itemType]}
                      </Badge>
                      <h3 className="line-clamp-2 font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                      <Link className="mt-2 inline-block text-xs font-bold text-kaset-deep" to={item.sourceRoute}>
                        เปิดรายการ
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-5 text-center">
              <Bookmark aria-hidden="true" className="mx-auto h-8 w-8 text-kaset-deep" />
              <h3 className="mt-3 font-extrabold text-kaset-ink">ยังไม่มีรายการในหมวดนี้</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">ลองบันทึกบทความ วิดีโอ หรือโพสต์จากหน้าต่าง ๆ ในแอป</p>
            </Card>
          )}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">ความสนใจและกิจกรรมล่าสุด</h2>
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Heart aria-hidden="true" className="h-5 w-5 text-rose-600" />
              <h3 className="font-extrabold text-kaset-ink">โพสต์ที่ถูกใจ</h3>
            </div>
            {state.likes.length > 0 ? (
              <div className="grid gap-2">
                {state.likes.slice(0, 4).map((item) => (
                  <p className="text-sm leading-6 text-slate-700" key={item.id}>
                    {item.title}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500">ยังไม่มีโพสต์ที่ถูกใจ</p>
            )}
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Leaf aria-hidden="true" className="h-5 w-5 text-kaset-leaf" />
              <h3 className="font-extrabold text-kaset-ink">พืชหรือหัวข้อที่ติดตาม</h3>
            </div>
            {state.followedTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {state.followedTopics.map((topic) => (
                  <Badge key={topic.id} tone="green">
                    {topic.title}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500">ยังไม่มีหัวข้อที่ติดตาม</p>
            )}
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Bot aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
              <h3 className="font-extrabold text-kaset-ink">คำถาม AI ล่าสุด</h3>
            </div>
            {state.recentAIQuestions.length > 0 ? (
              <div className="grid gap-2">
                {state.recentAIQuestions.slice(0, 4).map((question) => (
                  <p className="text-sm leading-6 text-slate-700" key={question.id}>
                    {question.question}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500">ยังไม่มีคำถาม AI ที่บันทึกไว้</p>
            )}
          </Card>
        </section>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep"
          to="/app/my-farm"
        >
          เปิด My Farm
        </Link>

        <Card className="p-4">
          <div className="flex gap-3">
            <Download aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">Export memory mock</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เตรียมโครงสร้างสำหรับสำรองข้อมูลด้วยเบอร์โทรหรือ LINE ในอนาคต
              </p>
              {exportMessage ? <p className="mt-2 text-sm font-bold text-kaset-deep">{exportMessage}</p> : null}
              <Button className="mt-4 w-full" onClick={handleExport} variant="secondary">
                <Download aria-hidden="true" className="h-4 w-4" />
                ส่งออกข้อมูลตัวอย่าง
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-rose-200 bg-rose-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-rose-700" />
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-rose-950">ล้างข้อมูลในเครื่องนี้</h2>
              <p className="mt-1 text-sm leading-6 text-rose-900">
                ใช้สำหรับทดสอบเท่านั้น ข้อมูล guest memory ในเครื่องนี้จะถูกล้าง
              </p>
              <Button className="mt-4 w-full bg-rose-700 hover:bg-rose-800" onClick={handleClearMemory} variant="primary">
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                {confirmClear ? 'ยืนยันล้างข้อมูล' : 'ล้างข้อมูล'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
