export const communityFallbackAuthorDisplayName = 'สมาชิก KasetHub';

const maxAuthorDisplayNameLength = 32;

function replaceControlCharacters(value: string) {
  return Array.from(value, (char) => {
    const code = char.charCodeAt(0);
    return code <= 0x1f || code === 0x7f ? ' ' : char;
  }).join('');
}

function normalizeDisplayName(value: string) {
  return replaceControlCharacters(value)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxAuthorDisplayNameLength)
    .trim();
}

export function getCommunityEmailLocalPart(email?: string | null) {
  if (!email) return undefined;

  const localPart = email.split('@')[0]?.trim();
  if (!localPart) return undefined;

  const sanitized = localPart
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, maxAuthorDisplayNameLength);

  return sanitized || undefined;
}

export function sanitizeCommunityAuthorDisplayName(value?: string | null) {
  if (!value) return undefined;

  const normalized = normalizeDisplayName(value);
  if (!normalized) return undefined;

  if (normalized.includes('@')) {
    return getCommunityEmailLocalPart(normalized);
  }

  return normalized;
}

type CommunityAuthorDisplayInput = {
  authorDisplayName?: string | null;
  currentUserEmail?: string | null;
  ownedByCurrentUser?: boolean;
};

export function getCommunityAuthorDisplayName(input: CommunityAuthorDisplayInput) {
  const safeAuthorName = sanitizeCommunityAuthorDisplayName(input.authorDisplayName);
  if (safeAuthorName) return safeAuthorName;

  if (input.ownedByCurrentUser) {
    const emailLocalPart = getCommunityEmailLocalPart(input.currentUserEmail);
    if (emailLocalPart) return emailLocalPart;
  }

  return communityFallbackAuthorDisplayName;
}

type CommunityWriteAuthorInput = {
  displayName?: string | null;
  email?: string | null;
  inputDisplayName?: string | null;
};

export function getCommunityWriteAuthorDisplayName(input: CommunityWriteAuthorInput) {
  return (
    sanitizeCommunityAuthorDisplayName(input.displayName) ??
    sanitizeCommunityAuthorDisplayName(input.inputDisplayName) ??
    getCommunityEmailLocalPart(input.email) ??
    communityFallbackAuthorDisplayName
  );
}
