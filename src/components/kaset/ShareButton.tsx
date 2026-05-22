import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { SocialShareSheet } from '@/components/kaset/SocialShareSheet';
import { Button } from '@/components/ui/Button';
import { cx } from '@/components/ui/classNames';
import type { SocialShareMetadata } from '@/services/share/social-share-service';

type ShareButtonProps = {
  payload: SocialShareMetadata;
  label?: string;
  className?: string;
  compact?: boolean;
};

export function ShareButton({ payload, label = 'แชร์เพิ่มเติม', className, compact = false }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className={cx(compact ? 'min-h-9 px-3 text-xs' : '', className)}
        onClick={() => setOpen(true)}
        variant="secondary"
      >
        <Share2 aria-hidden="true" className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        {label}
      </Button>
      <SocialShareSheet metadata={payload} onClose={() => setOpen(false)} open={open} />
    </>
  );
}
