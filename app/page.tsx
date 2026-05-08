import logo from '@/public/logo.jpg';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">The Irregular Sports Show</span>
        </h1>

        <Image
          src={logo}
          width={500}
          height={500}
          alt="Logo of The Irregular Sports Show"
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {`I'm a footer`}
      </footer>
    </div>
  );
}
