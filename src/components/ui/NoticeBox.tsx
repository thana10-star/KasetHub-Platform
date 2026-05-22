import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { cx } from '@/components/ui/classNames';

type NoticeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

type NoticeBoxProps = PropsWithChildren<{
  tone?: NoticeTone;
  title?: string;
  icon?: LucideIcon;
  className?: string;
}>;

const toneClass: Record<NoticeTone, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-950',
  success: 'border-emerald-200 bg-kaset-mint text-kaset-ink',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  danger: 'border-rose-200 bg-rose-50 text-rose-950',
  neutral: 'border-kaset-deep/10 bg-white text-kaset-ink',
};

const iconClass: Record<NoticeTone, string> = {
  info: 'text-sky-700',
  success: 'text-kaset-deep',
  warning: 'text-amber-800',
  danger: 'text-rose-700',
  neutral: 'text-kaset-deep',
};

const defaultIcon: Record<NoticeTone, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: ShieldAlert,
  danger: AlertTriangle,
  neutral: Info,
};

export function NoticeBox({ children, className, icon, title, tone = 'info' }: NoticeBoxProps) {
  const Icon = icon ?? defaultIcon[tone];

  return (
    <div className={cx('rounded-lg border p-4 shadow-soft', toneClass[tone], className)}>
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/80 shadow-soft">
          <Icon aria-hidden="true" className={cx('h-5 w-5', iconClass[tone])} />
        </span>
        <div className="min-w-0 flex-1">
          {title ? <p className="font-extrabold leading-6">{title}</p> : null}
          <div className={cx('kh-safety-copy', title && 'mt-1')}>{children}</div>
        </div>
      </div>
    </div>
  );
}
