'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-serif font-bold text-[#0A1128] dark:text-white hover:opacity-80 transition-opacity">
            Firabyte
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/posts" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#0A1128] dark:hover:text-white transition-colors">
              Posts
            </Link>
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#0A1128] dark:hover:text-white transition-colors">
              About
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-600 dark:text-gray-300 hover:text-[#0A1128] dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}