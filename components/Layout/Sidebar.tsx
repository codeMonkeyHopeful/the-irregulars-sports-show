'use client';
import { useSidebar } from '@/context/SidebarContext';
import { ChevronLeft, Home, Info, Music2, Play } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Episodes', icon: Play, href: '/episodes' },
  { label: 'Spotify', icon: Music2, href: '/spotify' },
  { label: 'About', icon: Info, href: '/about' },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <nav
      className={`fixed left-0 top-0 bottom-0 flex flex-col
        bg-black border-r border-white/10 transition-all duration-300
        ${collapsed ? 'w-[60px]' : 'w-[220px]'}`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 overflow-hidden">
        <Music2 size={22} className="text-[#1DB954] flex-shrink-0" />
        {!collapsed && (
          <span className="text-white text-sm font-medium whitespace-nowrap">
            Irregulars
          </span>
        )}
      </div>

      <div className="flex-1 py-4">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 text-sm
              text-white/60 hover:text-white hover:bg-white/5
              transition-colors overflow-hidden whitespace-nowrap"
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
            flex items-center justify-center transition-colors mx-auto"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={18}
            className={`text-white/60 transition-transform duration-300
              ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </nav>
  );
}
