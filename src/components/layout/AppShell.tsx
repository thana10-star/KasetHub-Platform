import { Outlet } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { platformHighlights } from '@/data/mockData';

export function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(35,163,107,0.18),_transparent_34%),linear-gradient(180deg,_#f5fbf7,_#edf8f0)] text-kaset-ink lg:grid lg:grid-cols-[minmax(320px,440px)_minmax(390px,430px)] lg:justify-center lg:gap-12 lg:px-8 lg:py-8">
      <aside className="hidden self-center lg:block">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-soft ring-1 ring-kaset-deep/8">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-kaset-deep text-white">
            <Sprout aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold text-kaset-deep">KasetHub Platform</span>
        </div>
        <h2 className="max-w-sm text-4xl font-extrabold leading-tight text-kaset-ink">
          พรีวิวแอปเกษตรไทยสำหรับมือถือที่พร้อมต่อยอดทั้งแพลตฟอร์ม
        </h2>
        <div className="mt-8 grid gap-3">
          {platformHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="rounded-lg border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur"
                key={item.title}
              >
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-kaset-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="mx-auto flex h-screen w-full max-w-[430px] flex-col overflow-hidden bg-kaset-mist shadow-none lg:h-[860px] lg:rounded-[2rem] lg:border lg:border-white/80 lg:shadow-[0_30px_90px_rgba(15,90,61,0.2)]">
        <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <BottomNav />
      </main>
    </div>
  );
}
