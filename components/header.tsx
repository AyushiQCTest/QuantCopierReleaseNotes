/**
 * Header Component
 * Main site header with navigation and theme toggle
 */

'use client';

import { siteConfig } from '@/config/site.config';
import { ThemeToggle } from './theme-toggle';
import { Moon, Sun, X } from 'lucide-react';

export function Header() {
  return (
    <header className="mb-16">
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex flex-col items-start animate-fade-in">
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-slate-800 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4 tracking-tight">
              Release Notes
            </h1>
            
            <p className="text-5xl md:text-6xl font-black tracking-tight mb-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="text-[#0f172a] dark:text-white">Quant</span><span className="text-[#0ea5e9]">Copier</span>
            </p>
            
            <div className="flex items-center gap-2 ml-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <img src="/discord-light.svg" alt="Discord" className="w-7 h-7 dark:hidden block" />
              <img src="/discord-dark.svg" alt="Discord" className="w-7 h-7 hidden dark:block" />
              <span className="text-xl font-light tracking-wide text-gray-600 dark:text-gray-400">Discord</span>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Stay updated with the latest features, fixes, and improvements
        </p>
      </div>
    </header>
  );
}
