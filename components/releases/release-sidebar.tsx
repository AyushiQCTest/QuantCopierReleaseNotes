/**
 * Release Sidebar Component
 * Displays list of all releases for navigation
 */

'use client';

import { Release } from '@/lib/github';
import { siteConfig } from '@/config/site.config';

interface ReleaseSidebarProps {
  releases: Release[];
}

export function ReleaseSidebar({ releases }: ReleaseSidebarProps) {
  const handleScroll = (version: string) => {
    const element = document.getElementById(`release-${version}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="px-6 py-12 overflow-y-auto bg-gray-50 dark:bg-slate-900/50 border-r border-gray-300 dark:border-slate-700 h-screen sticky top-0">
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
        {siteConfig.releases.perPage ? 'Versions' : 'All Releases'}
      </h2>
      
      <div className="space-y-2">
        {releases.map((release) => (
          <button
            key={release.version}
            onClick={() => handleScroll(release.version)}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors truncate"
            title={`v${release.version} - ${release.title}`}
          >
            <span className="font-semibold">v{release.version}</span>
            {release.prerelease && (
              <span className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-900/50 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-300">
                beta
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
