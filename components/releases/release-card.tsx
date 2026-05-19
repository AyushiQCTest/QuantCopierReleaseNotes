/**
 * Release Card Component
 * Displays individual release with timeline marker
 */

'use client';

import { Release } from '@/lib/github';
import { releaseConfig } from '@/config/releases.config';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ReleaseCardProps {
  release: Release;
  isFirst: boolean;
}

export function ReleaseCard({ release, isFirst }: ReleaseCardProps) {
  return (
    <div className="relative" id={`release-${release.version}`}>
      {/* Timeline Line */}
      {!isFirst && (
        <div className="absolute left-6 top-0 w-0.5 h-8 bg-gradient-to-b from-gray-300 dark:from-slate-700 to-transparent -translate-y-8"></div>
      )}

      {/* Card Container */}
      <div className="flex gap-6">
        {/* Timeline Dot */}
        <div className="flex flex-col items-center">
          <div className={`relative z-10 ${releaseConfig.timeline.iconSize} rounded-full ${releaseConfig.timeline.dotColor} flex items-center justify-center shadow-lg`}>
            <span className="text-xl">🚀</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-6 hover:border-gray-400 dark:hover:border-slate-600 transition-colors shadow-sm dark:shadow-slate-950">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  v{release.version}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {release.title}
                </p>
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
              {Object.entries(release.sections).map(([sectionKey, items]) => {
                const config = releaseConfig.sections[sectionKey as keyof typeof releaseConfig.sections];
                if (!config || items.length === 0) return null;

                return (
                  <div key={sectionKey}>
                    <h4 className={`font-bold ${config.textColor} mb-3 flex items-center gap-2 text-base`}>
                      <span>{config.icon}</span>
                      {config.label}
                    </h4>
                    <ul className="space-y-2.5 ml-12 pl-6">
                      {items.map((item, i) => (
                        <li
                          key={i}
                          className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Link to Full Release */}
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-slate-700">
              <Link
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
