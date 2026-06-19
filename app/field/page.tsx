import { Metadata } from 'next';
import PhotoGallery from './PhotoGallery';
import { photos } from './photos';

export const metadata: Metadata = {
  title: 'On the Field',
  description: 'A podcast about sports.',
};

export default function OnTheField() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="flex flex-col items-center gap-10">
        <h1 className="text-5xl font-extrabold">On the Field</h1>

        <PhotoGallery photos={photos} />
      </main>
    </div>
  );
}
