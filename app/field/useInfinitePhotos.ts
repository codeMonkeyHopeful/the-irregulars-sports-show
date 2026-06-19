'use client';

import { useEffect, useRef, useState } from 'react';

export function useInfinitePhotos(photos: any[], pageSize = 9) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((c) => Math.min(c + pageSize, photos.length));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [photos.length]);

  return {
    visiblePhotos: photos.slice(0, visibleCount),
    loadMoreRef,
  };
}
