import { BioCard } from '@/components/About/BioCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Team',
  description: 'A podcast about sports.',
};

const teamMembers = [
  {
    name: 'Dick Smith',
    photoSrc: '',
    bio: 'Dick is a sports journalist with 15 years of experience covering major sporting events',
  },
  {
    name: 'Carlos "Da Gobbler" Rodriguez',
    photoSrc: '',
    bio: 'Carlos is a sports analyst with a passion for uncovering the stories behind the games while getting behind the boys in the locker room.',
  },
  {
    name: 'Haywood Jablowme',
    photoSrc: '',
    bio: 'Haywood is a senior engineer with 10 years of experience building distributed systems keeping this site alive.',
  },
];
export default function SpotifyLatest() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="title">About the Team</span>
        </h1>
        <div>
          <p className="text-lg text-white/70 max-w-auto text-center pb-20">
            We are a group of sports enthusiasts who love to talk about the
            latest news and trends in the world of sports.
            <br />
            We started this podcast as a way to share our passion for sports
            with others and to connect with like-minded individuals.
            <br />
            <br />
            <strong>
              Oh yeah and sometimes we have a few drinks and banter at one
              another.
            </strong>
          </p>
          <div className="flex flex-col gap-6 mt-4">
            {teamMembers.map((member) => (
              <BioCard
                key={member.name}
                name={member.name}
                photoSrc={member.photoSrc}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
