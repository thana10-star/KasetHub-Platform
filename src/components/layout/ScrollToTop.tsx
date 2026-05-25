import { useEffect, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { getHashElementId } from '@/components/layout/scroll-utils';

type ScrollToTopProps = {
  scrollElementRef: RefObject<HTMLElement>;
};

export function ScrollToTop({ scrollElementRef }: ScrollToTopProps) {
  const location = useLocation();

  useEffect(() => {
    const scrollElement = scrollElementRef.current;

    if (location.hash) {
      const targetId = getHashElementId(location.hash);
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }

    scrollElement?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [location.hash, location.pathname, location.search, scrollElementRef]);

  return null;
}
