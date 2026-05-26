import { Bot, Calculator, Home, Tags, UserRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cx } from '@/components/ui/classNames';
import type { AppRoute } from '@/types/kaset';

const items: Array<{ label: string; href: AppRoute; icon: typeof Home }> = [
  { label: 'หน้าแรก', href: '/app', icon: Home },
  { label: 'ราคาเกษตร', href: '/app/prices', icon: Tags },
  { label: 'เครื่องมือ', href: '/app/calculators', icon: Calculator },
  { label: 'ถาม AI', href: '/app/ai', icon: Bot },
  { label: 'โปรไฟล์', href: '/app/profile', icon: UserRound },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="border-t border-kaset-deep/10 bg-white/95 px-3 pb-3 pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/app' ? location.pathname === '/app' : location.pathname.startsWith(item.href);

          return (
            <NavLink
              aria-label={item.label}
              className={cx(
                'flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-lg px-1 text-center text-[11px] font-bold leading-4 transition',
                isActive ? 'bg-kaset-mint text-kaset-deep' : 'text-slate-500 hover:bg-kaset-mint/70',
              )}
              key={item.href}
              to={item.href}
            >
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
              <span className="break-words">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
