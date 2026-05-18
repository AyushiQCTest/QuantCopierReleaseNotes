'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './providers/ThemeProvider';
import { ChevronDown, ChevronUp, ExternalLink, Check, AlertCircle, Zap, Sun, Moon } from 'lucide-react';

interface Release {
  version: string;
  title: string;
  date: string;
  prerelease: boolean;
  draft: boolean;
  features?: string[];
  fixes?: string[];
  improvements?: string[];
  url: string;
  body: string;
}

interface ReleasesData {
  releases: Release[];
}

export function ReleaseNotesClient() {
  const [mounted, setMounted] = useState(false);
  
  // Get theme only after mount to avoid hydration mismatch
  const themeContext = mounted ? useTheme() : null;
  const theme = themeContext?.theme || 'light';
  const toggleTheme = themeContext?.toggleTheme || (() => {});
  
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadReleases() {
      try {
        setLoading(true);
        const response = await fetch('/releases.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch releases: ${response.statusText}`);
        }

        const data: ReleasesData = await response.json();
        setReleases(data.releases || []);
        // Expand first release by default
        if (data.releases && data.releases.length > 0) {
          setExpandedVersion(data.releases[0].version);
        }
      } catch (err) {
        console.error('Error loading releases:', err);
        setError(err instanceof Error ? err.message : 'Failed to load releases');
      } finally {
        setLoading(false);
      }
    }

    loadReleases();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading release notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 grid grid-cols-sidebar">
      {/* Sidebar - Versions List */}
      <div className="px-6 py-12 overflow-y-auto bg-gray-50 dark:bg-slate-900/50 border-r border-gray-300 dark:border-slate-700">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Versions</h2>
        <div className="space-y-2">
          {releases.map((release) => (
            <a
              key={release.version}
              href={`#${release.version}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(release.version);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
            >
              Version {release.version}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12 overflow-y-auto max-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Top Bar with Back Button and Theme Toggle */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => window.close()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to App</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold text-black dark:text-white mb-4">
              Release Notes
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold mb-2">QuantCopier</p>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest features, fixes, and improvements</p>
          </header>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-lg p-5 mb-8 text-red-800 dark:text-red-300">
              <p className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Error Loading Releases
              </p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!error && releases.length === 0 && (
            <div className="text-center py-16 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-300 dark:border-slate-700">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No releases found yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Check back soon for updates!</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-4">Follow us on <a href="https://github.com/quanttradertools" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a> for announcements</p>
            </div>
          )}

          {/* Timeline */}
          {releases.length > 0 && (
            <div className="space-y-8">
              {releases.map((release, index) => (
                <ReleaseCard key={release.version} release={release} isFirst={index === 0} />
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-300 dark:border-slate-700 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p className="font-medium">Follow us on GitHub for the latest updates</p>
            <p className="mt-2">
              <a 
                href="https://github.com/quanttradertools/QuantCopierUI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
              >
                github.com/quanttradertools
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ReleaseCard({ release, isFirst }: { release: Release; isFirst: boolean }) {
  return (
    <div className="relative" id={release.version}>
      {/* Timeline Line */}
      {!isFirst && (
        <div className="absolute left-6 top-0 w-0.5 h-8 bg-gradient-to-b from-gray-300 dark:from-slate-700 to-transparent -translate-y-8"></div>
      )}

      {/* Card */}
      <div className="flex gap-6">
        {/* Timeline Dot */}
        <div className="flex flex-col items-center">
          <div className="relative z-10 w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-xl">🚀</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-6 hover:border-gray-400 dark:hover:border-slate-600 transition-colors shadow-sm dark:shadow-slate-950">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white">v{release.version} #</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{release.title}</p>
              </div>
              <div className="flex gap-2">
                {release.prerelease && (
                  <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-300 dark:border-yellow-800">
                    Pre-release
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-slate-700">
                  {release.date}
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {release.features && release.features.length > 0 && (
                <div>
                  <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2 text-base">
                    <span>✨</span> Features
                  </h4>
                  <ul className="space-y-2.5 ml-12 pl-6">
                    {release.features.map((feature, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.fixes && release.fixes.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2 text-base">
                    <span>🐛</span> Bug Fixes
                  </h4>
                  <ul className="space-y-2.5 ml-12 pl-6">
                    {release.fixes.map((fix, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed">
                        • {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.improvements && release.improvements.length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2 text-base">
                    <span>⚡</span> Improvements
                  </h4>
                  <ul className="space-y-2.5 ml-12 pl-6">
                    {release.improvements.map((improvement, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Link to Full Release */}
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-slate-700">
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View on GitHub
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
