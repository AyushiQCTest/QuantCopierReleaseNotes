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
          <h1 className="text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Release Notes
          </h1>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{siteConfig.branding.projectName}</p>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Stay updated with the latest features, fixes, and improvements
        </p>
      </div>

      <div className="flex gap-3 mt-8">
        {siteConfig.nav.backButtonUrl ? (
          <a
            href={siteConfig.nav.backButtonUrl}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>{siteConfig.nav.backButtonText}</span>
          </a>
        ) : (
          <button
            onClick={() => window.close()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        )}

        {siteConfig.theme.enableToggle && <ThemeToggle />}
      </div>
    </header>
  );
}
