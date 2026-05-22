import { Clock3, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { AICreditUnlockLog, AICreditUsageLog } from '@/services/ai-credits/ai-credit.types';

type AICreditUsageHistoryProps = {
  usageHistory: AICreditUsageLog[];
  unlockHistory?: AICreditUnlockLog[];
};

function formatThaiDate(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AICreditUsageHistory({ unlockHistory = [], usageHistory }: AICreditUsageHistoryProps) {
  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock3 aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
          <h2 className="font-extrabold text-kaset-ink">ประวัติการถาม AI</h2>
        </div>
        {usageHistory.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {usageHistory.slice(0, 8).map((item) => (
              <div className="rounded-lg bg-kaset-mist p-3" key={item.id}>
                <p className="text-sm font-bold leading-6 text-kaset-ink">{item.question}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {formatThaiDate(item.usedAt)} · {item.creditSource}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
            ยังไม่มีประวัติการถาม AI ในเครื่องนี้
          </p>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
          <h2 className="font-extrabold text-kaset-ink">ประวัติการปลดล็อกเครดิต</h2>
        </div>
        {unlockHistory.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {unlockHistory.slice(0, 8).map((item) => (
              <div className="rounded-lg bg-kaset-mist p-3" key={item.id}>
                <p className="text-sm font-bold text-kaset-ink">เพิ่ม {item.creditsGranted} เครดิต</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {formatThaiDate(item.unlockedAt)} · {item.source}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">
            ยังไม่มีประวัติการดูโฆษณาจำลอง
          </p>
        )}
      </Card>
    </div>
  );
}
