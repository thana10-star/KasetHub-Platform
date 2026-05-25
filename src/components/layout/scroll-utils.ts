export function getHashElementId(hash: string) {
  if (!hash.startsWith('#')) return '';

  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

