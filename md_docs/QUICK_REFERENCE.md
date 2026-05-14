# Quick Reference Card

## 📌 For Developers

### Creating a Release (Fastest Way)

```
1. GitHub → Releases → "Draft a new release"
2. Tag: v1.x.x
3. Title: Your release name
4. Description: (copy template below)
5. Publish

Template:
────────
## ✨ Features
- Your feature here

## 🐛 Bug Fixes
- Your fix here

## ⚡ Improvements
- Your improvement here
────────

Done! Site updates in 2 minutes.
```

### Check Deployment

```
GitHub Actions tab:
→ "Deploy Release Notes to Firebase" workflow
→ Should be green ✅
→ Last line: "Hosting URL: https://quantcopierreleasenotes.web.app"

Website:
→ https://quantcopierreleasenotes.web.app
→ Your release at the top
→ All sections showing correctly
```

### If Stuck

```
1. Check: Is release PUBLISHED (not draft)?
2. Check: Does description have ## ✨ Features headers?
3. Wait: 2-3 minutes for deployment
4. Refresh: Browser Ctrl+Shift+R (hard refresh)
5. Ask: Share Actions tab screenshot with DevOps
```

---

## 📌 For DevOps / Tech Leads

### Initial Setup (One-Time)

```bash
# Terminal
firebase logout
firebase login:ci
# 1. Browser authenticates
# 2. Copy long token shown

# GitHub → Settings → Secrets
Add 2 secrets:
  FIREBASE_PROJECT_ID = quantcopierreleasenotes
  FIREBASE_SERVICE_ACCOUNT = (paste token)

# Done! Commit code:
git add .
git push
```

### File Locations

```
Workflow:      .github/workflows/release-notes.yml
Generator:     scripts/generate-releases.js
Frontend:      app/page.tsx
Build config:  package.json (scripts section)
```

### Troubleshooting

```
Workflow failed?
→ GitHub → Actions → Failed workflow
→ Expand failed step
→ Read error message
→ Usually: Missing secret or Firebase issue

No releases showing?
→ Check: public/releases.json exists
→ Check: Release is published (not draft)
→ Clear cache: Ctrl+Shift+R

Firebase deploy error?
→ firebase login:ci
→ Update FIREBASE_SERVICE_ACCOUNT secret
→ Retry in Actions
```

### Monitoring

```
Weekly checks:
□ GitHub Actions runs successfully
□ Website displays latest release
□ Links to GitHub work correctly

Monthly checks:
□ Firebase console accessible
□ Secrets still valid
□ No error patterns in logs
```

---

## 📌 Common Commands

```bash
# Local testing
npm install
npm run generate:releases
npm run build
npm start

# Check Firebase
firebase status
firebase projects:list

# Generate new token
firebase logout
firebase login:ci

# Manual deploy (local)
firebase deploy --only hosting
```

---

## 📌 Emergency Procedures

### Token Compromised

```
1. Google Cloud Console → Delete old service account
2. Terminal: firebase login:ci
3. GitHub: Update FIREBASE_SERVICE_ACCOUNT secret
4. Test: Create dummy release, verify deployment
```

### Build Consistently Fails

```
1. Check package.json for syntax errors
2. npm install locally, verify dependencies work
3. Delete package-lock.json, npm install fresh
4. Commit and push
5. Retry GitHub Actions
```

### Website Won't Update

```
1. Check release is PUBLISHED
2. Check GitHub Actions completed (green ✅)
3. Hard refresh: Ctrl+Shift+F5
4. Check browser cache cleared
5. Try different browser (verify not local issue)
```

---

## 📌 Secrets Reference

| Secret | Value | Where | Notes |
|--------|-------|-------|-------|
| FIREBASE_PROJECT_ID | `quantcopierreleasenotes` | GitHub Settings | Static, doesn't change |
| FIREBASE_SERVICE_ACCOUNT | (long token) | GitHub Settings | Change if compromised |
| GITHUB_TOKEN | Auto-provided | Actions (built-in) | No setup needed |

---

## 📌 URLs

| Purpose | URL |
|---------|-----|
| Live Release Notes | https://quantcopierreleasenotes.web.app |
| Custom Domain (coming) | https://releases.quanttradertools.com |
| GitHub Actions | github.com/[owner]/[repo]/actions |
| Firebase Console | console.firebase.google.com |
| Releases on GitHub | github.com/[owner]/[repo]/releases |

---

## 📌 Workflow Status Codes

```
✅ Green  → Deployment successful, live!
🟡 Yellow → Workflow running, wait 2-3 min
🔴 Red    → Build/deploy failed, check logs
⏳ Gray   → Workflow queued, will start soon
```

---

## 📌 Release Format Quick Check

### ✅ Good Format
```markdown
## ✨ Features
- Feature description

## 🐛 Bug Fixes
- Bug fix description

## ⚡ Improvements
- Improvement description
```

### ❌ Bad Format (Won't Parse)
```
Added new stuff
Fixed bugs
```

**Always use:** `## ✨ / ## 🐛 / ## ⚡`  
**Always use:** Bullet points `- description`

---

## 📌 Timeline

| Duration | Event |
|----------|-------|
| 0 sec | You publish release on GitHub |
| ~30 sec | GitHub Actions workflow triggers |
| 1 min | Dependencies installed |
| 1.5 min | Release JSON generated |
| 2 min | Next.js builds |
| 2.5 min | Firebase deployment |
| 3 min | 🎉 Live on website! |

---

## 📌 Documentation Map

| Document | For Whom | Topic |
|----------|----------|-------|
| AUTOMATED_DEPLOYMENT.md | Developers | "How do I create a release?" |
| GITHUB_ACTIONS_GUIDE.md | DevOps/Tech Leads | "How does automation work?" |
| ARCHITECTURE.md | Advanced Developers | Detailed diagrams & flow |
| SETUP_CHECKLIST.md | First-time setup | Step-by-step checklist |
| IMPLEMENTATION_SUMMARY.md | Management | Overview & status |
| This file | Everyone | Quick reference |

---

## 📌 Key Principles

1. **One Release = One GitHub Publish** → Auto-deployed to website
2. **Proper Format Required** → ## ✨ Features format for parsing
3. **No Manual Steps** → Fully automated after setup
4. **2-3 Minutes** → Complete time from publish to live
5. **Zero Downtime** → Blue-green deployment via Firebase
6. **Secure** → Secrets never exposed, least privilege access
7. **Audit Trail** → Every deploy visible in GitHub Actions
8. **Rollback Easy** → Delete release, site updates automatically

---

## 📌 SOS Checklist

Everything broken? Do this:

- [ ] Verify both secrets exist in GitHub Settings
- [ ] Check release is PUBLISHED (not draft)
- [ ] Check release has proper format (## ✨ headers)
- [ ] Wait 3 full minutes (sometimes slow)
- [ ] Hard refresh browser: Ctrl+Shift+R
- [ ] Try different browser
- [ ] Check GitHub Actions tab for errors
- [ ] Read error message carefully
- [ ] Google the error (usually helps)
- [ ] Ask for help with Actions screenshot

---

**Quick Reference Card**  
**Last Updated:** January 2, 2025  
**Status:** Production Ready
