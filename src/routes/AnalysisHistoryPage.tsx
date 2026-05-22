import { CalendarDays, Leaf, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShareButton } from '@/components/kaset/ShareButton';
import { VisualPlaceholder } from '@/components/kaset/VisualPlaceholder';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import type { SavedItem } from '@/services/guest-memory/guest-memory.types';

function getConfidence(item: SavedItem) {
  const result = item.metadata.plantAnalysisResult;

  if (result && typeof result === 'object' && 'confidence' in result) {
    const confidence = (result as { confidence?: { score?: number } }).confidence;
    return typeof confidence?.score === 'number' ? confidence.score : undefined;
  }

  return undefined;
}

function getImageName(item: SavedItem) {
  return typeof item.metadata.imageName === 'string' ? item.metadata.imageName : 'ภาพใบพืชตัวอย่าง';
}

export function AnalysisHistoryPage() {
  const { state } = useGuestMemory();
  const analysisItems = state.savedItems.filter((item) => item.itemType === 'analysis_result');

  return (
    <div>
      <PageHeader title="ประวัติวิเคราะห์ภาพ" subtitle="ข้อมูลที่บันทึกไว้ในเครื่องนี้" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Leaf aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <Badge className="bg-white/15 text-white" tone="green">
                  Local only
                </Badge>
                <h2 className="mt-3 text-xl font-extrabold">ประวัติจาก Guest Memory</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  เก็บเฉพาะสรุปผลและชื่อไฟล์ในเครื่องนี้ ยังไม่อัปโหลดรูปไป cloud
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-extrabold text-kaset-deep">{analysisItems.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">รายการวิเคราะห์</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-extrabold text-kaset-deep">
              {analysisItems.filter((item) => item.metadata.savedToFarm === true).length}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">บันทึกเข้าฟาร์ม</p>
          </Card>
        </div>

        {analysisItems.length > 0 ? (
          <section className="grid gap-4">
            {analysisItems.map((item) => {
              const confidence = getConfidence(item);

              return (
                <Card className="overflow-hidden" key={item.id}>
                  <VisualPlaceholder
                    className="aspect-[16/9] rounded-none"
                    label={getImageName(item)}
                    tone="leaf-scan"
                  />
                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                          {new Date(item.savedAt).toLocaleString('th-TH')}
                        </p>
                        <h2 className="mt-2 text-lg font-extrabold leading-6 text-kaset-ink">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                      </div>
                      {typeof confidence === 'number' ? (
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                          <span className="text-sm font-extrabold">{confidence}%</span>
                          <span className="text-[10px] font-bold">demo</span>
                        </span>
                      ) : null}
                    </div>
                    <Badge tone={item.metadata.savedToFarm === true ? 'green' : 'neutral'}>
                      {item.metadata.savedToFarm === true ? 'บันทึกแล้ว' : 'ยังไม่บันทึกฟาร์ม'}
                    </Badge>
                    <ShareButton
                      className="mt-4 w-full"
                      compact
                      label="แชร์ผลวิเคราะห์"
                      payload={{
                        title: item.title,
                        description: item.summary,
                        url: '/app/analysis-history',
                      }}
                    />
                  </div>
                </Card>
              );
            })}
          </section>
        ) : (
          <Card className="p-5 text-center">
            <p className="font-extrabold text-kaset-ink">ยังไม่มีประวัติวิเคราะห์ภาพ</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              เริ่มจากเลือกรูปในหน้าวิเคราะห์ แล้วกดบันทึกเข้าฟาร์มของฉัน
            </p>
            <Link to="/app/analyze">
              <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-bold text-white">
                เริ่มวิเคราะห์ภาพ
              </span>
            </Link>
          </Card>
        )}

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <ShieldAlert aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
            <p className="text-sm leading-6 text-amber-900">
              ข้อมูลนี้อยู่ในเครื่องนี้เท่านั้น การล้าง browser storage จะลบประวัติทั้งหมด ยังไม่มี Supabase Storage หรือ backend sync
            </p>
          </div>
        </Card>

        <Link to="/app/my-farm">
          <Button className="w-full" variant="soft">
            ดูฟาร์มของฉัน
          </Button>
        </Link>
      </div>
    </div>
  );
}
