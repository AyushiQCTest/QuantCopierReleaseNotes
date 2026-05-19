/**
 * Footer Component
 */

'use client';

import { siteConfig } from '@/config/site.config';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-300 dark:border-slate-700 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p className="font-medium mb-4">
        Follow us for the latest updates
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        {siteConfig.social.github && (
          <Link
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            GitHub
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}

        {siteConfig.social.docs && (
          <Link
            href={siteConfig.social.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            Documentation
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}

        {siteConfig.social.support && (
          <Link
            href={siteConfig.social.support}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            Support
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} {siteConfig.branding.projectName}. All rights reserved.
      </p>
    </footer>
  );
}
