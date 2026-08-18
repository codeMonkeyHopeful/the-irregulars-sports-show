import Link from 'next/link';

type Album = {
  id: string;
  title: string;
  cover: string;
  photos: string[];
};

export const AlbumGrid = ({ albums }: { albums: Album[] }) => {
  return (
    <div className="grid">
      {albums.map((album) => (
        <Link key={album.id} href={`/field/${album.id}`} className="album">
          <img
            src={`/photos/${album.cover}`}
            alt={album.title}
            className="cover"
          />

          <h2>{album.title}</h2>
        </Link>
      ))}

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
          max-width: 900px;
        }

        .album {
          color: inherit;
          text-decoration: none;
        }

        .cover {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 10px;
          display: block;
          transition: transform 0.2s ease;
        }

        .album:hover .cover {
          transform: scale(1.03);
        }

        h2 {
          margin-top: 10px;
          text-align: center;
          font-size: 1.2rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
