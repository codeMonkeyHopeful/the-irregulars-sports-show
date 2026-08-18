import Link from 'next/link';

type Album = {
  id: string;
  title: string;
  cover: string;
  start: number;
  end: number;
};

export const AlbumGrid = ({ albums }: { albums: Album[] }) => {
  return (
    <div className="album-grid">
      {albums.map((album) => (
        <Link key={album.id} href={`/field/${album.id}`} className="album-card">
          <img
            src={`/photos/${album.cover}`}
            alt={album.title}
            className="album-cover"
          />

          <h2 className="album-title">{album.title}</h2>
        </Link>
      ))}
    </div>
  );
};
