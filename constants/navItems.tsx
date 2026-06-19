import { Home, Image, Music2, Play, Send, Users } from 'lucide-react';

export const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Latest Episode', icon: Play, href: '/episodes/latest' },
  {
    label: 'Spotify',
    icon: Music2,
    href: 'https://open.spotify.com/show/6EwXjHiWsRiE9SE8GuJJv4',
  },
  { label: 'The Team', icon: Users, href: '/team' },
  { label: 'On the Field', icon: Image, href: '/field' },
  { label: 'Contact Us', icon: Send, href: '/contact' },
];
