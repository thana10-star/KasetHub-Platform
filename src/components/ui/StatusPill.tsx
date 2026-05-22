import type { PropsWithChildren } from 'react';
import { cx } from '@/components/ui/classNames';

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type StatusPillProps = PropsWithChildren<{
  tone?: StatusTone;
  className?: string;
}>;

const toneClass: Record<StatusTone, string> = {
  success: 'bg-kaset-mint text-kaset-deep ring-kaset-deep/10',
  warning: 'bg-amber-100 text-amber-900 ring-amber-300/50',
  danger: 'bg-rose-100 text-rose-800 ring-rose-300/50',
  info: 'bg-sky-100 text-sky-800 ring-sky-300/50',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function StatusPill({ children, className, tone = 'neutral' }: StatusPillProps) {
  return (
    <span
      className={cx(
        'inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs font-extrabold leading-none ring-1',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
