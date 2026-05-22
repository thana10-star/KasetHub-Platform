import { PlayCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type RewardedAdUnlockCardProps = {
  onUnlock: () => void;
  message?: string;
};

export function RewardedAdUnlockCard({ message, onUnlock }: RewardedAdUnlockCardProps) {
  return (
    <Card className="border-amber-200 bg-amber-50 p-5 shadow-soft">
      <div className="flex gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-amber-700 shadow-soft">
          <PlayCircle aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-amber-950">ดูโฆษณา 1 ครั้ง = ได้เพิ่ม 1 คำถาม</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            ยังไม่เปิดโฆษณาจริงในเวอร์ชันนี้ ปุ่มนี้เป็นการจำลอง rewarded ad สำหรับทดสอบ UX เท่านั้น
          </p>
          {message ? <p className="mt-2 text-sm font-bold text-kaset-deep">{message}</p> : null}
          <Button className="mt-4 bg-amber-600 hover:bg-amber-700" onClick={onUnlock} variant="primary">
            <PlayCircle aria-hidden="true" className="h-4 w-4" />
            ดูโฆษณาจำลอง
          </Button>
          <p className="mt-3 flex gap-2 text-xs leading-5 text-amber-900">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            ระบบจริงในอนาคตต้องตรวจสอบการดูโฆษณาผ่าน backend ก่อนเพิ่มเครดิต
          </p>
        </div>
      </div>
    </Card>
  );
}
