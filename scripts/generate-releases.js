#!/usr/bin/env node

/**
 * Generate releases.json from GitHub releases
 * Usage: node scripts/generate-releases.js
 * 
 * Fetches releases from GitHub and converts them to releases.json format
 * for the release notes site.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'AyushiQCTest';
const REPO_NAME = 'QuantCopierUI';
const OUTPUT_PATH = path.join(__dirname, '../public/releases.json');

function fetchGitHubReleases() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
      method: 'GET',
      headers: {
        'User-Agent': 'QuantCopier-Release-Notes',
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse GitHub API response: ${e.message}`));
          }
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function parseReleaseBody(body) {
  const release = {
    features: [],
    fixes: [],
    improvements: [],
  };

  if (!body) return release;

  // Parse markdown sections
  const sections = {
    features: /#{1,2}\s*(?:new\s+)?features?|what's\s+new/i,
    fixes: /#{1,2}\s*(?:bug\s+)?fixes?|fixed/i,
    improvements: /#{1,2}\s*improvements?|enhancements?|improved/i,
  };

  let currentSection = null;
  const lines = body.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this line starts a new section
    for (const [section, regex] of Object.entries(sections)) {
      if (regex.test(trimmed)) {
        currentSection = section;
        break;
      }
    }

    // If we're in a section and this is a list item
    if (currentSection && (trimmed.startsWith('-') || trimmed.startsWith('*'))) {
      const item = trimmed.replace(/^[-*]\s*/, '').trim();
      if (item) {
        release[currentSection].push(item);
      }
    }
  }

  return release;
}

function convertToReleasesFormat(githubReleases) {
  return githubReleases.map((release) => {
    const parsed = parseReleaseBody(release.body);
    return {
      version: release.tag_name.replace(/^v/, ''),
      title: release.name || release.tag_name,
      date: new Date(release.published_at).toISOString().split('T')[0],
      prerelease: release.prerelease,
      draft: release.draft,
      features: parsed.features,
      fixes: parsed.fixes,
      improvements: parsed.improvements,
      url: release.html_url,
      body: release.body || '',
    };
  });
}

async function main() {
  try {
    console.log('📦 Fetching releases from GitHub...');
    const githubReleases = await fetchGitHubReleases();

    if (!githubReleases || githubReleases.length === 0) {
      console.log('⚠️  No releases found. Creating empty releases.json');
      const data = { releases: [] };
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
      console.log('✓ Created empty releases.json');
      return;
    }

    const releases = convertToReleasesFormat(githubReleases);
    const data = { releases };

    // Ensure output directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
    console.log(`✓ Generated releases.json with ${releases.length} release(s)`);
    console.log(`  Location: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error generating releases.json:', error.message);
    console.log('📝 Creating fallback releases.json with sample data...');

    // Fallback: create empty releases.json so the site doesn't break
    const fallbackData = { releases: [] };
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(fallbackData, null, 2));
    console.log('✓ Fallback releases.json created');
  }
}

main();
