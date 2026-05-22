import { Droplets, Leaf, LineChart, Newspaper, Sprout, SunMedium, Wheat } from 'lucide-react';
import { cx } from '@/components/ui/classNames';
import type { Article, CommunityPost, KasetVideo } from '@/types/kaset';

type Tone = CommunityPost['imageTone'] | Article['imageTone'] | KasetVideo['tone'] | 'leaf-scan';

type VisualPlaceholderProps = {
  tone: Tone;
  label: string;
  className?: string;
};

const toneMap: Record<Tone, { className: string; icon: typeof Leaf }> = {
  field: { className: 'from-emerald-200 via-lime-100 to-amber-100 text-kaset-deep', icon: Wheat },
  leaf: { className: 'from-green-200 via-emerald-100 to-teal-100 text-kaset-deep', icon: Leaf },
  fruit: { className: 'from-amber-200 via-lime-100 to-emerald-100 text-amber-900', icon: SunMedium },
  water: { className: 'from-sky-200 via-cyan-100 to-emerald-100 text-sky-900', icon: Droplets },
  soil: { className: 'from-stone-200 via-amber-100 to-lime-100 text-stone-800', icon: Sprout },
  rice: { className: 'from-lime-200 via-emerald-100 to-white text-kaset-deep', icon: Wheat },
  orchard: { className: 'from-yellow-200 via-lime-100 to-emerald-100 text-kaset-deep', icon: SunMedium },
  market: { className: 'from-amber-100 via-white to-emerald-100 text-amber-900', icon: LineChart },
  disease: { className: 'from-rose-100 via-amber-100 to-emerald-100 text-rose-900', icon: Leaf },
  news: { className: 'from-sky-100 via-white to-emerald-100 text-sky-900', icon: Newspaper },
  tech: { className: 'from-emerald-100 via-white to-sky-100 text-kaset-deep', icon: LineChart },
  community: { className: 'from-emerald-100 via-lime-100 to-amber-50 text-kaset-deep', icon: Sprout },
  'leaf-scan': { className: 'from-emerald-200 via-lime-100 to-rose-100 text-kaset-deep', icon: Leaf },
};

export function VisualPlaceholder({ tone, label, className }: VisualPlaceholderProps) {
  const visual = toneMap[tone];
  const Icon = visual.icon;

  return (
    <div className={cx('relative overflow-hidden rounded-lg bg-gradient-to-br p-4', visual.className, className)}>
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/35" />
      <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-white/30" />
      <div className="relative flex h-full min-h-[120px] flex-col justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/70 shadow-soft">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </div>
        <p className="max-w-[12rem] text-sm font-bold leading-5">{label}</p>
      </div>
    </div>
  );
}
