import MainContent from '@/components/Layout/MainContent';
import Sidebar from '@/components/Layout/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import spotify from '@/public/spotify.svg';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Image from 'next/image';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <SidebarProvider>
          <div className="flex flex-1">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
