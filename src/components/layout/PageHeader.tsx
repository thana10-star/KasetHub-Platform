import { Bell, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function PageHeader({ title, subtitle, showBack = false }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-5">
      <div className="flex min-w-0 items-start gap-3">
        {showBack ? (
          <button
            aria-label="กลับ"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-kaset-deep shadow-soft ring-1 ring-kaset-deep/8"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
        ) : null}
        <div className="min-w-0">
          <p className="text-xs font-bold text-kaset-leaf">KasetHub</p>
          <h1 className="text-[1.35rem] font-extrabold leading-7 text-kaset-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm leading-5 text-slate-600">{subtitle}</p> : null}
        </div>
      </div>
      <Link
        aria-label="การแจ้งเตือน"
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-kaset-deep shadow-soft ring-1 ring-kaset-deep/8"
        to="/app/notifications"
      >
        <Bell aria-hidden="true" className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
      </Link>
    </header>
  );
}
