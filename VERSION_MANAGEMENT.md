# Version Management & Deployment Guide

This document explains how to manage version releases across the QuantCopier ecosystem and keep all systems in sync.

## System Overview

The version management system is fully automated:

```
Update Version in DEPLOYMENT.md
    ↓ (Commit & Push)
    ├→ Installer Build Workflow (build-installer.yml)
    │   ├→ Reads version from DEPLOYMENT.md
    │   ├→ Builds 2 EXEs with version embedded
    │   └→ Uploads to Firebase Storage Bucket
    │
    ├→ Create Release Workflow (create-release-after-installer.yml)
    │   ├→ Runs AFTER installer completes
    │   ├→ Extracts version from DEPLOYMENT.md
    │   ├→ Creates GitHub Release in QuantCopierUI
    │   └→ Pushes git tag
    │
QuantCopierReleaseNotes
    ↓ (Auto-fetches on next build)
    ├→ Fetches releases from GitHub API
    ├→ Generates public/releases.json
    └→ Displays on vercel.app
```

## Step-by-Step: How to Release a New Version

### 1. **Update Version in DEPLOYMENT.md**

This is the ONLY manual step required. All else is fully automated.

**File Location:** `QuantCopierReleaseNotes/md_docs/DEPLOYMENT.md`

```bash
# Navigate to QuantCopierReleaseNotes repo
cd c:\Users\Asus\QuantTraderTools\QuantCopierReleaseNotes

# Edit DEPLOYMENT.md - Find the VERSION TO BUILD section
# Change the version number (use semantic versioning: MAJOR.MINOR.PATCH)
# Example: 1.3.2 → 1.4.0

# View the change
git diff md_docs/DEPLOYMENT.md

# Commit and push
git add md_docs/DEPLOYMENT.md
git commit -m "Bump version to 1.4.0"
git push origin main
```

**⚠️ IMPORTANT:** Use semantic versioning format: `{MAJOR}.{MINOR}.{PATCH}` (no 'v' prefix)
- Examples: `1.0.0`, `1.3.2`, `2.1.0`
- DO NOT use: `v1.4.0`, `1.4`, `1.4.0-beta`

---

### 2. **Installer Build Workflow Runs Automatically**

When you push the DEPLOYMENT.md change, GitHub Actions automatically triggers:

**Workflow File:** `QuantCopierReleaseNotes/.github/workflows/build-installer.yml` (or `full-installer-pipeline.yml`)

- ✅ Detects DEPLOYMENT.md change
- ✅ Reads version number from file
- ✅ Builds QuantCopierAPI.exe (Python sidecar)
- ✅ Builds QuantCopierUI installer (Tauri app)
- ✅ Embeds version in Windows Properties (right-click → Properties)
- ✅ Uploads both EXEs to Firebase Storage Bucket
- ✅ Available as GitHub Actions artifacts

**Expected time:** 8-12 minutes

---

### 3. **Release Creation Workflow Runs After Installer Succeeds**

When the installer workflow completes successfully:

**Workflow File:** `QuantCopierReleaseNotes/.github/workflows/create-release-after-installer.yml`

- ✅ Triggered automatically on installer success
- ✅ Extracts version from DEPLOYMENT.md
- ✅ Creates GitHub Release in QuantCopierUI repo
- ✅ Pushes git tag (v1.4.0)
- ✅ Releases are now visible on GitHub

**Expected time:** 1-2 minutes

---

### 4. **Release Notes Site Auto-Fetches Release Data**

The QuantCopierReleaseNotes site automatically fetches the new release:

**Fetch Script:** `QuantCopierReleaseNotes/scripts/fetch-github-releases.js`

This script runs on every build and:

- ✅ Calls GitHub API to fetch releases from QuantCopierUI
- ✅ Parses release body for sections:
  - `## Features` → Green section with ✨
  - `## Bug Fixes` → Red section with 🐛
  - `## Improvements` → Amber section with ⚡
- ✅ Generates `public/releases.json`
- ✅ Site displays releases in sidebar and timeline

---

### 5. **Vercel Auto-Deploys the Updated Site**

