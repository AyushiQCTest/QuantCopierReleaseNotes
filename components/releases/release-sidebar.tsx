/**
 * Release Sidebar Component
 * Displays list of all releases for navigation
 */

'use client';

import { Release } from '@/lib/github';
import { siteConfig } from '@/config/site.config';

import { X } from 'lucide-react';

interface ReleaseSidebarProps {
  releases: Release[];
  isOpen: boolean;
  onClose: () => void;
}

export function ReleaseSidebar({ releases, isOpen, onClose }: ReleaseSidebarProps) {
  const handleScroll = (version: string) => {
    const element = document.getElementById(`release-${version}`);
    element?.scrollIntoView({ behavior: 'smooth' });
    onClose(); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 right-0 h-screen w-64 lg:w-[256px]
        px-6 py-8 lg:py-12 overflow-y-auto bg-white dark:bg-slate-950 
        border-l border-slate-200 dark:border-slate-800 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-6 lg:mb-4">
          <h2 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest px-3">
            {siteConfig.releases.perPage ? 'Versions' : 'All Releases'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      
      <div className="space-y-2">
        {releases.map((release) => (
          <button
            key={release.version}
            onClick={() => handleScroll(release.version)}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 border border-transparent truncate"
            title={`v${release.version} - ${release.title}`}
          >
            <span className="font-semibold">v{release.version}</span>
            {release.prerelease && (
              <span className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-900/50 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-300">
                beta
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
    </>
  );
}
