import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { calculatorCards, calculatorLocalOnlyDisclaimer } from '@/services/agri-calculators/agri-calculator-fixtures';
import { useAgriCalculators } from '@/hooks/useAgriCalculators';
import { RecentCalculations } from '@/routes/calculators/CalculatorUi';
import { calculatorIconMap } from '@/routes/calculators/calculator-icons';
import { FlaskConical, Star } from 'lucide-react';

export function CalculatorsPage() {
  const calculators = useAgriCalculators();
  const favoriteCards = calculatorCards.filter((card) => calculators.favoriteCalculatorIds.includes(card.id));

  return (
    <div>
      <PageHeader title="เครื่องคำนวณเกษตร" subtitle="คำนวณตัวเลขพื้นฐานในเครื่องนี้" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative">
              <Badge className="bg-white/15 text-white" tone="green">
                M49 local foundation
              </Badge>
              <h2 className="mt-3 text-2xl font-extrabold leading-8">เครื่องมือช่วยคิดเลขสำหรับงานเกษตร</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                ผสมยา ปุ๋ย ระยะปลูก ผลผลิต และต้นทุน ใช้ได้ทันทีโดยไม่ส่งข้อมูลออกจากเครื่อง
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/12 p-3">
                  <p className="text-2xl font-extrabold">{calculators.counts.recentCalculations}</p>
                  <p className="text-xs font-bold text-emerald-50/85">ประวัติล่าสุด</p>
                </div>
                <div className="rounded-lg bg-white/12 p-3">
                  <p className="text-2xl font-extrabold">{calculators.counts.favorites}</p>
                  <p className="text-xs font-bold text-emerald-50/85">รายการโปรด</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="warning" title="ยังไม่ใช่คำแนะนำจากผู้เชี่ยวชาญ">
          {calculatorLocalOnlyDisclaimer} ผลลัพธ์เป็นการคำนวณเบื้องต้นและไม่รับประกันผลในแปลงจริง
        </NoticeBox>

        <Card className="border-sky-200 bg-sky-50 p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-sky-800">
              <FlaskConical aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-sky-950">QA เครื่องคำนวณ</h2>
                <StatusPill tone="info">M50</StatusPill>
              </div>
              <p className="mt-1 text-sm leading-6 text-sky-900">ดู test case, expected vs actual และคำเตือนของสูตรหลักแบบ local-only</p>
              <Link className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-sky-900 px-4 text-sm font-extrabold text-white" to="/app/calculators/qa">
                เปิด QA เครื่องคำนวณ
              </Link>
            </div>
          </div>
        </Card>

        {favoriteCards.length > 0 ? (
          <section className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-kaset-ink">รายการโปรด</h2>
              <StatusPill tone="success">แตะใช้ได้เร็ว</StatusPill>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {favoriteCards.map((card) => {
                const Icon = calculatorIconMap[card.iconKey];

                return (
                  <Link className="min-h-[120px] rounded-lg bg-white p-4 shadow-card ring-1 ring-kaset-deep/5" key={card.id} to={card.route}>
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="mt-3 block text-base font-extrabold leading-6 text-kaset-ink">{card.shortLabel}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="grid gap-3">
          <h2 className="text-lg font-extrabold text-kaset-ink">เครื่องคำนวณทั้งหมด</h2>
          <div className="grid gap-3">
            {calculatorCards.map((card) => {
              const Icon = calculatorIconMap[card.iconKey];
              const isFavorite = calculators.isFavorite(card.id);

              return (
                <Card className="p-4" key={card.id}>
                  <div className="flex gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold leading-6 text-kaset-ink">{card.label}</h3>
                        {isFavorite ? (
                          <Badge tone="gold">
                            <span className="inline-flex items-center gap-1">
                              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                              โปรด
                            </span>
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{card.description}</p>
                      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                        <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white" to={card.route}>
                          เปิดใช้
                        </Link>
                        <button
                          className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-kaset-deep ring-1 ring-kaset-deep/10"
                          onClick={() => calculators.toggleFavorite(card.id)}
                          type="button"
                        >
                          <Star aria-hidden="true" className={isFavorite ? 'h-5 w-5 fill-current' : 'h-5 w-5'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <RecentCalculations records={calculators.recentCalculations} />

        {calculators.recentCalculations.length > 0 ? (
          <Button className="w-full" onClick={calculators.clearHistory} variant="secondary">
            ล้างประวัติในเครื่องนี้
          </Button>
        ) : null}
      </div>
    </div>
  );
}
