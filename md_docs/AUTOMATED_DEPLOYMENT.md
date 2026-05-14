# Automated Release Notes Deployment Guide

This guide explains how to automatically deploy release notes to Firebase whenever you publish a GitHub Release.

---

## 📋 Overview

**What Happens Automatically:**

1. You create/publish a GitHub Release
2. GitHub Actions workflow triggers automatically
3. Workflow generates `releases.json` from your GitHub Releases
4. Next.js site rebuilds with the new release data
5. Site deploys to Firebase Hosting
6. Release notes go live (no manual work needed!)

**Workflow File:** `.github/workflows/release-notes.yml`  
**Release Generator:** `scripts/generate-releases.js`  
**Frontend:** React component that loads releases dynamically from `public/releases.json`

---

## 🚀 Quick Start: Create a Release

### Step 1: Create a GitHub Release

1. Go to your GitHub repository
2. Click **"Releases"** on the right sidebar
3. Click **"Draft a new release"**

### Step 2: Fill in Release Details

```
Tag version:     v1.2.1
Release title:   New Feature Release
Description:     (use format below)
```

### Step 3: Format Your Release Notes

Use this format for automatic parsing:

```markdown
## ✨ Features
- Feature 1 description
- Feature 2 description

## 🐛 Bug Fixes
- Bug fix 1
- Bug fix 2

## ⚡ Improvements
- Improvement 1
- Improvement 2
```

**Example:**

```markdown
## ✨ Features
- SMS OTP delivery with automatic fallback
- Enhanced Telegram session management
- New rate limiting controls

## 🐛 Bug Fixes
- Fixed OTP not arriving issue
- Resolved connection timeout problems
- Fixed session persistence

## ⚡ Improvements
- Better error logging
- Faster authentication flow
- Improved UI responsiveness
```

### Step 4: Publish

1. Click **"Publish release"**
2. Wait 1-2 minutes
3. Check https://quantcopierreleasenotes.web.app (or your domain)
4. Your release notes appear automatically! ✅

---

## 🔧 Setup Requirements (One-Time)

### A) GitHub Repository Setup

✅ **Already Done:** You have a GitHub repository

### B) Firebase Credentials

The workflow needs two secrets in your GitHub repository:

#### 1. `FIREBASE_PROJECT_ID`
- **Value:** `quantcopierreleasenotes`
- **Where to add:** GitHub → Settings → Secrets and variables → Actions → New repository secret

#### 2. `FIREBASE_SERVICE_ACCOUNT`
- **This is a Firebase CLI token** (long encrypted string)
- **How to generate:**

```bash
# On your local machine (where you already logged in)
firebase login:ci

# This outputs a token - copy it
# Paste in GitHub as FIREBASE_SERVICE_ACCOUNT secret
```

**Or use existing token if you ran `firebase login` before:**

```bash
firebase logout
firebase login:ci
# Follow browser OAuth flow
# Copy the token printed at the end
```

#### Add Secrets to GitHub:

1. Go to: **GitHub Repository → Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Add `FIREBASE_PROJECT_ID` = `quantcopierreleasenotes`
4. Click **"New repository secret"** again
5. Add `FIREBASE_SERVICE_ACCOUNT` = (your CI token from firebase login:ci)

**✅ Done!** The workflow can now deploy automatically.

---

## 🎯 How It Works (Technical Details)

### Trigger Events

The workflow runs automatically when:

| Event | Trigger |
|-------|---------|
| **Release Published** | ✅ Automatic (primary trigger) |
| **Workflow Dispatch** | Manual trigger from Actions tab |

### Workflow Steps

```
1. Checkout code
   ↓
2. Setup Node.js with npm cache
   ↓
3. Install dependencies (npm ci)
   ↓
4. Generate releases.json (Node script reads GitHub API)
   ↓
5. Build Next.js site (npm run build)
   ↓
6. Verify build output
   ↓
7. Deploy to Firebase Hosting
   ↓
8. Done! ✅ Check live URL
```

### Release JSON Format

The script generates `public/releases.json` like this:

```json
{
  "releases": [
    {
      "version": "1.2.1",
      "title": "New Feature Release",
      "date": "2025-01-02",
      "prerelease": false,
      "draft": false,
      "features": [
        "SMS OTP delivery with automatic fallback",
        "Enhanced Telegram session management"
      ],
      "fixes": [
        "Fixed OTP not arriving issue",
        "Resolved connection timeout problems"
      ],
      "improvements": [
        "Better error logging",
        "Faster authentication flow"
      ],
      "url": "https://github.com/owner/repo/releases/tag/v1.2.1",
      "body": "## ✨ Features\n- ..."
    }
  ]
}
```

The React component fetches and renders this JSON into a beautiful timeline.

---

## ✅ Verify Deployment

### Method 1: Watch GitHub Actions

1. Push your changes (if not already committed)
2. Go to **GitHub → Actions**
3. Watch the **"Deploy Release Notes to Firebase"** workflow
4. ✅ All steps should show green checkmarks
5. Latest step shows: `Hosting URL: https://quantcopierreleasenotes.web.app`

### Method 2: Check Live Site

Visit: **https://quantcopierreleasenotes.web.app**

- Your new release should appear at the top
- Click "View on GitHub" to verify the release link

### Method 3: Check Logs

If deployment fails:

