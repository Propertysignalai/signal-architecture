'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Pipeline' },
  { href: '/philosophy', label: 'Evolution' },
  { href: '/agents', label: 'Agents' },
  { href: '/bias-protection', label: 'Bias Protection' },
  { href: '/data-flow', label: 'Data Flow' },
  { href: '/status', label: 'Status' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6 gap-1 shrink-0">
      <span className="text-white font-bold text-lg mr-6 tracking-tight">Signal V2</span>
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
