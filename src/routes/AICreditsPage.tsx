import { Coins, Crown, Server, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AICreditBalanceCard } from '@/components/kaset/AICreditBalanceCard';
import { AICreditUsageHistory } from '@/components/kaset/AICreditUsageHistory';
import { RewardedAdUnlockCard } from '@/components/kaset/RewardedAdUnlockCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { useAICredits } from '@/hooks/useAICredits';
import { aiCreditCostLabels } from '@/services/ai/ai-credit-cost-policy';

export function AICreditsPage() {
  const { grantRewardedCredit, state, summary } = useAICredits();

  return (
    <div>
      <PageHeader title="เครดิต AI" subtitle="ระบบเครดิตตัวอย่างในเครื่องนี้" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <AICreditBalanceCard summary={summary} />

        <NoticeBox tone="info" title="เครดิตช่วยคุมค่าใช้จ่าย AI">
          ผู้ใช้ทั่วไปถามฟรีได้ทุกวัน ดูโฆษณาจำลองเพื่อเพิ่มเครดิตได้ แต่เวอร์ชันนี้ยังไม่ใช้โฆษณาหรือระบบจ่ายเงินจริง
        </NoticeBox>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Server aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-kaset-ink">สถานะ AI Proxy</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ดูว่า AI ใช้ local fixture หรือเตรียมเชื่อม backend ทดสอบในอนาคต
              </p>
            </div>
          </div>
          <Link to="/app/ai-proxy-status">
            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-mint px-4 text-sm font-bold text-kaset-deep">
              เปิดสถานะ AI Proxy
            </span>
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <Sparkles aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-kaset-deep" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-kaset-ink">ใช้ฟรีวันนี้</h2>
                <Badge tone="green">Guest mode</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                ใช้ไปแล้ว {summary.dailyFreeUsed} จาก {summary.dailyFreeLimit} ครั้ง รีเซ็ตตามวันของประเทศไทย
              </p>
            </div>
          </div>
        </Card>

        <RewardedAdUnlockCard
          onUnlock={() =>
            grantRewardedCredit({
              credits: 1,
              metadata: {
                sourceRoute: '/app/ai-credits',
              },
            })
          }
        />

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Coins aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">ค่าเครดิตตามประเภทคำถาม</h2>
          </div>
          <div className="mt-3 grid gap-2">
            {aiCreditCostLabels.slice(0, 5).map((item) => (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-kaset-mist p-3" key={item.requestType}>
                <span className="text-sm font-bold text-kaset-ink">{item.label}</span>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-extrabold text-kaset-deep">
                  {item.cost} เครดิต
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
              <Crown aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <Badge tone="neutral">Future</Badge>
              <h2 className="mt-3 font-extrabold text-kaset-ink">แพ็กเกจ Pro ในอนาคต</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                เครดิต Pro จะใช้ระบบเดียวกันเพื่อรองรับแผนจ่ายเงินหรือสมาชิกพรีเมียมภายหลัง ยังไม่มี payment ใน M08
              </p>
            </div>
          </div>
        </Card>

        <AICreditUsageHistory unlockHistory={state.unlockHistory} usageHistory={state.usageHistory} />

        <Card className="border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <ShieldAlert aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-800" />
            <p className="text-sm leading-6 text-amber-900">
              สำหรับคำถามเกี่ยวกับโรคพืช ควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง ระบบนี้ยังไม่เชื่อมต่อ AI หรือโฆษณาจริง
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
