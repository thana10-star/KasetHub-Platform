import { History, Leaf, Plus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FarmAnalysisCard } from '@/components/kaset/FarmAnalysisCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { farmAnalysisRecords } from '@/data/mockData';
import { useGuestMemory } from '@/hooks/useGuestMemory';
import type { FarmAnalysisRecord } from '@/types/kaset';

export function MyFarmPage() {
  const { state } = useGuestMemory();
  const memoryFarmRecords: FarmAnalysisRecord[] = state.farmRecords.map((record) => ({
    id: record.id,
    cropName: record.cropName,
    diseaseName: record.diseaseName,
    date: record.date,
    confidence: record.confidence ?? 0,
    symptomsSummary: record.symptomsSummary,
    treatmentSummary: record.treatmentSummary,
    status: record.status === 'บันทึกไว้' ? 'เฝ้าระวัง' : record.status,
  }));
  const visibleRecords = memoryFarmRecords.length > 0 ? memoryFarmRecords : farmAnalysisRecords;

  return (
    <div>
      <PageHeader title="ฟาร์มของฉัน" subtitle="ประวัติพืชและผลวิเคราะห์ตัวอย่าง" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Leaf aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-50">My Farm Foundation</p>
                <h2 className="mt-2 text-xl font-extrabold">ติดตามสุขภาพพืชในแปลงเดียว</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ข้อมูลนี้เป็น mock history สำหรับเตรียมต่อยอดสู่บัญชีผู้ใช้และฐานข้อมูลจริง
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-2xl font-extrabold text-kaset-deep">{visibleRecords.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">รายการวิเคราะห์</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-extrabold text-kaset-deep">
              {new Set(visibleRecords.map((record) => record.cropName)).size}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">ชนิดพืชตัวอย่าง</p>
          </Card>
        </div>

        <Button className="w-full" variant="soft">
          <Plus aria-hidden="true" className="h-4 w-4" />
          เพิ่มแปลงหรือพืชใหม่
        </Button>

        <Link to="/app/analysis-history">
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-kaset-deep px-4 text-sm font-bold text-white transition hover:bg-kaset-ink">
            <History aria-hidden="true" className="h-4 w-4" />
            ดูประวัติวิเคราะห์ภาพ
          </span>
        </Link>

        <section className="grid gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-kaset-leaf" />
            <h2 className="text-lg font-extrabold text-kaset-ink">
              {memoryFarmRecords.length > 0 ? 'ประวัติจากเครื่องนี้' : 'ประวัติผลวิเคราะห์ตัวอย่าง'}
            </h2>
          </div>
          {visibleRecords.map((record) => (
            <FarmAnalysisCard key={record.id} record={record} />
          ))}
        </section>
      </div>
    </div>
  );
}
