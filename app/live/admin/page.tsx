import { Metadata } from 'next';
import { LiveAdmin } from './LiveAdmin';

export const metadata: Metadata = {
  title: 'Live Admin',
  description: 'Live show administration.',
};

export default function LiveAdminPage() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
          <span className="title">Live Admin</span>
        </h1>

        <LiveAdmin />
      </main>
    </div>
  );
}
