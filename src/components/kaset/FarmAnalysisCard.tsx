import { CalendarDays, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';
import { ShareButton } from '@/components/kaset/ShareButton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cx } from '@/components/ui/classNames';
import type { FarmAnalysisRecord } from '@/types/kaset';

type FarmAnalysisCardProps = {
  record: FarmAnalysisRecord;
};

const statusTone: Record<FarmAnalysisRecord['status'], string> = {
  เฝ้าระวัง: 'bg-amber-100 text-amber-800',
  กำลังรักษา: 'bg-rose-100 text-rose-800',
  ดีขึ้นแล้ว: 'bg-emerald-100 text-emerald-800',
};

const statusIcon = {
  เฝ้าระวัง: ShieldAlert,
  กำลังรักษา: TrendingUp,
  ดีขึ้นแล้ว: CheckCircle2,
};

export function FarmAnalysisCard({ record }: FarmAnalysisCardProps) {
  const StatusIcon = statusIcon[record.status];

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {record.date}
          </p>
          <h2 className="mt-2 text-lg font-extrabold leading-6 text-kaset-ink">{record.cropName}</h2>
          <p className="mt-1 text-sm font-semibold leading-5 text-kaset-deep">{record.diseaseName}</p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <span className="text-sm font-extrabold">{record.confidence}%</span>
          <span className="text-[10px] font-bold">demo</span>
        </div>
      </div>

      <Badge className={cx('mb-4 gap-1', statusTone[record.status])} tone="neutral">
        <StatusIcon aria-hidden="true" className="h-3.5 w-3.5" />
        {record.status}
      </Badge>

      <div className="grid gap-3">
        <div className="rounded-lg bg-kaset-mist p-3">
          <p className="text-xs font-bold text-kaset-ink">สรุปอาการ</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{record.symptomsSummary}</p>
        </div>
        <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/8">
          <p className="text-xs font-bold text-kaset-ink">แนวทางดูแล</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{record.treatmentSummary}</p>
        </div>
      </div>

      <ShareButton
        className="mt-4 w-full"
        compact
        label="แชร์เพิ่มเติม"
        payload={{
          title: `ประวัติพืช ${record.cropName}`,
          description: `${record.diseaseName} ความมั่นใจตัวอย่าง ${record.confidence}%\nสถานะ: ${record.status}`,
          url: `/app/my-farm#${record.id}`,
        }}
      />
    </Card>
  );
}
