import { CheckCircle2, Copy, ExternalLink, Facebook, MessageCircle, Share2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/components/ui/classNames';
import {
  copyShareLink,
  shareNative,
  shareToFacebook,
  shareToLine,
  type ShareSource,
  type SocialShareMetadata,
  type SocialShareResult,
} from '@/services/share/social-share-service';

type SocialShareSheetProps = {
  metadata: SocialShareMetadata;
  open: boolean;
  onClose: () => void;
};

const shareOptions: Array<{
  source: ShareSource;
  label: string;
  description: string;
  icon: typeof Share2;
  className: string;
}> = [
  {
    source: 'line',
    label: 'แชร์เข้า LINE',
    description: 'เหมาะกับกลุ่มเกษตรกรและครอบครัว',
    icon: MessageCircle,
    className: 'bg-kaset-mint text-kaset-deep',
  },
  {
    source: 'facebook',
    label: 'แชร์ Facebook',
    description: 'เปิดหน้าต่างแชร์ไปยัง Facebook',
    icon: Facebook,
    className: 'bg-sky-100 text-sky-800',
  },
  {
    source: 'native',
    label: 'แชร์เพิ่มเติม',
    description: 'ใช้เมนูแชร์ของมือถือหรือเบราว์เซอร์',
    icon: Share2,
    className: 'bg-amber-100 text-amber-800',
  },
  {
    source: 'copy',
    label: 'คัดลอกลิงก์',
    description: 'เก็บลิงก์พร้อม ref สำหรับแชร์เอง',
    icon: Copy,
    className: 'bg-slate-100 text-slate-700',
  },
];

export function SocialShareSheet({ metadata, open, onClose }: SocialShareSheetProps) {
  const [result, setResult] = useState<SocialShareResult | null>(null);
  const [activeSource, setActiveSource] = useState<ShareSource | null>(null);

  if (!open) {
    return null;
  }

  async function handleShare(source: ShareSource) {
    setActiveSource(source);

    const nextResult =
      source === 'line'
        ? await shareToLine(metadata)
        : source === 'facebook'
          ? await shareToFacebook(metadata)
          : source === 'copy'
            ? await copyShareLink(metadata)
            : await shareNative(metadata);

    setResult(nextResult);
    setActiveSource(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-kaset-ink/40 px-4 pb-4 backdrop-blur-sm">
      <button aria-label="ปิดหน้าต่างแชร์" className="absolute inset-0 h-full w-full" onClick={onClose} type="button" />
      <section className="relative w-full max-w-[430px] rounded-[1.4rem] bg-white p-4 shadow-[0_24px_80px_rgba(18,50,38,0.28)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-kaset-leaf">KasetHub Social Share</p>
            <h2 className="mt-1 text-lg font-extrabold leading-6 text-kaset-ink">แชร์ให้เพื่อนเกษตรกร</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{metadata.title}</p>
          </div>
          <button
            aria-label="ปิด"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-kaset-mint text-kaset-deep"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeSource === option.source;

            return (
              <button
                className="flex min-h-[76px] w-full items-center gap-3 rounded-lg border border-kaset-deep/8 bg-white p-3 text-left shadow-soft transition hover:bg-kaset-mist"
                disabled={Boolean(activeSource)}
                key={option.source}
                onClick={() => handleShare(option.source)}
                type="button"
              >
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-lg', option.className)}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-extrabold leading-6 text-kaset-ink">
                    {isActive ? 'กำลังเตรียมแชร์' : option.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">{option.description}</span>
                </span>
                <ExternalLink aria-hidden="true" className="h-4 w-4 text-slate-400" />
              </button>
            );
          })}
        </div>

        {result ? (
          <div className="mt-4 flex gap-2 rounded-lg bg-kaset-mint p-3 text-sm font-semibold leading-6 text-kaset-deep">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{result.message}</span>
          </div>
        ) : null}

        <Button className="mt-4 w-full" onClick={onClose} variant="ghost">
          ปิด
        </Button>
      </section>
    </div>
  );
}
