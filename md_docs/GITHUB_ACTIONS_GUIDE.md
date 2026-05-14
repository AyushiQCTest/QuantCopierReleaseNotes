# GitHub Actions Workflow Setup Guide

## 📄 Workflow File Location

```
QuantCopierReleaseNotes/
└── .github/
    └── workflows/
        └── release-notes.yml
```

---

## 🔐 Required GitHub Secrets

Before the workflow can run, add these secrets to your repository:

### 1. `FIREBASE_PROJECT_ID`

**Value:** `quantcopierreleasenotes`

**Steps to add:**
1. GitHub → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `FIREBASE_PROJECT_ID`
4. Value: `quantcopierreleasenotes`
5. Click "Add secret"

### 2. `FIREBASE_SERVICE_ACCOUNT`

**Value:** Firebase CLI token (from `firebase login:ci`)

**Steps to add:**
1. Open terminal on your machine
2. Run: `firebase logout`
3. Run: `firebase login:ci`
4. Browser opens for OAuth authentication
5. After authentication, terminal shows: `✔ Success! Use this token to login on a CI server:`
6. Copy the long token string
7. GitHub → Settings → Secrets and variables → Actions
8. Click "New repository secret"
9. Name: `FIREBASE_SERVICE_ACCOUNT`
10. Value: (paste the long token)
11. Click "Add secret"

---

## 🎯 Workflow Triggers

### Automatic Triggers

**1. On GitHub Release Published**
```yaml
on:
  release:
    types: [published]
```

This runs whenever you:
- Create a new release on GitHub
- Publish a draft release
- BUT NOT when you just save/edit without publishing

**2. Manual Trigger (Workflow Dispatch)**
```yaml
  workflow_dispatch:
    inputs:
      fetch_all:
        description: "Fetch all releases (not just latest)"
```

This allows you to:
- Go to Actions tab
- Click "Deploy Release Notes to Firebase"
- Click "Run workflow"
- Manually trigger deployment

### Why Both?

- **Automatic (published):** Most releases flow automatically
- **Manual (workflow_dispatch):** If you edit a release after publishing, manually trigger instead of creating a new release

---

## 📋 Workflow Steps Explained

### 1. **Checkout Code**
```yaml
- uses: actions/checkout@v4
```
- Pulls your repository code into the GitHub Actions runner
- Fetches full git history (fetch-depth: 0) for releases API

### 2. **Setup Node.js**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"
```
- Installs Node.js v20
- Caches npm dependencies for faster builds
- Saves 30-60 seconds on repeated builds

### 3. **Install Dependencies**
```yaml
- run: npm ci
```
- `npm ci` (clean install) is preferred for CI
- Installs exactly pinned versions from `package-lock.json`
- More reliable than `npm install` in CI

### 4. **Generate Releases JSON**
```yaml
- run: node scripts/generate-releases.js
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GITHUB_REPOSITORY: ${{ github.repository }}
```
- Runs `scripts/generate-releases.js`
- Script fetches releases from GitHub API using `GITHUB_TOKEN`
- Creates `public/releases.json` for the site
- **Required:** Uses GitHub's default token (auto-provided, no setup needed)

### 5. **Build Next.js Site**
```yaml
- run: npm run build
```
- Runs: `next build`
- Compiles TypeScript
- Optimizes React components
- Creates `.next/` directory with optimized output

### 6. **Verify Build**
```yaml
- run: |
    if [ ! -d ".next" ]; then
      echo "ERROR: .next directory not found after build!"
      exit 1
    fi
