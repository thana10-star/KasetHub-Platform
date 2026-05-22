import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

export function HeroCard() {
  return (
    <Card className="overflow-hidden bg-kaset-deep text-white">
      <div className="relative p-5">
        <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-kaset-leaf/30" />
        <div className="relative">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs font-semibold">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            ตัวอย่างแพลตฟอร์ม M01
          </span>
          <h2 className="max-w-[18rem] text-2xl font-extrabold leading-snug">
            แหล่งความรู้เพื่อเกษตรกรไทย ครบ จบ ในที่เดียว
          </h2>
          <p className="mt-3 max-w-[19rem] text-sm leading-6 text-emerald-50/90">
            วิดีโอ ความรู้ ชุมชน ราคา และผู้ช่วย AI ในประสบการณ์เดียว
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-kaset-deep"
            to="/app/ai"
          >
            ลองถาม AI
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
