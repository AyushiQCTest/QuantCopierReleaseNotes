# QuantCopier Release Notes Deployment Guide

> **Current Version: 1.3.2**

## How to Release a New Version

1. **Update version number below** ↓
2. Commit and push to `main`
3. Installer workflow automatically builds with new version
4. After build completes, GitHub Release is created automatically
5. Release notes site fetches and displays new version

### VERSION TO BUILD:
```
1.3.2
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
- Auto-generated Next.js static site
- All assets and styles included

## Updating Release Notes

Edit `app/page.tsx`:

```typescript
// Find the releases array
const releases: ReleaseNote[] = [
  {
    version: '1.3.2',
    date: 'January 20, 2025',
    title: 'Your Feature Title',
    description: 'Description of what changed',
    features: ['Feature 1', 'Feature 2'],
    fixes: ['Fix 1'],
    improvements: ['Improvement 1'],
  },
  // ... existing releases
];
```

Then redeploy:

```bash
npm run build
firebase deploy --only hosting
```

## Verify Deployment

1. Open https://releases.quanttradertools.com in browser
2. Should see the changelog page
3. Check that "View Release Notes" button in QuantCopierUI app works

## Next Steps

After deployment is live:

1. **Test the link** in QuantCopierUI:
   - Open app
   - Click profile icon → View Release Notes
   - Should open the Firebase-hosted page

2. **Keep it updated** - Add new releases before publishing app updates

3. **Monitor** - Check Firebase Console → Hosting → Analytics

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| DNS not resolving | Wait 24-48 hours, or check domain registrar DNS settings |
| Deploy fails | Run `firebase login` and verify project with `firebase use` |
| Page shows 404 | Build project first: `npm run build` |
| Custom domain not showing | Check Firebase Console → Hosting → Domains section |

## File Locations

- **Release content**: `QuantCopierReleaseNotes/app/page.tsx`
- **Styling**: `QuantCopierReleaseNotes/app/globals.css`
- **Config**: `QuantCopierReleaseNotes/firebase.json`
- **Link in app**: `QuantCopierUi/components/home/ProfileDropdown.tsx:284`

## Support

Contact: support@quanttradertools.com
