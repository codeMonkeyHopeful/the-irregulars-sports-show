'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function PhotoModal({
  photo,
  onClose,
}: {
  photo: any | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!photo) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [photo, onClose]);

  if (!photo) return null;

  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <img
        src={photo.src}
        className="img"
        onClick={(e) => e.stopPropagation()}
      />

      <style jsx>{`
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .img {
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 12px;
        }
      `}</style>
    </div>,
    document.body
  );
}
