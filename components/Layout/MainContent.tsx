'use client';
import { useSidebar } from '@/context/SidebarContext';
import spotify from '@/public/spotify.svg';
import x from '@/public/x.png';
import { Menu } from 'lucide-react';
import Image from 'next/image';

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed, toggleMobile } = useSidebar();

  return (
    <main
      className={`flex-1 flex flex-col min-h-screen transition-all duration-300
        md:${collapsed ? 'ml-[60px]' : 'ml-[220px]'}`}
    >
      {/* Mobile header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 md:hidden">
        <button
          onClick={toggleMobile}
          className="text-white/60 hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="text-white text-sm font-medium">Irregulars</span>
      </div>

      <div className="flex-1">{children}</div>

      <footer className="sticky bottom-0 flex gap-[24px] flex-wrap items-center justify-center p-4 bg-black">
        <a
          href="https://open.spotify.com/show/6EwXjHiWsRiE9SE8GuJJv4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="w-[50px] h-[50px] relative">
            <Image
              id="spotify-logo"
              src={spotify}
              alt="Spotify"
              fill
              style={{ objectFit: 'contain' }}
              className="dark:invert"
              priority
            />
          </div>
        </a>
        <a
          href="https://x.com/IrregularsPod"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="w-[50px] h-[50px] relative">
            <Image
              id="x-logo"
              src={x}
              alt="X"
              fill
              style={{ objectFit: 'contain' }}
              className="dark:invert"
              priority
            />
          </div>
        </a>
      </footer>
    </main>
  );
}