```
- Checks that build succeeded
- Fails fast if something went wrong
- Prevents deploying broken sites

### 7. **Install Firebase CLI**
```yaml
- run: npm install -g firebase-tools@latest
```
- Installs Firebase CLI globally
- Always latest version for compatibility

### 8. **Deploy to Firebase**
```yaml
- run: firebase deploy --only hosting --project=${{ secrets.FIREBASE_PROJECT_ID }} --token=${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```
- Authenticates with `FIREBASE_SERVICE_ACCOUNT` token
- Deploys to the project specified in `FIREBASE_PROJECT_ID`
- `--only hosting` means only deploy the website (not database/functions)

### 9. **Success Notification**
```yaml
- name: Deployment Success
  run: |
    echo "✅ Release Notes deployed successfully!"
    echo "📍 Live at: https://quantcopierreleasenotes.web.app"
```
- Prints success message (shown in workflow logs)
- Confirms deployment completed

### 10. **Failure Notification**
```yaml
- name: Deployment Failed
  if: failure()
  run: |
    echo "❌ Deployment failed!"
    echo "Check logs above for details"
    exit 1
```
- Only runs if any previous step failed
- Clearly marks workflow as failed

---

## 🔑 Environment Variables & Secrets

### GitHub-Provided Secrets (No Setup)

| Secret | Provided By | Purpose |
|--------|-------------|---------|
| `secrets.GITHUB_TOKEN` | GitHub | Read-only access to releases API |

### Your Secrets (Must Add to Settings)

| Secret | Type | Purpose |
|--------|------|---------|
| `FIREBASE_PROJECT_ID` | Project ID | Tell Firebase which project to deploy to |
| `FIREBASE_SERVICE_ACCOUNT` | CI Token | Authenticate with Firebase |

### Runtime Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `CI` | `true` | Tells Node that we're in CI environment |
| `GITHUB_REPOSITORY` | owner/repo | Used by generate script to fetch releases |

---

## ⚡ Performance Optimizations

### npm Caching
```yaml
cache: "npm"
```
- Caches `node_modules` folder
- Skips reinstalling unchanged packages
- Typical savings: 30-60 seconds per run

### Shallow Checkout
```yaml
fetch-depth: 0
```
- Fetches full git history (needed for some tools)
- Minimal performance impact

### Fail Fast
```yaml
if: failure()
```
- Only runs failure notification if needed
- Doesn't continue running unnecessary steps

---

## 🚨 Permissions & Security

### Permissions Section
```yaml
permissions:
  contents: read
  id-token: write
```

**What this means:**
- `contents: read` — Can read repository code (needed for releases API)
- `id-token: write` — Can request OpenID Connect token (for Firebase auth)
- **NOT included:** Write to code, admin access, etc. (least privilege)

### Why This Matters

✅ **Safe:** If token compromised, attacker can only:
- Read public releases
- Deploy to Firebase hosting

❌ **Cannot:**
- Modify code
- Delete repository
- Access other secrets

---

## 🔄 Workflow File Reference

### Location
```
.github/workflows/release-notes.yml
```

### Key Sections

| Section | Purpose |
|---------|---------|
| `name` | Workflow display name in Actions tab |
| `on` | Triggers (when workflow runs) |
| `env` | Global variables |
| `permissions` | Security scopes |
| `jobs` | Steps to execute |
| `runs-on` | GitHub-hosted runner (ubuntu-latest) |

### Full Workflow Structure
```yaml
name: Deploy Release Notes to Firebase
│
on:
├── release: [published]      ← Trigger on GitHub release
└── workflow_dispatch:        ← Manual trigger
    input: fetch_all
│
env:
├── NODE_VERSION: "20"        ← Node version
└── FIREBASE_CACHE_DIR: ...   ← Cache location
│
permissions:
├── contents: read            ← Can read releases
└── id-token: write           ← Can auth with Firebase
│
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      ├── Checkout
      ├── Setup Node
      ├── Install deps
      ├── Generate releases.json
      ├── Build site
      ├── Verify build
      ├── Install Firebase
      ├── Deploy
      ├── Success
      └── Failure (optional)
```

---

## ✅ Verification Checklist

Before running the workflow, verify:

- [ ] `.github/workflows/release-notes.yml` exists
- [ ] `scripts/generate-releases.js` exists
- [ ] `app/page.tsx` loads releases dynamically
- [ ] `FIREBASE_PROJECT_ID` secret added in GitHub
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret added in GitHub
- [ ] Repository is public (or Actions enabled for private repos)
- [ ] First GitHub Release exists (to test with)

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `FIREBASE_SERVICE_ACCOUNT not set` | Secret not added | Add to GitHub Settings |
| `Firebase API error 401` | Invalid token | Generate new token with `firebase login:ci` |
| `npm ci failed` | Corrupted lock file | Delete `package-lock.json`, run `npm install` locally |
| `.next not found` | Build failed silently | Check build logs for TypeScript errors |
| `No releases found` | GitHub API error | Check token has public_repo access |

---

## 📚 Related Documentation

- [AUTOMATED_DEPLOYMENT.md](AUTOMATED_DEPLOYMENT.md) — User guide for creating releases
- [scripts/generate-releases.js](scripts/generate-releases.js) — Release generator script
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Firebase CLI Docs](https://firebase.google.com/docs/cli)
