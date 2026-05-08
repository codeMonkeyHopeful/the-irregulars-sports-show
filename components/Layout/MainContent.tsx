'use client';
import { useSidebar } from '@/context/SidebarContext';

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
    </main>
  );
}
