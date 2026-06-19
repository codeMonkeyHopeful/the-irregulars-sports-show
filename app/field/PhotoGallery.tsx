'use client';

import { useState } from 'react';
import PhotoModal from './PhotoModal';
import { useInfinitePhotos } from './useInfinitePhotos';

export default function PhotoGallery({ photos }: { photos: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  const { visiblePhotos, loadMoreRef } = useInfinitePhotos(photos, 9);

  return (
    <>
      <div className="grid">
        {visiblePhotos.map((photo) => (
          <img
            key={photo.id}
            src={photo.src}
            className="img"
            loading="lazy"
            onClick={() => setSelected(photo)}
          />
        ))}
      </div>

      <div ref={loadMoreRef} />

      <PhotoModal photo={selected} onClose={() => setSelected(null)} />

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
          transition: transform 0.2s;
        }

        .img:hover {
          transform: scale(1.03);
        }
      `}</style>
    </>
  );
}
