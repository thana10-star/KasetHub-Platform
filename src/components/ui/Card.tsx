import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cx } from '@/components/ui/classNames';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLElement> & {
  className?: string;
}>;

export function Card({ children, className, ...props }: CardProps) {
  const hasCustomBackground = className?.split(/\s+/).some((classToken) => classToken.startsWith('bg-'));

  return (
    <section
      className={cx(
        'rounded-lg border border-white/90 shadow-card',
        !hasCustomBackground && 'bg-white',
        'ring-1 ring-kaset-deep/5',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
