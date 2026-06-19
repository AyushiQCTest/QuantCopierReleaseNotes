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
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50">
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
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 flex flex-col lg:flex-row relative">
        

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
          
        {/* Header Section (Blue Background) */}
        <div className="w-full relative z-20 border-b border-blue-100 dark:border-slate-800 bg-[#f4f9ff] dark:bg-slate-900/50">
          {/* Top Navigation Bar */}
          <div className="w-full px-6 py-2 md:px-10 flex justify-between items-center">
            {/* Top Left Logo */}
            <div className="flex items-center gap-3">
              <img src="/qtt-logo.svg" alt="QTT Logo" className="w-10 h-10" />
              <h2 className="text-lg font-mokoto uppercase tracking-wider text-gray-900 dark:text-white">Quant Trader Tools</h2>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a 
                href="https://qc-discord-releasenotes.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/20"
              >
                Go to QCDiscord ReleaseNotes
              </a>
              <a 
                href="https://qc-discord-releasenotes.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="sm:hidden text-xs font-medium px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/20"
              >
                QCDiscord
              </a>
              {siteConfig.theme.enableToggle && <ThemeToggle />}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                aria-label="Open versions menu"
              >
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Header Content */}
          <div className="max-w-5xl mx-auto px-8 pb-4 pt-0 lg:px-12">
            <Header />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-6 lg:px-12 w-full flex-1">

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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 relative flex flex-col">
      {/* Header Section (Blue Background) */}
      <div className="w-full relative z-20 border-b border-blue-100 dark:border-slate-800 bg-[#f4f9ff] dark:bg-slate-900/50">
        {/* Top Navigation Bar */}
        <div className="w-full px-6 py-2 md:px-10 flex justify-between items-center">
          {/* Top Left Logo */}
          <div className="flex items-center gap-3">
            <img src="/qtt-logo.svg" alt="QTT Logo" className="w-10 h-10" />
            <h2 className="text-lg font-mokoto uppercase tracking-wider text-gray-900 dark:text-white">Quant Trader Tools</h2>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="https://qc-discord-releasenotes.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/20"
            >
              Go to QCDiscord ReleaseNotes
            </a>
            <a 
              href="https://qc-discord-releasenotes.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="sm:hidden text-xs font-medium px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/20"
            >
              QCDiscord
            </a>
            {siteConfig.theme.enableToggle && <ThemeToggle />}
          </div>
        </div>

        {/* Header Content */}
        <div className="max-w-5xl mx-auto px-8 pb-4 pt-0 lg:px-12">
          <Header />
        </div>
      </div>

      {/* Main Body Content */}
      <div className="max-w-5xl mx-auto px-8 py-6 lg:px-12 relative flex-1 w-full">

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
