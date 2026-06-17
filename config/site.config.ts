/**
 * Site-wide configuration
 * Customize branding, metadata, and general settings here
 */

export const siteConfig = {
  name: 'QuantCopier Release Notes',
  description: 'Changelog and release information for QuantCopier MT5 Signal Copier',
  url: 'https://releases.quanttradertools.com',
  ogImage: 'https://releases.quanttradertools.com/og.png',
  
  // Branding
  branding: {
    projectName: 'QuantCopier Discord',
    tagline: 'Professional Trading Signal Copier',
    logo: null, // Optional: URL to logo
    primaryColor: '#0066ff',
  },

  // GitHub configuration
  github: {
    owner: 'AyushiQCTest',
    repo: 'QuantCopierUI',
    token: process.env.GITHUB_TOKEN, // Set via environment variable
  },

  // Theme configuration
  theme: {
    defaultMode: 'light',
    enableToggle: true,
    colors: {
      light: {
        bg: '#ffffff',
        text: '#000000',
        accent: '#0066ff',
      },
      dark: {
        bg: '#0f172a',
        text: '#f1f5f9',
        accent: '#3b82f6',
      },
    },
  },

  // Sidebar configuration
  sidebar: {
    enabled: true,
    width: '256px',
    sticky: true,
  },

  // Release display options
  releases: {
    perPage: 10,
    showPrerelease: false,
    sortBy: 'date' as const, // 'date' | 'version'
    sortOrder: 'desc' as const, // 'asc' | 'desc'
  },

  // Social links
  social: {
    github: 'https://github.com/AyushiQCTest/QuantCopierUI',
    docs: 'https://docs.quanttradertools.com',
    support: 'mailto:support@quanttradertools.com',
  },

  // Navigation
  nav: {
    backButtonText: 'Back to App',
    backButtonUrl: null, // Leave null to show close button instead
  },
};

export type SiteConfig = typeof siteConfig;
