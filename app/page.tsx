'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Check, AlertCircle, Zap } from 'lucide-react';

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

export default function Home() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Loading release notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.close()}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to App</span>
        </button>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            QuantCopier
          </h1>
          <p className="text-2xl text-slate-300 mb-2">Release Notes & Changelog</p>
          <p className="text-slate-400">Stay updated with the latest features, fixes, and improvements</p>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5 mb-8 text-red-200">
            <p className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Loading Releases
            </p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && releases.length === 0 && (
          <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-lg mb-2">No releases found yet</p>
            <p className="text-slate-500 text-sm">Check back soon for updates!</p>
            <p className="text-slate-600 text-xs mt-4">Follow us on <a href="https://github.com/quanttradertools" className="text-blue-400 hover:underline">GitHub</a> for announcements</p>
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
        <footer className="mt-16 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>Follow us on GitHub for the latest updates</p>
          <p className="mt-2">
            <a 
              href="https://github.com/quanttradertools/QuantCopierUI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              github.com/quanttradertools
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function ReleaseCard({ release, isFirst }: { release: Release; isFirst: boolean }) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      {!isFirst && (
        <div className="absolute left-6 top-0 w-0.5 h-8 bg-gradient-to-b from-slate-600 to-transparent -translate-y-8"></div>
      )}

      {/* Card */}
      <div className="flex gap-6">
        {/* Timeline Dot */}
        <div className="flex flex-col items-center">
          <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-xl">🚀</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-2xl font-bold text-blue-400">v{release.version}</h3>
                <p className="text-sm text-slate-400 mt-1">{release.title}</p>
              </div>
              <div className="flex gap-2">
                {release.prerelease && (
                  <span className="px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                    Pre-release
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold bg-slate-700 text-slate-300 rounded-full">
                  {release.date}
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {release.features && release.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <span>✨</span> Features
                  </h4>
                  <ul className="space-y-1 ml-6">
                    {release.features.map((feature, i) => (
                      <li key={i} className="text-slate-300 text-sm">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.fixes && release.fixes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <span>🐛</span> Bug Fixes
                  </h4>
                  <ul className="space-y-1 ml-6">
                    {release.fixes.map((fix, i) => (
                      <li key={i} className="text-slate-300 text-sm">
                        • {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.improvements && release.improvements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <span>⚡</span> Improvements
                  </h4>
                  <ul className="space-y-1 ml-6">
                    {release.improvements.map((improvement, i) => (
                      <li key={i} className="text-slate-300 text-sm">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Link to Full Release */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
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
