import logo from '@/public/logo.png';
import spotify from '@/public/spotify.svg';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'The Irregulars Sports Show',
  description: 'A podcast about sports.',
};

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">
            We, collectively,
            <br />
            are The Irregulars...
          </span>
        </h1>
        <Image
          src={logo}
          width={500}
          height={500}
          alt="Logo of The Irregulars Sports Show"
        />
      </main>
    </div>
  );
}
