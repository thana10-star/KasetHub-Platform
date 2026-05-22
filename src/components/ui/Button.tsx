import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cx } from '@/components/ui/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-kaset-deep text-white shadow-soft hover:bg-kaset-ink',
  secondary: 'bg-white text-kaset-deep ring-1 ring-kaset-deep/12 hover:bg-kaset-mint',
  ghost: 'bg-transparent text-kaset-deep hover:bg-kaset-mint',
  soft: 'bg-kaset-mint text-kaset-deep hover:bg-emerald-100',
};

export function Button({ children, className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-5 text-[15px] font-bold leading-5',
        'transition focus:outline-none focus-visible:ring-2 focus-visible:ring-kaset-leaf focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClass[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
