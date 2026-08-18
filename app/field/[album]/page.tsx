import { notFound } from 'next/navigation';
import { albums } from '../albums';
import { PhotoGallery } from '../PhotoGallery';
import { photos } from '../photos';

const AlbumPage = async ({
  params,
}: {
  params: Promise<{ album: string }>;
}) => {
  const { album } = await params;

  const currentAlbum = albums.find((item) => item.id === album);

  if (!currentAlbum) {
    notFound();
  }

  const albumPhotos = photos.filter((photo) => photo.album === album);

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="flex flex-col items-center gap-10">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">{currentAlbum.title}</span>
        </h1>

        <p>{albumPhotos.length} photos</p>

        <PhotoGallery photos={albumPhotos} />
      </main>
    </div>
  );
};

export default AlbumPage;
