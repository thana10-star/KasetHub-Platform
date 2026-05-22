import { Link } from 'react-router-dom';
import { quickActions } from '@/data/mockData';

const accentClass = {
  green: 'bg-kaset-mint text-kaset-deep',
  gold: 'bg-amber-100 text-amber-800',
  sky: 'bg-sky-100 text-sky-800',
  rose: 'bg-rose-100 text-rose-800',
  earth: 'bg-stone-100 text-stone-800',
};

export function QuickActionGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickActions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            className="min-h-[142px] rounded-lg border border-white/90 bg-white p-4 shadow-card ring-1 ring-kaset-deep/5 transition hover:-translate-y-0.5 hover:shadow-soft"
            key={action.href}
            to={action.href}
          >
            <span className={`mb-4 grid h-11 w-11 place-items-center rounded-lg ${accentClass[action.accent]}`}>
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="block text-[15px] font-extrabold leading-6 text-kaset-ink">{action.label}</span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">{action.description}</span>
          </Link>
        );
      })}
    </div>
  );
}
