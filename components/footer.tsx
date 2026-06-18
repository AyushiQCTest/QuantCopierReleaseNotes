/**
 * Footer Component
 */

'use client';

import { siteConfig } from '@/config/site.config';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 pt-12 border-t border-gray-300 dark:border-slate-700 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p className="font-medium mb-4">
        Reach out to us using our{' '}
        <a
          href="https://quanttradertools.com/#contact"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium inline-flex items-center gap-1"
        >
          Contact Form
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </p>

      <p className="mt-6 text-xs text-gray-500 dark:text-gray-500">
        © {new Date().getFullYear()} {siteConfig.branding.projectName}. All rights reserved.
      </p>
    </footer>
  );
}
