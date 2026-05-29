import { BioCard } from '@/components/About/BioCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Team',
  description: 'A podcast about sports.',
};

const teamMembers = [
  {
    name: 'Coach',
    title: 'Former Head Coach for Kamiak J.V. Football',
    photoSrc: '/profile-coach.jpeg',
    bio: 'Placeholder bio.',
  },
  {
    name: 'Luke 3:16',
    photoSrc: '/profile-luke316.jpeg',
    bio: 'Placeholder bio.',
  },
  {
    name: 'Blymm',
    photoSrc: '/profile-blymm.png',
    bio: 'Placeholder bio.',
  },
  {
    name: 'ZeeFeezee',
    photoSrc: '/profile-ZeeFeezee.jpeg',
    bio: 'Placeholder bio.',
  },
  {
    name: 'codeMonkeyHopeful',
    title: 'Head Dev in Charge (yup HDIC)',
    photoSrc: '/profile-ryan.jpg',
    teams: 'The fuck is a team? Ohhh, ohh, sports, go team!',
    bio: 'Grew up in Ohio, went to OSU, married a wolverine... Love all things tech!  Built this site and love the crew!',
    quote:
      'There are only two mistakes one can make along the road to truth; not going all the way, and not starting.',
  },
];
export default function About() {
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
                title={member.title}
                teams={member.teams}
                photoSrc={member.photoSrc}
                bio={member.bio}
                quote={member.quote}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
