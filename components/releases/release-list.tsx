/**
 * Release List Component
 * Displays all releases in timeline format
 */

'use client';

import { Release } from '@/lib/github';
import { ReleaseCard } from './release-card';

interface ReleaseListProps {
  releases: Release[];
}

export function ReleaseList({ releases }: ReleaseListProps) {
  if (releases.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-300 dark:border-slate-700">
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
          No releases found yet
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Check back soon for updates!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {releases.map((release, index) => (
        <ReleaseCard
          key={release.version}
          release={release}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
}
