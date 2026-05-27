import Image from 'next/image';

interface BioCardProps {
  name: string;
  title?: string;
  teams?: string;
  bio: string;
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
  quote,
  photoSrc,
  photoAlt,
}: BioCardProps) {
  return (
    <div className="flex w-full rounded-2xl bg-white shadow-md overflow-hidden">
      <div className="flex-shrink-0 p-4">
        <div className="relative h-48 w-48 overflow-hidden rounded-xl">
          <Image
            src={photoSrc || DEFAULT_PHOTO}
            alt={photoAlt ?? name}
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 py-4 pr-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
        {title && (
          <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
        )}
        {teams && (
          <p className="text-gray-600 text-sm mb-2">
            <span className="font-semibold">Teams:</span> {teams}
          </p>
        )}
        <p className="text-gray-600 leading-relaxed whitespace-pre-line flex-1">
          {bio}
        </p>
        {quote && (
          <p className="text-gray-400 text-sm italic mt-3">"{quote}"</p>
        )}
      </div>
    </div>
  );
}
