"use client";

import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

export function ThemeButton(): JSX.Element {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const onToggle = () => {
    toggleTheme();
  };

  const Icon = theme === 'dark' ? Sun : Moon;
  const label = theme === 'dark' ? 'Light Theme' : 'Dark Theme';

  return (
    <button
      className="nav-button flex items-center gap-1.5 p-2 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-orange-500 transition-colors"
      onClick={onToggle}
      aria-label={`Switch to ${label}`}>
      <Icon size={18} className="text-orange-500 group-hover:text-white dark:text-orange-300" />
      {label}
    </button>
  );
}
