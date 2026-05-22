import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cx } from '@/components/ui/classNames';
import type { CropPrice } from '@/types/kaset';

const formatter = new Intl.NumberFormat('th-TH', {
  maximumFractionDigits: 2,
});

type PriceRowProps = {
  price: CropPrice;
};

export function PriceRow({ price }: PriceRowProps) {
  const isUp = price.changePercent >= 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-kaset-deep/8 px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-kaset-ink">{price.crop}</h3>
          <span className="shrink-0 rounded-full bg-kaset-mint px-2 py-0.5 text-[10px] font-bold text-kaset-deep">
            {price.category}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {price.market} · {price.province}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">{price.updatedAt}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-extrabold text-kaset-ink">
          {formatter.format(price.price)}
          <span className="ml-1 text-[11px] font-semibold text-slate-500">{price.unit}</span>
        </p>
        <p
          className={cx(
            'mt-1 inline-flex items-center justify-end gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
            isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
          )}
        >
          <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
          {Math.abs(price.changePercent).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
