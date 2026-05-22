import { Link } from 'react-router-dom';
import type { AppRoute } from '@/types/kaset';

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: AppRoute;
};

export function SectionHeader({ title, eyebrow, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-bold text-kaset-leaf">{eyebrow}</p> : null}
        <h2 className="text-xl font-extrabold leading-7 text-kaset-ink">{title}</h2>
      </div>
      {actionLabel && actionHref ? (
        <Link className="shrink-0 rounded-full bg-white px-3 py-2 text-sm font-bold text-kaset-deep shadow-soft ring-1 ring-kaset-deep/5" to={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
