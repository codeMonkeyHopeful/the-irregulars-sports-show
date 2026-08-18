import SpotifyPlayer from '@/components/Spotify/SpotifyPlayer';
import { Metadata } from 'next';
import { LiveChat } from './LiveChat';

export const metadata: Metadata = {
  title: 'Live',
  description: 'Watch and chat with The Irregulars Sport Show live.',
};

export default function LivePage() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
          <span className="title">Live</span>
        </h1>

        <section className="w-full">
          <SpotifyPlayer />
        </section>

        <section className="w-full">
          <h2 className="mb-4 text-center text-2xl font-bold">Live Chat</h2>

          <LiveChat />
        </section>
      </main>
    </div>
  );
}
