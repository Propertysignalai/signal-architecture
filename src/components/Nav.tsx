'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Pipeline' },
  { href: '/philosophy', label: 'Evolution' },
  { href: '/status', label: 'Roadmap' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center px-3 md:px-6 gap-0.5 md:gap-1 shrink-0 h-12 md:h-14 overflow-x-auto scrollbar-hide sticky top-0 z-50">
      <span className="text-white font-bold text-sm md:text-lg mr-2 md:mr-6 tracking-tight whitespace-nowrap flex items-center gap-1.5">
        <span className="text-[#3A76F0]">⚡</span> Signal V2
      </span>
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              active
                ? 'bg-[#3A76F0] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
