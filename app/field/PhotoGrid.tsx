'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function PhotoGrid({ photos }: { photos: any[] }) {
  const [count, setCount] = useState(9);
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCount((c) => Math.min(c + 9, photos.length));
      }
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [photos.length]);

  return (
    <>
      <div className="grid">
        {photos.slice(0, count).map((photo) => (
          <Link key={photo.id} href={`/on-the-field/${photo.id}`}>
            <img
              src={photo.src} // 👈 LOCAL FILE HERE
              className="img"
              loading="lazy"
              alt=""
            />
          </Link>
        ))}
      </div>

      <div ref={loadRef} />

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 900px;
        }

        .img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .img:hover {
          transform: scale(1.03);
        }
      `}</style>
    </>
  );
}
