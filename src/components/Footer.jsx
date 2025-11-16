import {
  FaFacebook,
  FaInstagram,
  FaThreads,
  FaXTwitter,
  FaTiktok,
  FaPinterest,
  FaYoutube,
} from 'react-icons/fa6';

const socials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/framevist/',
    overlay: 'bg-blue-500',
    Icon: FaFacebook,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/framevist/',
    overlay: 'bg-gradient-to-bl from-purple-500 via-pink-500 to-yellow-500',
    Icon: FaInstagram,
  },
  {
    name: 'Threads',
    href: 'https://www.threads.net/@framevist',
    overlay: 'bg-black',
    Icon: FaThreads,
  },
  {
    name: 'X',
    href: 'https://x.com/framevist',
    overlay: 'bg-black',
    Icon: FaXTwitter,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@framevist',
    overlay: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-black to-red-600',
    Icon: FaTiktok,
  },
  {
    name: 'Pinterest',
    href: 'https://www.pinterest.com/framevist/',
    overlay: 'bg-red-600',
    Icon: FaPinterest,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@framevist',
    overlay: 'bg-[#FF3000]',
    Icon: FaYoutube,
  },
];

const Footer = () => (
  <footer className="mt-16 border-t border-gray-200 bg-white text-ink">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-display text-lg tracking-[0.35em] text-gray-900">Frame Vist</p>
        <p className="mt-2 text-sm text-slate-500">
          © {new Date().getFullYear()} Frame Vist Studio · Future-forward AI capsules.
        </p>
      </div>
      <div className="bg-white w-full h-auto py-8 flex items-center justify-center gap-4 flex-wrap">
        {socials.map(({ name, href, Icon, overlay }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={name}
            className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-full bg-white shadow-md shadow-gray-200 group transition-all duration-300"
          >
            <Icon className="relative z-10 text-[1.15rem] text-gray-900 transition-colors duration-300 group-hover:text-white" />
            <span
              className={`absolute top-full left-0 w-full h-full rounded-full ${overlay} z-0 transition-all duration-500 group-hover:top-0`}
            />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
