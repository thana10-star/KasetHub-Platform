import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '@/components/ui/classNames';
import type { AppRoute } from '@/types/kaset';

type LargeActionVariant = 'primary' | 'soft' | 'white' | 'warning';

type LargeActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  description?: string;
  icon?: LucideIcon;
  trailing?: ReactNode;
  to?: AppRoute;
  variant?: LargeActionVariant;
};

const variantClass: Record<LargeActionVariant, string> = {
  primary: 'bg-kaset-deep text-white shadow-soft hover:bg-kaset-ink',
  soft: 'bg-kaset-mint text-kaset-deep hover:bg-emerald-100',
  white: 'bg-white text-kaset-ink shadow-card ring-1 ring-kaset-deep/5 hover:bg-kaset-mist',
  warning: 'bg-amber-50 text-amber-950 ring-1 ring-amber-200 hover:bg-amber-100',
};

export function LargeActionButton({
  className,
  description,
  icon: Icon,
  label,
  trailing,
  to,
  type = 'button',
  variant = 'white',
  ...props
}: LargeActionButtonProps) {
  const content = (
    <>
      {Icon ? (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/80 text-kaset-deep shadow-soft">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] font-extrabold leading-6">{label}</span>
        {description ? <span className="mt-1 block text-sm leading-6 opacity-80">{description}</span> : null}
      </span>
      {trailing ?? <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 opacity-70" />}
    </>
  );

  const classes = cx(
    'flex min-h-[64px] w-full items-center gap-3 rounded-lg px-4 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-kaset-leaf focus-visible:ring-offset-2',
    variantClass[variant],
    className,
  );

  if (to) {
    return (
      <Link className={classes} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {content}
    </button>
  );
}
