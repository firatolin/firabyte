'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, LogOut, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!mounted) return null;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-serif font-bold hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            Firabyte
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/posts" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Posts
            </Link>
            <Link 
              href="/categories" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/tags" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tags
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            
            {/* Search - Desktop */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-36 lg:w-48 px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                onFocus={() => window.location.href = '/search'}
              />
            </div>
            
            {/* Manage Posts - Only visible to admin */}
            {session?.user?.email === 'firatolesayas@gmail.com' && (
              <Link 
                href="/manage-posts" 
                className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors"
              >
                Manage
              </Link>
            )}
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{session.user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme toggle - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="h-9 w-9"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5 duration-200">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/posts" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
                onClick={closeMobileMenu}
              >
                Posts
              </Link>
              <Link 
                href="/categories" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
              <Link 
                href="/tags" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
                onClick={closeMobileMenu}
              >
                Tags
              </Link>
              <Link 
                href="/about" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
                onClick={closeMobileMenu}
              >
                About
              </Link>

              {/* Search - Mobile */}
              <div className="relative px-2 py-1.5">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  onFocus={() => {
                    closeMobileMenu();
                    window.location.href = '/search';
                  }}
                />
              </div>

              {session?.user?.email === 'firatolesayas@gmail.com' && (
                <Link 
                  href="/manage-posts" 
                  className="text-sm bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
                  onClick={closeMobileMenu}
                >
                  Manage Posts
                </Link>
              )}

              <div className="border-t border-border pt-3 mt-1">
                {session ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{session.user?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        closeMobileMenu();
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth/signin" 
                    className="block text-sm text-center bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}