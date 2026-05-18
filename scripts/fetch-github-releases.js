#!/usr/bin/env node

/**
 * Fetch releases from GitHub API and generate releases.json
 * Usage: node fetch-github-releases.js
 * 
 * Fetches all releases from AyushiQCTest/QuantCopierUI and converts to releases.json format
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'AyushiQCTest';
const REPO = 'QuantCopierUI';
const OUTPUT_FILE = path.join(__dirname, '../public/releases.json');

/**
 * Fetch releases from GitHub API
 */
function fetchGitHubReleases() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}/releases`,
      method: 'GET',
      headers: {
        'User-Agent': 'QuantCopier-Release-Notes',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
      }
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse GitHub API response: ${e.message}`));
          }
        } else {
          reject(new Error(`GitHub API returned ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject).end();
  });
}

/**
 * Parse release body for structured sections
 */
function parseReleaseBody(body) {
  const sections = {
    features: /##?\s*(?:new features?|features?|what's new|additions?)/i,
    fixes: /##?\s*(?:bug fixes?|fixes?|fixed|hotfixes?)/i,
    improvements: /##?\s*(?:improvements?|enhancements?|improved|performance)/i,
  };

  const result = {
    features: [],
    fixes: [],
    improvements: []
  };

  if (!body || body.trim() === '' || body === '## Changes in v') {
    return result;
  }

  let currentSection = null;
  const lines = body.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this line starts a new section
    for (const [section, regex] of Object.entries(sections)) {
      if (regex.test(trimmed)) {
        currentSection = section;
        continue;
      }
    }

    // If we're in a section and this is a list item
    if (currentSection && (trimmed.startsWith('-') || trimmed.startsWith('*'))) {
      const item = trimmed.slice(1).trim();
      if (item) {
        result[currentSection].push(item);
      }
    }
  }

  return result;
}

/**
 * Convert GitHub release to our format
 */
function convertRelease(ghRelease) {
  const { features, fixes, improvements } = parseReleaseBody(ghRelease.body || '');
  
  // Extract version from tag (v1.2.3 -> 1.2.3)
  const version = ghRelease.tag_name.replace(/^v/, '');

  return {
    version,
    title: ghRelease.name || ghRelease.tag_name,
    date: ghRelease.published_at ? new Date(ghRelease.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    prerelease: ghRelease.prerelease,
    draft: ghRelease.draft,
    features: features.length > 0 ? features : [],
    fixes: fixes.length > 0 ? fixes : [],
    improvements: improvements.length > 0 ? improvements : [],
    url: ghRelease.html_url,
    body: ghRelease.body || ''
  };
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`📦 Fetching releases from ${OWNER}/${REPO}...`);
    const releases = await fetchGitHubReleases();

    if (releases.length === 0) {
      console.warn('⚠️  No releases found. Creating empty releases.json...');
    } else {
      console.log(`✓ Found ${releases.length} release(s)`);
    }

    // Convert releases to our format
    const converted = releases.map(convertRelease);

    // Filter out drafts if needed (optional)
    const published = converted.filter(r => !r.draft);

    // Sort by date (newest first)
    published.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write to file
    const output = { releases: published };
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

    console.log(`✅ Generated ${OUTPUT_FILE} with ${published.length} published release(s)`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Create empty releases.json as fallback
    console.log('📝 Creating fallback empty releases.json...');
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ releases: [] }, null, 2));
    
    process.exit(1);
  }
}

main();
