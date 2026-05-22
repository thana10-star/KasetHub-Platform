export type ShareSource = 'line' | 'facebook' | 'native' | 'copy';

export type SocialShareMetadata = {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  source?: ShareSource;
};

export type SocialShareResult = {
  source: ShareSource;
  status: 'shared' | 'opened' | 'copied' | 'cancelled' | 'failed' | 'unavailable';
  message: string;
  url?: string;
};

type NavigatorWithShare = Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
};

const lineShareBaseUrl = 'https://social-plugins.line.me/lineit/share';
const facebookShareBaseUrl = 'https://www.facebook.com/sharer/sharer.php';

function canUseWindow() {
  return typeof window !== 'undefined';
}

export function getAbsoluteShareUrl(url?: string) {
  if (!canUseWindow()) {
    return url ?? '';
  }

  if (!url) {
    return window.location.href;
  }

  return new URL(url, window.location.origin).toString();
}

export function appendReferralParam(url: string, source: ShareSource) {
  if (!url) {
    return url;
  }

  const baseUrl = canUseWindow() ? window.location.origin : 'https://kasethub.example';
  const shareUrl = new URL(url, baseUrl);
  shareUrl.searchParams.set('ref', source);
  return shareUrl.toString();
}

export function getShareUrl(metadata: SocialShareMetadata, source: ShareSource) {
  return appendReferralParam(getAbsoluteShareUrl(metadata.url), source);
}

export function getSocialShareIntentUrl(metadata: SocialShareMetadata, source: Exclude<ShareSource, 'native' | 'copy'>) {
  const shareUrl = getShareUrl(metadata, source);

  if (source === 'line') {
    const text = [metadata.title, metadata.description].filter(Boolean).join('\n');
    return `${lineShareBaseUrl}?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  }

  return `${facebookShareBaseUrl}?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(
    `${metadata.title}\n${metadata.description}`,
  )}`;
}

function openShareWindow(url: string) {
  if (!canUseWindow()) {
    return false;
  }

  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  return Boolean(opened);
}

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  return false;
}

export async function shareNative(metadata: SocialShareMetadata): Promise<SocialShareResult> {
  const shareUrl = getShareUrl(metadata, 'native');
  const shareData: ShareData = {
    title: metadata.title,
    text: metadata.description,
    url: shareUrl,
  };
  const webNavigator = typeof navigator !== 'undefined' ? (navigator as NavigatorWithShare) : undefined;

  if (!webNavigator?.share) {
    return {
      source: 'native',
      status: 'unavailable',
      message: 'อุปกรณ์นี้ยังไม่รองรับการแชร์เพิ่มเติม',
      url: shareUrl,
    };
  }

  try {
    if (webNavigator.canShare && !webNavigator.canShare(shareData)) {
      return {
        source: 'native',
        status: 'unavailable',
        message: 'อุปกรณ์นี้ยังไม่รองรับข้อมูลสำหรับแชร์',
        url: shareUrl,
      };
    }

    await webNavigator.share(shareData);
    return {
      source: 'native',
      status: 'shared',
      message: 'แชร์เรียบร้อยแล้ว',
      url: shareUrl,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        source: 'native',
        status: 'cancelled',
        message: 'ยกเลิกการแชร์แล้ว',
        url: shareUrl,
      };
    }

    return {
      source: 'native',
      status: 'failed',
      message: 'แชร์ไม่สำเร็จ ลองคัดลอกลิงก์แทนได้',
      url: shareUrl,
    };
  }
}

export async function shareToLine(metadata: SocialShareMetadata): Promise<SocialShareResult> {
  const intentUrl = getSocialShareIntentUrl(metadata, 'line');
  const opened = openShareWindow(intentUrl);

  return {
    source: 'line',
    status: opened ? 'opened' : 'failed',
    message: opened ? 'เปิดหน้าต่างแชร์ LINE แล้ว' : 'เปิด LINE ไม่สำเร็จ ลองคัดลอกลิงก์แทนได้',
    url: getShareUrl(metadata, 'line'),
  };
}

export async function shareToFacebook(metadata: SocialShareMetadata): Promise<SocialShareResult> {
  const intentUrl = getSocialShareIntentUrl(metadata, 'facebook');
  const opened = openShareWindow(intentUrl);

  return {
    source: 'facebook',
    status: opened ? 'opened' : 'failed',
    message: opened ? 'เปิดหน้าต่างแชร์ Facebook แล้ว' : 'เปิด Facebook ไม่สำเร็จ ลองคัดลอกลิงก์แทนได้',
    url: getShareUrl(metadata, 'facebook'),
  };
}

export async function copyShareLink(metadata: SocialShareMetadata): Promise<SocialShareResult> {
  const shareUrl = getShareUrl(metadata, 'copy');

  try {
    const copied = await copyText(shareUrl);
    return {
      source: 'copy',
      status: copied ? 'copied' : 'unavailable',
      message: copied ? 'คัดลอกลิงก์แล้ว' : 'อุปกรณ์นี้ยังไม่รองรับการคัดลอกอัตโนมัติ',
      url: shareUrl,
    };
  } catch {
    return {
      source: 'copy',
      status: 'failed',
      message: 'คัดลอกลิงก์ไม่สำเร็จ',
      url: shareUrl,
    };
  }
}

export async function shareContent(metadata: SocialShareMetadata, source: ShareSource = metadata.source ?? 'native') {
  if (source === 'line') {
    return shareToLine(metadata);
  }

  if (source === 'facebook') {
    return shareToFacebook(metadata);
  }

  if (source === 'copy') {
    return copyShareLink(metadata);
  }

  const nativeResult = await shareNative(metadata);

  if (nativeResult.status === 'shared' || nativeResult.status === 'cancelled') {
    return nativeResult;
  }

  return copyShareLink(metadata);
}
