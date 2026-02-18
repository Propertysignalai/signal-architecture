'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="bg-[#0a0b0f]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center px-4 md:px-8 gap-1 shrink-0 h-14 sticky top-0 z-50">
      <Link href="/" className="text-white font-bold text-base md:text-lg mr-auto tracking-tight flex items-center gap-2">
        <span className="text-[#3A76F0]">⚡</span> Signal V2
      </Link>
      <Link
        href="/philosophy"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          pathname === '/philosophy' ? 'bg-[#3A76F0] text-white' : 'text-[#8b8d97] hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        Evolution
      </Link>
      <a
        href="https://github.com/Propertysignalai/signal-architecture"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-md text-sm font-medium text-[#8b8d97] hover:text-white hover:bg-white/[0.06] transition-colors"
      >
        GitHub
      </a>
    </nav>
  );
}
