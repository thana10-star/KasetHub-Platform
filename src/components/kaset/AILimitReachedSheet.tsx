import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type AILimitReachedSheetProps = {
  onUnlock: () => void;
};

export function AILimitReachedSheet({ onUnlock }: AILimitReachedSheetProps) {
  return (
    <Card className="border-rose-200 bg-rose-50 p-5 shadow-soft">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-rose-700 shadow-soft">
          <Lock aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-rose-950">เครดิตถาม AI หมดแล้ว</h2>
          <p className="mt-2 text-sm leading-6 text-rose-900">
            วันนี้ใช้คำถามฟรีครบแล้ว สามารถดูโฆษณาจำลองเพื่อรับเพิ่ม 1 คำถามได้
          </p>
          <Button className="mt-4 bg-rose-700 hover:bg-rose-800" onClick={onUnlock}>
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            ดูโฆษณาจำลองเพื่อปลดล็อก
          </Button>
        </div>
      </div>
    </Card>
  );
}
