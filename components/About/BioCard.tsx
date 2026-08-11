'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BioCardProps {
  name: string;
  title?: string;
  teams?: string;
  bio: string;
  contact?: React.ReactNode;
  quote?: string;
  photoSrc: string;
  photoAlt?: string;
}

const DEFAULT_PHOTO = '/profile-placeholder.jpg';

export function BioCard({
  name,
  title,
  teams,
  bio,
  contact,
  quote,
  photoSrc,
  photoAlt,
}: BioCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Close the photo modal when pressing Escape
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent the page from scrolling while the modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);

  const photo = photoSrc || DEFAULT_PHOTO;

  return (
    <>
      {' '}
      <div className="flex w-full overflow-hidden rounded-2xl bg-white shadow-md">
        {/* Profile Photo */}{' '}
        <div className="flex-shrink-0 p-4">
          <div
            className="relative h-48 w-48 cursor-pointer overflow-hidden rounded-xl"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo}
              alt={photoAlt ?? name}
              fill
              sizes="192px"
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
            ```
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 hover:bg-black/20">
              {/* <span className="rounded-full bg-black/60 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-200 hover:opacity-100">
                View photo
              </span> */}
            </div>
          </div>
        </div>
        {/* Bio Content */}
        <div className="flex flex-1 flex-col py-4 pr-6">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">{name}</h2>

          {title && (
            <h4 className="mb-2 text-sm font-medium text-gray-500">{title}</h4>
          )}

          {teams && (
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Teams:</span> {teams}
            </p>
          )}

          <p className="flex-1 whitespace-pre-line leading-relaxed text-gray-600">
            {bio}
          </p>

          {contact && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">{contact}</p>
            </div>
          )}

          {quote && (
            <p className="mt-3 text-sm italic text-gray-400">"{quote}"</p>
          )}
        </div>
      </div>
      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo of ${name}`}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-gray-900 shadow-lg transition hover:bg-white"
            aria-label="Close photo"
          >
            ×
          </button>

          {/* Enlarged Photo */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedPhoto}
              alt={photoAlt ?? name}
              width={1200}
              height={1200}
              className="max-h-[90vh] w-auto max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
