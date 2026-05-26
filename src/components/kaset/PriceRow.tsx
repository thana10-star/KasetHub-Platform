import { ArrowRight, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CropPrice } from '@/types/kaset';

type PriceRowProps = {
  price: CropPrice;
};

export function PriceRow({ price }: PriceRowProps) {
  return (
    <Link className="grid grid-cols-[1fr_auto] gap-3 border-b border-kaset-deep/8 px-4 py-3 last:border-b-0" to="/app/prices">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            รอแหล่งข้อมูลจริง
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
          ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล
        </p>
      </div>
      <div className="flex flex-col items-end justify-center gap-2 text-right">
        <Tags aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
        <ArrowRight aria-hidden="true" className="h-4 w-4 text-kaset-deep" />
      </div>
    </Link>
  );
}
