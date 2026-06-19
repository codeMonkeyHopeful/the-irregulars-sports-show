import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'On the Field',
  description: 'A podcast about sports.',
};

export default function OnTheField() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">On the Field</span>
        </h1>
        <div>Photos go here</div>
      </main>
    </div>
  );
}
