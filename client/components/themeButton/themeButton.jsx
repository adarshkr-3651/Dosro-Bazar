'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-1.5 p-2 px-3 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:text-gray-200">
        Loading...
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const Icon = theme === 'dark' ? Sun : Moon;
  const label = theme === 'dark' ? 'Light Theme' : 'Dark Theme';

  return (
    <button
      className="nav-button flex items-center gap-1.5 p-2 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-orange-500 transition-colors"
      onClick={toggleTheme}
      aria-label={`Switch to ${label}`}
    >
      <Icon size={18} className="text-orange-500 group-hover:text-white dark:text-orange-300" />
      {label}
    </button>
  );
}