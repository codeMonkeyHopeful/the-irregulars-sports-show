'use client';
import { useSidebar } from '@/context/SidebarContext';
import spotify from '@/public/spotify.svg';
import Image from 'next/image';

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();
  return (
    <main
      className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[60px]' : 'ml-[220px]'}`}
    >
      {children}
      <footer className="sticky bottom-0 flex gap-[24px] flex-wrap items-center justify-center p-4 bg-white dark:bg-black">
        <a
          href="https://open.spotify.com/show/6EwXjHiWsRiE9SE8GuJJv4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            src={spotify}
            width={50}
            height={50}
            alt="Logo of The Irregular Sports Show"
          />
        </a>
      </footer>
    </main>
  );
}
