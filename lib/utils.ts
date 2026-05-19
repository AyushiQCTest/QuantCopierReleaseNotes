/**
 * General utilities
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function sortReleases(
  releases: any[],
  sortBy: 'date' | 'version' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const sorted = [...releases].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'version') {
      comparison = compareVersions(a.version, b.version);
    } else {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }

  return 0;
}
