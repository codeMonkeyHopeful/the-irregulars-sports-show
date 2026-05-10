'use client';
import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  toggleMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggle: () => setCollapsed((p) => !p),
        mobileOpen,
        toggleMobile: () => setMobileOpen((p) => !p),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