1. **GitHub Actions Tab:** Click failed workflow → expand step
2. **Look for error messages** (usually clear)
3. **Common issues:**
   - Missing `FIREBASE_SERVICE_ACCOUNT` secret → Add it in Settings
   - Invalid `FIREBASE_PROJECT_ID` → Verify it matches `quantcopierreleasenotes`
   - Node/npm issues → Usually just cache clearing (rebuilds on next push)

---

## 🔄 Workflow Behavior

### What Happens If You...

| Action | Result |
|--------|--------|
| Create release on GitHub | Workflow triggers automatically ✅ |
| Update release title/body | Workflow does NOT trigger (only on publish) |
| Edit release after publish | Manually trigger from Actions tab (workflow_dispatch) |
| Delete a release | Deleted release disappears from site next deploy |
| Create draft release | Ignored (only published releases shown) |

### Manual Trigger (If Needed)

If you edit a release after publishing and need to update the site immediately:

1. Go to **GitHub → Actions**
2. Click **"Deploy Release Notes to Firebase"**
3. Click **"Run workflow"** (blue button)
4. Select branch: `main`
5. Click **"Run workflow"**
6. Workflow executes, deployment happens

---

## 🛠️ Troubleshooting

### Issue: Workflow Failed

**Check the error:**
1. GitHub → Actions → Click failed workflow
2. Expand the failed step
3. Read the error message

**Common fixes:**

| Error | Fix |
|-------|-----|
| `FIREBASE_SERVICE_ACCOUNT not set` | Add secret to GitHub Settings |
| `FIREBASE_PROJECT_ID not set` | Add secret to GitHub Settings |
| `GitHub API rate limit exceeded` | Wait 1 hour (only if running many tests) |
| `Node dependencies installation failed` | Clear cache in GitHub (rare) |

### Issue: Release Notes Not Updating

**Checklist:**

- [ ] Is the release **published** (not draft)?
- [ ] Does it have proper section headers? (## ✨ Features, ## 🐛 Bug Fixes, etc.)
- [ ] Did GitHub Actions workflow complete (green checkmark)?
- [ ] Did you wait 1-2 minutes for Firebase to deploy?
- [ ] Refresh the browser (Ctrl+Shift+R for hard refresh)

### Issue: Releases.json Is Empty

**This happens if:**
- No releases exist on GitHub yet
- All releases are drafts

**Solution:** Create a test release:

```
Tag: v1.0.0-test
Title: Test Release
Body:
## ✨ Features
- Test feature

[Publish Release]
```

Then check if it appears after 2 minutes.

---

## 📝 Best Practices

### 1. Release Notes Format

**DO:**
```markdown
## ✨ Features
- Clear, user-facing description
- Short and actionable

## 🐛 Bug Fixes
- What was broken
- How it's fixed now

## ⚡ Improvements
- Performance gains
- Code quality improvements
```

**DON'T:**
```markdown
Fixed stuff
Added things
Random notes
(No proper structure = won't parse correctly)
```

### 2. Semantic Versioning

Use version format: `vMAJOR.MINOR.PATCH`

- `v1.0.0` — First release
- `v1.1.0` — New feature
- `v1.1.1` — Bug fix
- `v2.0.0` — Breaking changes

### 3. Release Frequency

- **Patch** (bug fixes): When needed
- **Minor** (new features): Weekly/biweekly
- **Major** (breaking changes): Rarely, with announcement

### 4. Pre-releases

For beta/RC versions:

1. Check **"This is a pre-release"** when creating release
2. Use tag like: `v1.2.0-beta.1` or `v1.2.0-rc.1`
3. Site displays with **"Pre-release"** badge automatically

---

## 🚨 Security Notes

### What's Protected

✅ **Secrets are never exposed:**
- `FIREBASE_SERVICE_ACCOUNT` only used in GitHub Actions
- Never logged or printed in output
- Only available to workflows in your repo

✅ **Least privilege:**
- Firebase token only can deploy (not delete)
- GitHub token only reads releases (not modify code)

✅ **Only in GitHub:**
- Run in trusted GitHub infrastructure
- All actions visible in Action logs (with secrets masked)

### If You Suspect Token Compromise

1. Go to **Google Cloud Console**
2. Find your Firebase project
3. Delete the service account
4. Generate new token: `firebase login:ci`
5. Update `FIREBASE_SERVICE_ACCOUNT` secret in GitHub

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `.github/workflows/release-notes.yml` | GitHub Actions workflow definition |
| `scripts/generate-releases.js` | Node script that fetches GitHub Releases and generates JSON |
| `app/page.tsx` | React component that loads and displays releases |
| `public/releases.json` | Generated JSON file (created during build) |
| `package.json` | Build scripts including `generate:releases` |

---

## 🎓 Next Steps

1. ✅ Add secrets to GitHub (if not done)
2. ✅ Create your first GitHub Release
3. ✅ Verify it appears on the site
4. ✅ Share the live URL with users
5. ✅ Keep releasing using this workflow

---

## 📞 Support

**If something breaks:**

1. Check the **Troubleshooting** section above
2. Review **GitHub Actions logs** (most helpful)
3. Verify **secrets are set** in GitHub Settings
4. Check **release format** (use emojis and proper headers)

**Everything should work seamlessly once secrets are configured!** 🚀
