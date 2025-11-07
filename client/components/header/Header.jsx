'use client';

import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { ThemeButton } from '../themeButton/themeButton';



export function Header() {
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800 sticky top-0 z-10">
      
      {/* 1. Logo */}
      <div className="logo shrink-0">
        <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          DOSRO BAZAR
        </Link>
      </div>

      {/* 2. Search Bar */}
      <div className="search-bar flex grow max-w-xl mx-10 border-2 border-orange-600 rounded-md overflow-hidden">
        <input 
          type="text" 
          placeholder='Try "Electronic Gadgets"' 
          className="grow p-2 px-4 text-base focus:outline-none dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400"
        />
        <button className="search-button bg-orange-600 hover:bg-orange-700 p-2 px-4 text-white transition-colors">
          <Search size={20} />
        </button>
      </div>

      {/* 3. User Actions (Favourite, Theme, Sign In) */}
      <nav className="user-actions flex items-center gap-4 shrink-0">
        
        {/* My Favourite Button */}
        <Link 
          href="/favourite" 
          className="group flex items-center gap-1.5 p-2 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-orange-500 transition-colors"
        >
          <Heart size={18} className="text-orange-500 group-hover:text-white transition-colors" /> 
          My Favourite
        </Link>
        
        {/* Theme Toggle Button */}
        <ThemeButton />
        
        {/* Sign In Link */}
        <Link href="../login" className="text-lg font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 transition-colors">
          Sign In
        </Link>
      </nav>
    </header>
  );
}

// components/BodyContent.jsx (Example for the rest of your page)
