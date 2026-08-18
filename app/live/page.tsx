import SpotifyPlayer from '@/components/Spotify/SpotifyPlayer';
import { LiveChat } from './LiveChat';

export default function LivePage() {
  return (
    <main className="font-sans min-h-screen p-8 sm:p-20">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">Live</span>
        </h1>

        <section className="mt-10">
          <SpotifyPlayer />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">Live Chat</h2>

          <LiveChat />
        </section>
      </div>
    </main>
  );
}
