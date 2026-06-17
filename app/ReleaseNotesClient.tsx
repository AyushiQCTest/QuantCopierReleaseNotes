'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './providers/ThemeProvider';
import { ExternalLink, AlertCircle, Sun, Moon } from 'lucide-react';

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
  const toggleTheme = themeContext?.toggleTheme || (() => { });

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-gray-900 dark:text-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading release notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-gray-900 dark:text-slate-50"
      style={{ display: 'grid', gridTemplateColumns: '1fr 280px' }}
    >
      {/* Main Content */}
      <div className="px-8 py-12 overflow-y-auto lg:px-12">
        <div className="max-w-4xl">
          {/* Top Bar with Back Button and Theme Toggle */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <img src="/qtt-logo.svg" alt="QTT Logo" className="w-8 h-8" />
              <h2 className="text-lg font-mokoto text-gray-900 dark:text-white">Quant Trader Tools</h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.close()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to App</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </button>
            </div>
          </div>

          {/* Header */}
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
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">Stay updated with the latest features, fixes, and improvements to your trading signal copier</p>
            </div>
          </header>

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

          {/* Empty State */}
          {!error && releases.length === 0 && (
            <div className="text-center py-16 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No releases found yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Check back soon for updates!</p>
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
          <footer className="mt-20 pt-12 border-t border-gray-300 dark:border-slate-700 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p className="font-medium mb-4">Follow us on GitHub for the latest updates</p>
            <p>
              <a
                href="https://github.com/quanttradertools/QuantCopierUI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium inline-flex items-center gap-2"
              >
                github.com/quanttradertools
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </footer>
        </div>
      </div>

      {/* Sidebar - Versions List (Right Side) */}
      <div className="px-6 py-12 overflow-y-auto bg-white/40 dark:bg-slate-900/40 border-l border-gray-300 dark:border-slate-700 sticky top-0 h-screen hidden lg:block">
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest px-3">Versions</h2>
          {releases.map((release) => (
            <a
              key={release.version}
              href={`#${release.version}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(release.version);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50"
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
            <div className="flex items-center gap-3">
              <img src="/qtt-logo.svg" alt="QTT Logo" className="w-8 h-8" />
              <h2 className="text-lg font-mokoto text-gray-900 dark:text-white">Quant Trader Tools</h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.close()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to App</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </button>
            </div>
          </div>

          {/* Header */}
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
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">Stay updated with the latest features, fixes, and improvements to your trading signal copier</p>
            </div>
          </header>

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

          {/* Empty State */}
          {!error && releases.length === 0 && (
            <div className="text-center py-16 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No releases found yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Check back soon for updates!</p>
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
          <footer className="mt-20 pt-12 border-t border-gray-300 dark:border-slate-700 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p className="font-medium mb-4">Follow us on GitHub for the latest updates</p>
            <p>
              <a
                href="https://github.com/quanttradertools/QuantCopierUI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium inline-flex items-center gap-2"
              >
                github.com/quanttradertools
                <ExternalLink className="w-4 h-4" />
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

      {/* Card Container */}
      <div className="flex gap-6">
        {/* Timeline Dot with Gradient */}
        <div className="flex flex-col items-center">
          <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
            <span className="text-xl">🚀</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-slate-950/50">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  v{release.version}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">{release.title}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {release.prerelease && (
                  <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-300 dark:border-yellow-700/50 uppercase tracking-wide">
                    Pre-release
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-slate-600">
                  {release.date}
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-5">
              {release.features && release.features.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 dark:from-emerald-900/20 to-transparent rounded-lg p-4 border border-emerald-200 dark:border-emerald-800/30">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2 text-base">
                    <span>✨</span> Features
                  </h4>
                  <ul className="space-y-2">
                    {release.features.map((feature, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex gap-3">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.fixes && release.fixes.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 dark:from-red-900/20 to-transparent rounded-lg p-4 border border-red-200 dark:border-red-800/30">
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2 text-base">
                    <span>🐛</span> Bug Fixes
                  </h4>
                  <ul className="space-y-2">
                    {release.fixes.map((fix, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex gap-3">
                        <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.improvements && release.improvements.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 dark:from-amber-900/20 to-transparent rounded-lg p-4 border border-amber-200 dark:border-amber-800/30">
                  <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2 text-base">
                    <span>⚡</span> Improvements
                  </h4>
                  <ul className="space-y-2">
                    {release.improvements.map((improvement, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex gap-3">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Link to Full Release */}
            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-slate-700">
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
