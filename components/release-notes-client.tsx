/**
 * Main Release Notes Client Component
 * Orchestrates all UI components and data fetching
 */

'use client';

import { useEffect, useState } from 'react';
import { fetchGitHubReleases, Release } from '@/lib/github';
import { sortReleases } from '@/lib/utils';
import { siteConfig } from '@/config/site.config';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ReleaseSidebar } from '@/components/releases/release-sidebar';
import { ReleaseList } from '@/components/releases/release-list';
import { AlertCircle } from 'lucide-react';

export function ReleaseNotesClient() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReleases() {
      try {
        setLoading(true);
        const data = await fetchGitHubReleases();
        
        // Filter out prerelease if configured
        const filtered = siteConfig.releases.showPrerelease
          ? data
          : data.filter(r => !r.prerelease);

        // Sort according to config
        const sorted = sortReleases(
          filtered,
          siteConfig.releases.sortBy,
          siteConfig.releases.sortOrder
        );

        setReleases(sorted);
      } catch (err) {
        console.error('Error loading releases:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load releases'
        );
      } finally {
        setLoading(false);
      }
    }

    loadReleases();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-gray-900 dark:text-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading release notes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main layout with sidebar
  if (siteConfig.sidebar.enabled) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-gray-900 dark:text-slate-50"
        style={{ display: 'grid', gridTemplateColumns: `1fr ${siteConfig.sidebar.width}` }}
      >
        {/* Main Content */}
        <div className="px-8 py-12 overflow-y-auto lg:px-12">
          <div className="max-w-4xl">
            <Header />

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl p-5 mb-8 text-red-800 dark:text-red-300 shadow-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Error Loading Releases
                </p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            )}

            {/* Releases */}
            <ReleaseList releases={releases} />

            {/* Footer */}
            <Footer />
          </div>
        </div>

        {/* Sidebar - Versions (Right Side) */}
        <ReleaseSidebar releases={releases} />
      </div>
    );
  }

  // Single column layout (no sidebar)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-gray-900 dark:text-slate-50">
      <div className="max-w-4xl mx-auto px-8 py-12 lg:px-12">
        <Header />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl p-5 mb-8 text-red-800 dark:text-red-300 shadow-sm">
            <p className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Loading Releases
            </p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* Releases */}
        <ReleaseList releases={releases} />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