When changes are pushed to `QuantCopierReleaseNotes`:

- ✅ Vercel detects the push (or scheduled rebuild)
- ✅ Runs `npm run build` (which includes fetch:releases)
- ✅ Deploys updated site with new releases visible
- ✅ Live on vercel.app in ~2 minutes

---

## Complete Example: Releasing v1.4.0

### Timeline

```
Day 1: Development Complete
├─ 16:45 - Code completed and merged to main in QuantCopierUI
└─ 16:46 - Ready for release

Day 1: Release Process (< 15 minutes)
├─ 16:47 - Update DEPLOYMENT.md: change "1.3.2" → "1.4.0"
├─ 16:48 - Commit and push: git commit -m "Bump version" && git push
├─ 16:49 - Installer workflow starts (build-installer.yml)
│           ├─ 17:00 - Installers built and uploaded to bucket
│           └─ 17:01 - Workflow completes successfully
├─ 17:02 - Release creation workflow triggers
│           ├─ 17:03 - Version extracted from DEPLOYMENT.md
│           ├─ 17:04 - GitHub Release created in QuantCopierUI
│           └─ 17:05 - Tag v1.4.0 pushed
├─ 17:06 - QuantCopierReleaseNotes fetches new release
├─ 17:07 - Vercel builds and deploys
└─ 17:09 - Live on website! ✨
```

### Commands to Run

```bash
# In QuantCopierReleaseNotes directory
cd c:\Users\Asus\QuantTraderTools\QuantCopierReleaseNotes

# Edit DEPLOYMENT.md - change version number
# Find this section:
#   ### VERSION TO BUILD:
#   ```
#   1.3.2
#   ```
# Change to:
#   ### VERSION TO BUILD:
#   ```
#   1.4.0
#   ```

# Commit and push
git add md_docs/DEPLOYMENT.md
git commit -m "Bump version to 1.4.0"
git push origin main
```

That's it! GitHub Actions handles all the rest automatically.

---

## Files Involved in the Process

### QuantCopierReleaseNotes Repository
| File | Purpose |
|------|---------|
| `md_docs/DEPLOYMENT.md` | **Source of truth for version number** (update this to trigger release) |
| `.github/workflows/build-installer.yml` | Builds installers with new version, uploads to bucket |
| `.github/workflows/full-installer-pipeline.yml` | Alternative full installer pipeline workflow |
| `.github/workflows/create-release-after-installer.yml` | **NEW:** Creates GitHub Release after installer succeeds |
| `scripts/fetch-github-releases.js` | Fetches releases from GitHub API and generates JSON |
| `public/releases.json` | Auto-generated data file (do not edit manually) |
| `app/ReleaseNotesClient.tsx` | Displays releases with timeline and cards |

### QuantCopierUI Repository
| File | Purpose |
|------|---------|
| GitHub Releases (created automatically) | Stores release information and artifacts |
| Git tags (created automatically) | Version markers (v1.3.2, v1.4.0, etc.) |

---

## Customizing Release Information

### Option A: Auto-Generated Changelogs (Current)

The workflow generates changelogs from commit messages. No manual work needed.

### Option B: Custom Release Body (Manual)

You can manually edit the GitHub Release body to customize what appears:

1. Go to GitHub → QuantCopierUI → Releases
2. Click the release you want to edit
3. Click "Edit" button
4. Update the release body with sections:

```markdown
## Features
- Feature 1
- Feature 2

## Bug Fixes
- Bug fix 1
- Bug fix 2

