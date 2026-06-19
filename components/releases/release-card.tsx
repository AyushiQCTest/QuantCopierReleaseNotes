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
    <div className="relative animate-fade-in" id={`release-${release.version}`}>
      {/* Timeline Line */}
      {!isFirst && (
        <div className="absolute left-6 top-0 w-0.5 h-8 bg-gradient-to-b from-gray-300 dark:from-slate-700 to-transparent -translate-y-8"></div>
      )}

      {/* Card Container */}
      <div className="flex gap-6">
        {/* Timeline Dot with Gradient */}
        <div className="flex flex-col items-center">
          <div className="relative z-10 w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-sm transition-all duration-200">
            <span className="text-xl">🚀</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  v{release.version}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  {release.title}
                </p>
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
              {Object.entries(release.sections).map(([sectionKey, items]) => {
                const config = releaseConfig.sections[sectionKey as keyof typeof releaseConfig.sections];
                if (!config || items.length === 0) return null;

                const bgGradient = 
                  sectionKey === 'features' ? 'from-emerald-50 dark:from-emerald-900/20' :
                  sectionKey === 'fixes' ? 'from-red-50 dark:from-red-900/20' :
                  'from-amber-50 dark:from-amber-900/20';

                const borderColor =
                  sectionKey === 'features' ? 'border-emerald-200 dark:border-emerald-800/30' :
                  sectionKey === 'fixes' ? 'border-red-200 dark:border-red-800/30' :
                  'border-amber-200 dark:border-amber-800/30';

                const bulletColor =
                  sectionKey === 'features' ? 'text-emerald-600 dark:text-emerald-400' :
                  sectionKey === 'fixes' ? 'text-red-600 dark:text-red-400' :
                  'text-amber-600 dark:text-amber-400';

                return (
                  <div key={sectionKey} className={`bg-gradient-to-br ${bgGradient} to-transparent rounded-lg p-4 border ${borderColor}`}>
                    <h4 className={`font-bold ${config.textColor} mb-3 flex items-center gap-2 text-base`}>
                      <span>{config.icon}</span>
                      {config.label}
                    </h4>
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex gap-3">
                          <span className={`${bulletColor} font-bold`}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
