import fs from 'fs';
import { Metadata } from 'next';
import path from 'path';
import PhotoGallery from './PhotoGallery';

export const metadata: Metadata = {
  title: 'On the Field',
  description: 'A podcast about sports.',
};

function getPhotos() {
  const dir = path.join(process.cwd(), 'public/photos');

  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()
    .map((file) => ({
      id: file,
      src: `/photos/${file}`,
    }));
}
export default function OnTheField() {
  const photos = getPhotos();
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="flex flex-col items-center gap-10">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">On the Field</span>
        </h1>
        <PhotoGallery photos={photos} />
      </main>
    </div>
  );
}
