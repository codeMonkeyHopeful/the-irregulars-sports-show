import MainContent from '@/components/Layout/MainContent';
import Sidebar from '@/components/Layout/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const baseUrl = 'https://irregulas.ryan-jasinski.com';
// Metadata is used for SEO and social sharing. It can be overridden in individual pages.
// TODO Fill in the blanks
export const metadata: Metadata = {
  title: {
    default: 'The Irregular Sports Show',
    template: '%s | The Irregular Sports Show',
  },
  description:
    'A podcast covering irregular sports, latest episodes, and more.',
  keywords: ['sports podcast', 'irregular sports', 'sports show', 'podcast'],
  openGraph: {
    title: 'The Irregular Sports Show',
    description:
      'A podcast covering irregular sports, latest episodes, and more.',
    url: baseUrl,
    siteName: 'The Irregular Sports Show',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Irregular Sports Show',
    description:
      'A podcast covering irregular sports, latest episodes, and more.',
  },
};

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'PodcastSeries',
              name: 'The Irregular Sports Show',
              url: baseUrl,
              description: 'A podcast covering irregular sports.',
            }),
          }}
        />
      </head>
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
