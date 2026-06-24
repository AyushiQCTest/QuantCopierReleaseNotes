# QuantCopier Release Notes Deployment Guide

> **Current Version: 1.3.5**

## How to Release a New Version

1. **Update version number below** ↓
2. Commit and push to `main`
3. Installer workflow automatically builds with new version
4. After build completes, GitHub Release is created automatically
5. Release notes site fetches and displays new version

### VERSION TO BUILD:
```
1.3.5
```
**Edit the version above ↑ and commit to trigger release automation**

---

## Quick Start (30 seconds)

```bash
# 1. Navigate to the release notes directory
cd QuantCopierReleaseNotes

# 2. Install and build
npm install
npm run build

# 3. Deploy to Firebase
firebase deploy --only hosting
```

## Detailed Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it: `quantcopier-releases` or similar
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 3: Login to Firebase

```bash
firebase login
```

### Step 4: Initialize Firebase in This Directory

```bash
cd c:\Users\Javed Ahemad\OneDrive\Desktop\Quanttools\QuantCopierReleaseNotes
firebase init hosting
```

When prompted:
- **Select project**: Choose the project you created
- **Public directory**: Type `.next/standalone/public` (or just `.` for static build)
- **Single page app**: Type `n` (No)
- **Overwrite files**: Type `n` (No)

### Step 5: Configure Custom Domain

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Enter: `releases.quanttradertools.com`
4. Verify domain ownership (follow Firebase steps)
5. Firebase will generate DNS records:
   - Copy the DNS records
   - Add them to your domain registrar (GoDaddy, Namecheap, etc.)
6. Wait 15-60 minutes for propagation

### Step 6: Build and Deploy

```bash
npm run build
firebase deploy --only hosting
```

## What Gets Deployed?

- Changelog page at `releases.quanttradertools.com/`
- Auto-generated Next.js site that pulls dynamically from `releases.json`

## Updating Release Notes (Automated)

The release notes are now fully automated and generated from your GitHub pipeline! 

To add features and fixes to a new release:
1. Open the file `md_docs/LATEST_RELEASE.md` in this repository.
2. Fill out the `## Features`, `## Improvements`, and `## Bug Fixes` sections as needed.
3. Update the version number at the top of this `DEPLOYMENT.md` file.
4. Commit and push your changes to GitHub.

The automated pipeline will run, build the installer, read your custom release notes from `LATEST_RELEASE.md`, and automatically create the GitHub Release. The Release Notes site will then fetch these notes automatically via the `fetch:releases` script.

## Verify Deployment

1. Open https://releases.quanttradertools.com in your browser
2. You should see the new version and your custom features fetched dynamically!
3. Check that the "View Release Notes" button in QuantCopierUI app works.

## Next Steps

After deployment is live:

1. **Test the link** in QuantCopierUI:
   - Open app
   - Click profile icon → View Release Notes
   - Should open the Firebase-hosted page

2. **Keep it updated** - Just update `LATEST_RELEASE.md` and bump the version here before every release.

3. **Monitor** - Check Firebase Console → Hosting → Analytics

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| DNS not resolving | Wait 24-48 hours, or check domain registrar DNS settings |
| Deploy fails | Run `firebase login` and verify project with `firebase use` |
| Page shows 404 | Build project first: `npm run build` |
| Custom domain not showing | Check Firebase Console → Hosting → Domains section |

## File Locations

- **Automated Release Notes Template**: `QuantCopierReleaseNotes/md_docs/LATEST_RELEASE.md`
- **Release UI Component**: `QuantCopierReleaseNotes/app/ReleaseNotesClient.tsx`
- **Styling**: `QuantCopierReleaseNotes/app/globals.css`
- **Config**: `QuantCopierReleaseNotes/firebase.json`

## Support

Contact: support@quanttradertools.com
