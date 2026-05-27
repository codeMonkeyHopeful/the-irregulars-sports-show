import Image from 'next/image';

interface BioCardProps {
  name: string;
  bio: string;
  photoSrc: string;
  photoAlt?: string;
}

const DEFAULT_PHOTO = '/profile-placeholder.jpg';

export function BioCard({ name, bio, photoSrc, photoAlt }: BioCardProps) {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
        <p className="text-gray-600 leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
