import { Coins, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';

type AICreditBalanceCardProps = {
  summary: AICreditSummary;
  compact?: boolean;
  showLink?: boolean;
};

export function AICreditBalanceCard({ compact = false, showLink = false, summary }: AICreditBalanceCardProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Coins aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">เครดิตถาม AI</h2>
            <Badge tone={summary.canAsk ? 'green' : 'rose'}>{summary.canAsk ? 'พร้อมใช้' : 'หมดแล้ว'}</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            วันนี้ถามฟรีได้อีก {summary.dailyFreeRemaining} ครั้ง
          </p>
        </div>
      </div>

      <div className={`mt-4 grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="rounded-lg bg-kaset-mist p-3 text-center">
          <p className="text-lg font-extrabold text-kaset-deep">{summary.totalAvailable}</p>
          <p className="text-[11px] font-semibold text-slate-500">รวมที่ใช้ได้</p>
        </div>
        <div className="rounded-lg bg-kaset-mist p-3 text-center">
          <p className="text-lg font-extrabold text-kaset-deep">
            {summary.dailyFreeUsed}/{summary.dailyFreeLimit}
          </p>
          <p className="text-[11px] font-semibold text-slate-500">ใช้ฟรีวันนี้</p>
        </div>
        <div className="rounded-lg bg-kaset-mist p-3 text-center">
          <p className="text-lg font-extrabold text-kaset-deep">{summary.rewardedCredits}</p>
          <p className="text-[11px] font-semibold text-slate-500">จากโฆษณา</p>
        </div>
        {!compact ? (
          <div className="rounded-lg bg-kaset-mist p-3 text-center">
            <p className="text-lg font-extrabold text-kaset-deep">{summary.proCredits}</p>
            <p className="text-[11px] font-semibold text-slate-500">Pro ในอนาคต</p>
          </div>
        ) : null}
      </div>

      {showLink ? (
        <Link to="/app/ai-credits">
          <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep transition hover:bg-emerald-100">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            ดูประวัติเครดิต AI
          </span>
        </Link>
      ) : null}
    </Card>
  );
}
