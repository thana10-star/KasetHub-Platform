import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cx } from '@/components/ui/classNames';
import type { CropPrice } from '@/types/kaset';
import { cropPriceReliabilityLabels } from '@/services/crop-prices/crop-price-sources';

type PriceRowProps = {
  price: CropPrice;
};

const trendTone = {
  up: 'bg-emerald-100 text-emerald-700',
  down: 'bg-rose-100 text-rose-700',
  same: 'bg-slate-100 text-slate-700',
};

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  same: Minus,
};

export function PriceRow({ price }: PriceRowProps) {
  const TrendIcon = trendIcon[price.changeDirection];
  const trendLabel = price.changeDirection === 'same' ? 'ทรงตัว' : `${Math.abs(price.changePercent).toFixed(1)}%`;

  return (
    <Link className="grid grid-cols-[1fr_auto] gap-3 border-b border-kaset-deep/8 px-4 py-3 last:border-b-0" to={`/app/prices/${price.id}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            ราคาอ้างอิง
          </span>
          <span className="shrink-0 rounded-full bg-kaset-mint px-2 py-0.5 text-[10px] font-bold text-kaset-deep">
            {price.category}
          </span>
        </div>
        <h3 className="mt-1 truncate text-sm font-bold text-kaset-ink">{price.cropName}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {price.market.label} · {price.region.label}
        </p>
        <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">
          {price.sourceLabel} · {price.capturedAtLabel}
        </p>
        <p className="mt-1 text-[11px] font-bold text-slate-500">
          {cropPriceReliabilityLabels[price.reliabilityLevel]}
          {price.qualityGrade ? ` · ${price.qualityGrade.label}` : ''}
        </p>
        <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-amber-800">{price.disclaimer}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-extrabold text-kaset-ink">
          {price.priceLabel}
        </p>
        <p
          className={cx(
            'mt-1 inline-flex items-center justify-end gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
            trendTone[price.changeDirection],
          )}
        >
          <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
          {trendLabel}
        </p>
        <ArrowRight aria-hidden="true" className="ml-auto mt-3 h-4 w-4 text-kaset-deep" />
      </div>
    </Link>
  );
}
