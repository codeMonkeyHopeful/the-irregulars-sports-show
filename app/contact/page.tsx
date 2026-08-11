import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'A podcast about sports.',
};

export default function ContactUs() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">Contact Us</span>
        </h1>
        <div>
          Let us know what you think! We would love to hear from you. Please
          reach out to us with any questions, comments, or feedback.
          <div className="mt-4 text-center">
            <a
              href="mailto:contact@irregulars-sports.com?subject=Customer%20Contact%20Request"
              className="text-2xl font-bold text-blue-500 hover:underline"
            >
              contact@irregulars-sports.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
