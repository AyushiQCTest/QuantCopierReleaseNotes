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
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-6xl font-bold text-black dark:text-white">
          Release Notes
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold mb-2 mt-2">
          {siteConfig.branding.projectName}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest features, fixes, and improvements
        </p>
      </div>

      <div className="flex gap-3">
        {siteConfig.nav.backButtonUrl ? (
          <a
            href={siteConfig.nav.backButtonUrl}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
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
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
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
