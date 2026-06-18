/**
 * GitHub API utilities
 * Fetches and parses GitHub releases
 */

import { releaseConfig } from '@/config/releases.config';
import { siteConfig } from '@/config/site.config';

export interface Release {
  version: string;
  title: string;
  date: string;
  prerelease: boolean;
  draft: boolean;
  sections: Record<string, string[]>;
  url: string;
  body: string;
}

export async function fetchGitHubReleases(): Promise<Release[]> {
  const { owner, repo, token } = siteConfig.github;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        headers: token ? { Authorization: `token ${token}` } : {},
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const releases = await response.json();
    return releases
      .filter((release: any) => release.tag_name.startsWith('discord-'))
      .map((release: any) => parseRelease(release));
  } catch (error) {
    console.error('Failed to fetch releases:', error);
    return [];
  }
}

function parseRelease(release: any): Release {
  const version = release.tag_name.replace(/^v/, '');
  const sections = parseReleaseBody(release.body || '');

  return {
    version,
    title: release.name || `Release ${version}`,
    date: new Date(release.published_at).toLocaleDateString(
      releaseConfig.dateFormat.locale,
      releaseConfig.dateFormat.options
    ),
    prerelease: release.prerelease,
    draft: release.draft,
    sections,
    url: release.html_url,
    body: release.body || '',
  };
}

export function parseReleaseBody(
  body: string
): Record<string, string[]> {
  const sections: Record<string, string[]> = {};

  // Parse each configured section
  Object.entries(releaseConfig.sections).forEach(([key, config]) => {
    const regex = new RegExp(
      `${config.heading}\\s*\\n([\\s\\S]*?)(?=##|$)`,
      'i'
    );
    const match = body.match(regex);

    if (match) {
      const items = match[1]
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^\\s*-\\s*/, '').trim())
        .filter((item) => item.length > 0);

      if (items.length > 0) {
        sections[key] = items;
      }
    }
  });

  return sections;
}
