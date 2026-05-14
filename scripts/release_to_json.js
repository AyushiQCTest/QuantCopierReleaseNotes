#!/usr/bin/env node

/**
 * Convert GitHub Release description to releases.json for Release Notes site
 * Usage: node release_to_json.js --body "..." --tag "v1.0.0" --name "Release 1.0.0" --output path/to/releases.json
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1] || '';
      parsed[key] = value;
      i++; // Skip next item as it's the value
    }
  }
  
  return parsed;
}

function parseReleaseBody(body) {
  const release = {
    features: [],
    fixes: [],
    improvements: [],
  };
  
  // Simple parsing - look for sections
  const sections = {
    features: /##?\s*(?:new features?|features?|what's new)/i,
    fixes: /##?\s*(?:bug fixes?|fixes?|fixed)/i,
    improvements: /##?\s*(?:improvements?|enhancements?|improved)/i,
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
      const item = trimmed.slice(1).trim();
      if (item) {
        release[currentSection].push(item);
      }
    }
  }
  
  return release;
}

function main() {
  const args = parseArgs();
  
  const {
    body = '',
    tag = '',
    name = '',
    published = '',
    url = '',
    output = 'releases.json',
  } = args;
  
  if (!body && !tag && !name) {
    console.error('ERROR: At least one of --body, --tag, or --name is required');
    process.exit(1);
  }
  
  // Parse release body for structured data
  const parsed = parseReleaseBody(body);
  
  const release = {
    version: tag || name || 'Unknown',
    title: name || tag || 'Release',
    date: published || new Date().toISOString(),
    prerelease: false,
    draft: false,
    features: parsed.features,
    fixes: parsed.fixes,
    improvements: parsed.improvements,
    url: url || '',
    body: body,
  };
  
  // Create output directory if needed
  const outPath = path.resolve(output);
  const dir = path.dirname(outPath);
  
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Read existing releases if file exists
  let existingReleases = [];
  if (fs.existsSync(outPath)) {
    try {
      const content = fs.readFileSync(outPath, 'utf8');
      const data = JSON.parse(content);
      existingReleases = data.releases || [];
      console.log(`Found ${existingReleases.length} existing releases`);
    } catch (err) {
      console.warn(`Warning: Could not parse existing releases.json: ${err.message}`);
    }
  }
  
  // Check if this version already exists
  const existingIndex = existingReleases.findIndex(r => r.version === release.version);
  
  if (existingIndex >= 0) {
    console.log(`Updating existing release: ${release.version}`);
    existingReleases[existingIndex] = release;
  } else {
    console.log(`Adding new release: ${release.version}`);
    existingReleases.unshift(release); // Add to beginning
  }
  
  // Write updated releases
  const data = { releases: existingReleases };
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log(`✓ Successfully wrote releases.json to: ${outPath}`);
  console.log(`  Total releases: ${existingReleases.length}`);
  console.log(`  Latest: ${existingReleases[0]?.version || 'none'}`);
}

main();
