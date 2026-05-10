'use client';
import { useSidebar } from '@/context/SidebarContext';
import { ChevronLeft, Home, Info, Music2, Play } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Latest Episode', icon: Play, href: '/episodes/latest' },
  { label: 'Episodes', icon: Play, href: '/episodes' },
  {
    label: 'Spotify',
    icon: Music2,
    href: 'https://open.spotify.com/show/6EwXjHiWsRiE9SE8GuJJv4',
  },
  { label: 'About', icon: Info, href: '/about' },
];

export default function Sidebar() {
  const { collapsed, toggle, mobileOpen, toggleMobile } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col
          bg-black border-r border-white/10 transition-all duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${collapsed ? 'md:w-[60px]' : 'md:w-[220px]'}
          w-[220px]`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 overflow-hidden">
          <Music2 size={22} className="text-[#1DB954] flex-shrink-0" />
          {(!collapsed || mobileOpen) && (
            <span className="text-white text-sm font-medium whitespace-nowrap">
              Irregular
            </span>
          )}
        </div>

        <div className="flex-1 py-4">
          {navItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => mobileOpen && toggleMobile()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm
                text-white/60 hover:text-white hover:bg-white/5
                transition-colors overflow-hidden whitespace-nowrap"
            >
              <Icon size={20} className="flex-shrink-0" />
              {(!collapsed || mobileOpen) && label}
            </Link>
          ))}
        </div>

        {/* Collapse toggle — desktop only */}
        <div className="hidden md:flex px-3 pb-4">
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
    </>
  );
}
