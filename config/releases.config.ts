/**
 * Release-specific configuration
 * Customize how releases are displayed and parsed
 */

export const releaseConfig = {
  // Section identifiers in GitHub release body
  sections: {
    features: {
      heading: '## Features',
      icon: '✨',
      color: 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-400',
      label: 'Features',
    },
    fixes: {
      heading: '## Bug Fixes',
      icon: '🐛',
      color: 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800',
      textColor: 'text-red-700 dark:text-red-400',
      label: 'Bug Fixes',
    },
    improvements: {
      heading: '## Improvements',
      icon: '⚡',
      color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800',
      textColor: 'text-amber-700 dark:text-amber-400',
      label: 'Improvements',
    },
    breaking: {
      heading: '## Breaking Changes',
      icon: '⚠️',
      color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800',
      textColor: 'text-purple-700 dark:text-purple-400',
      label: 'Breaking Changes',
    },
    security: {
      heading: '## Security',
      icon: '🔒',
      color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800',
      textColor: 'text-orange-700 dark:text-orange-400',
      label: 'Security',
    },
  },

  // Date formatting
  dateFormat: {
    locale: 'en-US',
    options: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
  },

  // Timeline dot styling
  timeline: {
    iconSize: 'w-12 h-12',
    dotColor: 'bg-blue-500 dark:bg-blue-600',
    lineColor: 'from-gray-300 dark:from-slate-700',
  },
};

export type ReleaseConfig = typeof releaseConfig;
