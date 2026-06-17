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
import { ThemeToggle } from '@/components/theme-toggle';
import { ReleaseSidebar } from '@/components/releases/release-sidebar';
import { ReleaseList } from '@/components/releases/release-list';
import { AlertCircle, Menu } from 'lucide-react';

export function ReleaseNotesClient() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50">
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 flex flex-col lg:flex-row relative">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          aria-label="Open versions menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="flex-1 px-6 py-10 lg:px-12 lg:py-12 overflow-y-auto relative">
          
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-16 relative z-20">
          {/* Top Left Logo */}
          <div className="flex items-center gap-3">
            <img src="/qtt-logo.svg" alt="QTT Logo" className="w-10 h-10" />
            <h2 className="text-lg font-mokoto uppercase tracking-wider text-gray-900 dark:text-white">Quant Trader Tools</h2>
          </div>

          {/* Top Right Actions */}
          <div>
            {siteConfig.theme.enableToggle && <ThemeToggle />}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
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
        <ReleaseSidebar 
          releases={releases} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
    );
  }

  // Single column layout (no sidebar)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 relative">
      <div className="max-w-5xl mx-auto px-8 py-12 lg:px-12 relative">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-16 relative z-20">
          {/* Top Left Logo */}
          <div className="flex items-center gap-3">
            <img src="/qtt-logo.svg" alt="QTT Logo" className="w-10 h-10" />
            <h2 className="text-lg font-mokoto uppercase tracking-wider text-gray-900 dark:text-white">Quant Trader Tools</h2>
          </div>

          {/* Top Right Actions */}
          <div>
            {siteConfig.theme.enableToggle && <ThemeToggle />}
          </div>
        </div>

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
