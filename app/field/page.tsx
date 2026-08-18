import { Metadata } from 'next';
import { AlbumGrid } from './AlbumGrid';
import { albums } from './albums';

export const metadata: Metadata = {
  title: 'On the Field',
  description: 'A podcast about sports.',
};

export default function OnTheField() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="flex flex-col items-center gap-10">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">On the Field</span>
        </h1>

        <AlbumGrid albums={albums} />
      </main>
    </div>
  );
}
