# Automated Release Notes: Visual Architecture

## 🔄 The Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPER                                   │
│                    (You/Team)                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 1. Create Release
                             │    - Tag: v1.2.0
                             │    - Description: Features/Fixes
                             │    - Click: Publish
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB                                       │
│         (Release Published Event)                               │
│     Releases: https://github.com/owner/repo/releases           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 2. Webhook Event
                             │    (Release Published)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 GITHUB ACTIONS                                  │
│        Workflow: release-notes.yml                              │
└─────────────────────────────────────────────────────────────────┘
│
│ ┌──────────────────────────────────────────────────────────────┐
│ │ Step 1: Checkout Code                                        │
│ │ - Download repository files                                  │
│ └──────────────────────────────────────────────────────────────┘
│ │
│ ├──────────────────────────────────────────────────────────────┐
│ │ Step 2: Setup Node.js (v20)                                  │
│ │ - Install Node runtime                                       │
│ │ - Cache npm dependencies                                     │
│ └──────────────────────────────────────────────────────────────┘
│ │
│ ├──────────────────────────────────────────────────────────────┐
│ │ Step 3: Install Dependencies                                 │
│ │ - npm ci                                                     │
│ │ - (uses package-lock.json)                                   │
│ └──────────────────────────────────────────────────────────────┘
│ │
│ ├──────────────────────────────────────────────────────────────┐
│ │ Step 4: Generate Releases JSON                               │
│ │                                                              │
│ │ ┌─────────────────────────────────────────────────────────┐ │
│ │ │  node scripts/generate-releases.js                      │ │
│ │ │                                                         │ │
│ │ │  ┌──────────────────────────────────────┐            │ │
│ │ │  │ GitHub Releases API                  │            │ │
│ │ │  │ (using GITHUB_TOKEN)                 │ ──────┐    │ │
│ │ │  └──────────────────────────────────────┘       │    │ │
│ │ │                                                │    │ │
│ │ │                                                ▼    │ │
│ │ │                                          ┌──────────┐│ │
│ │ │                                          │ releases ││ │
│ │ │                                          │  .json   ││ │
│ │ │                                          └──────────┘│ │
│ │ │ ┌─────────────────────────────────────┐             │ │
│ │ │ │ Parse sections:                     │             │ │
│ │ │ │ - ✨ Features                       │             │ │
│ │ │ │ - 🐛 Bug Fixes                      │             │ │
│ │ │ │ - ⚡ Improvements                   │             │ │
│ │ │ └─────────────────────────────────────┘             │ │
│ │ └─────────────────────────────────────────────────────┘ │
│ └──────────────────────────────────────────────────────────┘
│ │
│ ├──────────────────────────────────────────────────────────┐
│ │ Step 5: Build Next.js Site                               │
│ │                                                          │
│ │ npm run build                                            │
│ │                                                          │
│ │ TypeScript → JavaScript                                 │
│ │ JSX → HTML                                              │
│ │ React → Static files                                    │
│ │                                                          │
│ │ Output: .next/ directory                                │
│ └──────────────────────────────────────────────────────────┘
│ │
│ ├──────────────────────────────────────────────────────────┐
│ │ Step 6: Verify Build                                     │
│ │ - Check .next/ exists                                    │
│ │ - Check public/releases.json exists                      │
│ └──────────────────────────────────────────────────────────┘
│ │
│ ├──────────────────────────────────────────────────────────┐
│ │ Step 7: Install Firebase CLI                             │
│ │ - npm install -g firebase-tools                          │
│ └──────────────────────────────────────────────────────────┘
│ │
│ └──────────────────────────────────────────────────────────┐
│   Step 8: Deploy to Firebase                              │
│   firebase deploy --only hosting                           │
│   (using FIREBASE_PROJECT_ID + FIREBASE_SERVICE_ACCOUNT)  │
│ ┌──────────────────────────────────────────────────────────┘
│                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              FIREBASE HOSTING                                   │
│    quantcopierreleasenotes.web.app                              │
│                                                                 │
│  ✅ Live! Automatically updated                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USERS                                        │
│           See beautiful release notes!                          │
│        https://quantcopierreleasenotes.web.app                  │
└─────────────────────────────────────────────────────────────────┘

⏱️  Total Time: 2-3 minutes from publish to live!
```

---

## 📊 Data Flow Diagram

```
GitHub Releases API
   │
   │ (all published releases)
   │
   ▼
┌─────────────────────────────────┐
│   generate-releases.js          │
│  (Node.js script)               │
│                                 │
│  Input:  GitHub Release Objects │
│  Output: public/releases.json   │
└────────────┬────────────────────┘
             │
             │ releases.json
             │ {
             │   "releases": [
             │     {
             │       "version": "1.2.0",
             │       "date": "2025-01-02",
             │       "features": [...],
             │       "fixes": [...],
             │       ...
             │     }
             │   ]
             │ }
             │
             ▼
┌─────────────────────────────────┐
│   Next.js Build                 │
│   (npm run build)               │
│                                 │
│  Reads: public/releases.json    │
│  Output: .next/ + public/       │
└────────────┬────────────────────┘
             │
             │ static HTML + JS
             │
             ▼
┌─────────────────────────────────┐
│   Firebase Hosting              │
│                                 │
│   Serves: index.html + assets   │
│   URL: *.web.app/               │
└─────────────────────────────────┘
             │
             │ Browser request
             │
             ▼
┌─────────────────────────────────┐
│   React Component (page.tsx)    │
│                                 │
│   useEffect(() => {             │
│     fetch('/releases.json')     │
│     → setReleases()             │
│   })                            │
│                                 │
│   Renders: Timeline with cards  │
│   Features each release         │
└─────────────────────────────────┘
             │
             │
             ▼
