'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  // This is a no-op effect that React knows how to handle
  // The empty array ensures it only runs once
  useState(() => {
    setMounted(true);
  });
  return mounted;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}