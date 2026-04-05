'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, BookOpen, Settings } from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { href: '/editor', label: 'Editor', icon: Code2 },
  { href: '/problems', label: 'Problems', icon: BookOpen },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 px-4 py-2 bg-zinc-900 border-b border-zinc-800 h-12">
      {/* Logo */}
      <Link href="/editor" className="flex items-center gap-2 mr-6">
        <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
          <Code2 size={14} className="text-zinc-950" />
        </div>
        <span className="font-mono font-bold text-sm tracking-tight">
          dsa<span className="text-emerald-400">.run</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            )}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}