## Improvements
- Improvement 1
- Improvement 2
```

5. Click "Update Release"
6. Next time QuantCopierReleaseNotes builds, it will fetch the updated info

---

## Troubleshooting

### "DEPLOYMENT.md update didn't trigger installer"

**Problem:** Updated DEPLOYMENT.md but installer workflow didn't start

**Solution:**
1. Check GitHub → QuantCopierReleaseNotes → Actions (build-installer workflow)
2. Verify you pushed to `main` branch (not another branch)
3. Verify DEPLOYMENT.md was actually committed:
   ```bash
   git log -1 --name-only
   ```
4. Check GitHub Actions logs for errors

### "Installer built but release wasn't created"

**Problem:** Installer workflow succeeded but GitHub Release wasn't created

**Solution:**
1. Check GitHub → QuantCopierReleaseNotes → Actions (create-release-after-installer workflow)
2. Verify DEPLOYMENT.md version format is correct (e.g., `1.4.0` not `v1.4.0`)
3. Check workflow logs for version extraction errors
4. Manually create release as fallback: Edit DEPLOYMENT.md and push again

### "Release not showing on website"

**Problem:** GitHub Release exists but site still shows old version

**Solution:**
1. Vercel may not have auto-deployed
2. Manually trigger Vercel rebuild: Go to Vercel dashboard → QuantCopierReleaseNotes → Deployments → Redeploy
3. Or push a dummy commit to trigger build:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

### "Missing sections (Features/Bug Fixes/Improvements)"

**Problem:** Release appears but sections are empty

**Solution:**
1. Edit the GitHub Release body in QuantCopierUI → Releases
2. Ensure proper markdown format:
   ```markdown
   ## Features
   - Item 1
   - Item 2
   
   ## Bug Fixes
   - Item 1
   
   ## Improvements
   - Item 1
   ```
3. Click "Update Release"
4. Redeploy QuantCopierReleaseNotes to fetch updated content

---

## Best Practices

### ✅ DO:

- ✅ Use semantic versioning in DEPLOYMENT.md: `1.2.3` (no 'v' prefix)
- ✅ Update DEPLOYMENT.md before pushing to trigger installer build
- ✅ Commit and push DEPLOYMENT.md changes to main
- ✅ Wait 12-15 minutes for full build → release → deploy pipeline
- ✅ Watch GitHub Actions to monitor progress:
  - 1. Installer workflow runs
  - 2. Create release workflow runs after installer succeeds
  - 3. Vercel auto-deploys when release is created
- ✅ Update GitHub Release body for better clarity if needed

### ❌ DON'T:

- ❌ Use incorrect format in DEPLOYMENT.md: Don't use `v1.2.3`, `1.2`, or `1.2.3-beta`
- ❌ Push DEPLOYMENT.md changes to non-main branches (only main triggers workflows)
- ❌ Manually create tags (automation does it)
- ❌ Manually create releases (automation does it)
- ❌ Edit `public/releases.json` manually (it's auto-generated)
- ❌ Delete version entries from DEPLOYMENT.md or git tags (breaks automation)

---

## API Details (For Developers)

### GitHub API Call

The fetch script makes this request:

```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/AyushiQCTest/QuantCopierUI/releases"
```

### Release JSON Structure

Generated `public/releases.json`:

```json
{
  "releases": [
    {
      "version": "1.3.2",
      "title": "Release v1.3.2",
      "date": "2026-05-18",
      "prerelease": false,
      "draft": false,
      "features": ["Feature 1", "Feature 2"],
      "fixes": ["Bug fix 1"],
      "improvements": ["Improvement 1"],
      "url": "https://github.com/AyushiQCTest/QuantCopierUI/releases/tag/v1.3.2",
      "body": "Full markdown body..."
    }
  ]
}
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Release new version | Edit `md_docs/DEPLOYMENT.md` version → `git add md_docs/DEPLOYMENT.md && git commit -m "Bump to 1.4.0" && git push` |
| Check current version | `cat md_docs/DEPLOYMENT.md \| grep -A 2 "VERSION TO BUILD"` |
| Monitor installer build | GitHub → QuantCopierReleaseNotes → Actions → build-installer.yml |
| Monitor release creation | GitHub → QuantCopierReleaseNotes → Actions → create-release-after-installer.yml |
| View all releases | GitHub → QuantCopierUI → Releases |
| List all tags | `git tag` |
| View tag details | `git show v1.4.0` |

---

## Support

For issues or questions about the version management system, refer to:
- GitHub Actions logs: QuantCopierUI → Actions
- Vercel logs: QuantCopierReleaseNotes deployment logs
- Fetch script output: See npm build output
