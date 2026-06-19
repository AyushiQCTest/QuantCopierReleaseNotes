/**
 * Header Component
 * Main site header with navigation and theme toggle
 */

'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site.config';
import { ThemeToggle } from './theme-toggle';
import { Moon, Sun, X } from 'lucide-react';

export function Header() {
  const getTelegramStyles = () => {
    return { width: '150px', opacity: 1 }; 
  };

  return (
    <header>
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-col items-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-0 tracking-tight">
            Release Notes
          </h1>
          
          <div className="flex items-center justify-center -mt-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-center">
              <img src="/QCT_Logo_Light.svg" alt="QCT Logo" style={getTelegramStyles()} className="h-auto dark:hidden block object-contain transition-all duration-300" />
              <img src="/QCT_Logo_Dark.svg" alt="QCT Logo" style={getTelegramStyles()} className="h-auto hidden dark:block object-contain transition-all duration-300" />
            </div>
          </div>
        </div>
        <p className="text-sm -mt-10 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest features, fixes, and improvements
        </p>
      </div>
    </header>
  );
}
