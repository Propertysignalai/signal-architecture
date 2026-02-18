'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Pipeline' },
  { href: '/philosophy', label: 'Evolution' },
  { href: '/agents', label: 'Agents' },
  { href: '/bias-protection', label: 'Bias' },
  { href: '/data-flow', label: 'Data Flow' },
  { href: '/status', label: 'Status' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 flex items-center px-3 md:px-6 gap-0.5 md:gap-1 shrink-0 h-12 md:h-16 overflow-x-auto scrollbar-hide">
      <span className="text-white font-bold text-sm md:text-lg mr-2 md:mr-6 tracking-tight whitespace-nowrap">Signal V2</span>
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              active
                ? 'bg-indigo-600 text-white'
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
