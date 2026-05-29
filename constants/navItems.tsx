import { Home, Info, Music2, Play } from 'lucide-react';

export const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Latest Episode', icon: Play, href: '/episodes/latest' },
  {
    label: 'Spotify',
    icon: Music2,
    href: 'https://open.spotify.com/show/6EwXjHiWsRiE9SE8GuJJv4',
  },
  { label: 'About', icon: Info, href: '/about' },
];