┌─────────────────────────────────┐
│   User sees beautiful timeline  │
│   Release notes with sections   │
│   Links to GitHub releases      │
└─────────────────────────────────┘
```

---

## 🔐 Secrets & Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                  GITHUB REPOSITORY                          │
│                                                             │
│  Secrets (encrypted, not visible in logs):                 │
│  ├─ GITHUB_TOKEN (auto-provided)                           │
│  │  └─ Read-only access to releases API                    │
│  │                                                         │
│  ├─ FIREBASE_PROJECT_ID                                    │
│  │  └─ quantcopierreleasenotes                             │
│  │                                                         │
│  └─ FIREBASE_SERVICE_ACCOUNT                               │
│     └─ CI token from firebase login:ci                     │
│        └─ Can deploy but NOT delete                        │
│                                                             │
│  Workflow Permissions:                                     │
│  ├─ contents: read                                         │
│  │  └─ Can read releases                                   │
│  │                                                         │
│  └─ id-token: write                                        │
│     └─ Can authenticate with Firebase                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Decision Tree: What Triggers Deployment?

```
Event Occurs
    │
    ├─ GitHub Release Published
    │  └─ ✅ TRIGGER workflow
    │     └─ Generate → Build → Deploy
    │
    ├─ GitHub Release Drafted (not published)
    │  └─ ❌ NO trigger
    │
    ├─ Release Title/Description Edited
    │  └─ ❌ NO trigger (only on first publish)
    │     └─ Manual trigger available (Actions tab)
    │
    ├─ Code Pushed to main
    │  └─ ❌ NO trigger (only releases)
    │
    ├─ Manual Trigger (Actions → Run workflow)
    │  └─ ✅ TRIGGER workflow
    │     └─ Generate → Build → Deploy
    │
    └─ Pull Request Merged
       └─ ❌ NO trigger (not a release)
```

---

## 📈 Timeline Example

```
11:00 AM  Developer: "Publishing v1.2.0"
          └─ Click "Publish release" on GitHub
             
11:01 AM  GitHub Actions: "Workflow triggered"
          └─ release-notes.yml starts running
             
11:02 AM  Generate: "Reading GitHub Releases..."
          └─ Fetches v1.2.0 from API
             
11:02 AM  Build: "npm run build"
          └─ Compiles Next.js
             
11:03 AM  Deploy: "firebase deploy"
          └─ Uploads to Firebase
             
11:03 AM  Actions: "Deploy complete! ✅"
          └─ Workflow finishes
             
11:04 AM  User: "Checking https://quantcopierreleasenotes.web.app"
          └─ v1.2.0 appears at top of page! 🎉
```

---

## 🔄 File Dependencies

```
GitHub Releases
    │
    ▼
scripts/generate-releases.js
    │ (reads API, writes)
    ▼
public/releases.json (generated)
    │
    ├─ (read by build)
    │
    ▼
.next/ (Next.js output)
    │
    ├─ app/page.tsx (reads releases.json at runtime)
    │
    └─ (deployed by firebase)
    
    ▼
Firebase Hosting
    │
    ▼
Browser (fetches app)
    │
    ▼
React Component (loads releases.json)
    │
    ▼
Timeline Display
```

---

## 📋 Release Parsing Logic

```
Release Body Text:
─────────────────

## ✨ Features
- Feature 1
- Feature 2

## 🐛 Bug Fixes
- Fix 1
- Fix 2

## ⚡ Improvements
- Improvement 1


↓ PARSING (generate-releases.js)


{
  "features": ["Feature 1", "Feature 2"],
  "fixes": ["Fix 1", "Fix 2"],
  "improvements": ["Improvement 1"]
}


↓ RENDERING (app/page.tsx)


┌──────────────────────┐
│ Release Card         │
├──────────────────────┤
│ ✨ Features         │
│ • Feature 1         │
│ • Feature 2         │
├──────────────────────┤
│ 🐛 Bug Fixes        │
│ • Fix 1             │
│ • Fix 2             │
├──────────────────────┤
│ ⚡ Improvements     │
│ • Improvement 1     │
└──────────────────────┘
```

---

## 🚨 Error Flow (If Something Breaks)

```
Workflow Starts
    │
    ├─ Step 1-3 succeed normally
    │
    └─ Step 4 (Generate) fails
       │
       └─ Script can't reach GitHub API
          │
          ├─ GITHUB_TOKEN missing/invalid?
          │  └─ Add/regenerate in settings
          │
          └─ API rate limit exceeded?
             └─ Wait 1 hour, retry
    
    OR
    
    └─ Step 5 (Build) fails
       │
       ├─ TypeScript errors in code?
       │  └─ Fix errors locally, commit, push
       │
       └─ npm dependency conflict?
          └─ Fix package.json, commit, push


    OR
    
    └─ Step 8 (Deploy) fails
       │
       ├─ FIREBASE_SERVICE_ACCOUNT invalid?
       │  └─ Regenerate: firebase login:ci
       │
       └─ Firebase project error?
          └─ Check Firebase Console for issues
```

---

## 💡 Pro Tips

1. **Caching speeds up builds** — npm cache reused across runs
2. **GitHub Actions is free** — Up to 2000 minutes/month (plenty!)
3. **Firebase hosting is free** — Up to 10GB storage, unlimited bandwidth
4. **Secrets auto-masked** — Token never shown in logs
5. **Workflow runs in isolation** — Can't access other repos/secrets

---

**Created:** January 2, 2025  
**Complexity:** Intermediate (for reference & learning)  
**Audience:** DevOps & Curious Developers
