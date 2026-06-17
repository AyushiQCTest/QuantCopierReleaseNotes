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
      <div className="space-y-4">
        <div>
          <h1 className="text-7xl font-black bg-gradient-to-r from-slate-800 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-2 animate-fade-in">
            Release Notes
          </h1>
          <p className="text-3xl font-bold text-gray-800 dark:text-white animate-fade-in" style={{ animationDelay: '100ms' }}>{siteConfig.branding.projectName}</p>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Stay updated with the latest features, fixes, and improvements
        </p>
      </div>
    </header>
  );
}
