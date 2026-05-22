import type { PropsWithChildren } from 'react';
import { cx } from '@/components/ui/classNames';

type BadgeTone = 'green' | 'gold' | 'sky' | 'rose' | 'neutral';

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
  className?: string;
}>;

const toneClass: Record<BadgeTone, string> = {
  green: 'bg-kaset-mint text-kaset-deep',
  gold: 'bg-amber-100 text-amber-800',
  sky: 'bg-sky-100 text-sky-800',
  rose: 'bg-rose-100 text-rose-800',
  neutral: 'bg-slate-100 text-slate-700',
};

export function Badge({ children, className, tone = 'green' }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold leading-none',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
