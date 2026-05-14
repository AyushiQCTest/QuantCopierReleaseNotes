# GitHub Actions Workflows

This directory contains CI/CD workflows for the QuantCopier project release pipeline. This repo orchestrates building, packaging, and deploying installers from **separate frontend and backend repos** without directly modifying them.

---

## Workflows

### 1. `build-installer.yml` - Build and Upload Windows Installer

**Trigger:** 
- Automatically on GitHub Release published
- Manual dispatch via Actions UI

**What it does:**
1. Checks out this orchestrator repo (for scripts and configuration)
2. Checks out the **frontend repo** (QuantCopierTelegramUI)
3. Checks out the **backend repo** (qcdemo - Python sidecar)
4. Builds the backend Python sidecar using PyInstaller
5. Copies the sidecar binary into the frontend's Tauri `binaries/` folder
6. Builds the Tauri Windows installer (.exe)
7. Uploads installer to Firebase Storage
8. Creates GitHub Actions artifact for download
9. Generates download URL

**Secrets Required:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Base64-encoded Firebase service account JSON
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_STORAGE_BUCKET` - Storage bucket name (e.g., `myproject.appspot.com`)
- `FRONTEND_REPO_TOKEN` (optional) - GitHub PAT for private frontend repo access
- `BACKEND_REPO_TOKEN` (optional) - GitHub PAT for private backend repo access
- `TAURI_PRIVATE_KEY` (optional) - For code signing
- `TAURI_KEY_PASSWORD` (optional) - For code signing

**Repository Variables (optional):**
- `FRONTEND_REPO` - Default: `QuantTraderTools/QuantCopierTelegramUI`
- `FRONTEND_REF` - Default: `main`
- `BACKEND_REPO` - Default: `QuantTraderTools/qcdemo`
- `BACKEND_REF` - Default: `main`

**Output:**
- Installer uploaded to: `gs://<bucket>/installers/<tag>/<filename>.exe`
- Public download URL
- GitHub artifact (90 days retention)

---

### 2. `full-installer-pipeline.yml` - Full Installer Pipeline with Inno Setup

**Trigger:** 
- Automatically on GitHub Release published
- Manual dispatch via Actions UI

**What it does:**
1-7: Same as `build-installer.yml` (checkout, build sidecar, build Tauri)
8. Packages the Tauri installer with **Inno Setup** for custom installation experience
9. Uploads final Inno Setup installer to Firebase Storage
10. Creates GitHub Actions artifact

**Additional Requirements:**
- Inno Setup `.iss` script in the frontend repo root
- Inno Setup is automatically installed via Chocolatey during workflow

**Secrets Required:** Same as `build-installer.yml`

---

## Setup Instructions

### 1. Create Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file securely

### 2. Grant Permissions

The service account needs:
- **Storage Object Admin** role on the target bucket
- Navigate to [Google Cloud Console](https://console.cloud.google.com)
- Go to **Cloud Storage** → select your bucket
- Click **Permissions** tab
- Add the service account email with **Storage Object Admin** role

### 3. Encode Service Account Key

```bash
# Linux/Mac
base64 -i firebase-sa-key.json | tr -d '\n' > encoded-key.txt

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-sa-key.json")) | Out-File -Encoding ASCII encoded-key.txt
```

### 4. Add GitHub Secrets (in this Release Notes repo)

1. Go to your GitHub repo
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Base64-encoded JSON | `eyJ0eXBlIjoi...` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `quantcopierreleasenotes` |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket name | `quantcopierreleasenotes.appspot.com` |
| `FRONTEND_REPO_TOKEN` | GitHub PAT (if private) | `ghp_...` |
| `BACKEND_REPO_TOKEN` | GitHub PAT (if private) | `ghp_...` |
| `TAURI_PRIVATE_KEY` | (optional) Code signing key | |
| `TAURI_KEY_PASSWORD` | (optional) Key password | |

### 5. Configure Repository Variables (optional)

To override default repo/branch:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **Variables** tab
3. Add these variables:

| Variable Name | Default | Override Example |
|------------|-------|---------|
| `FRONTEND_REPO` | `QuantTraderTools/QuantCopierTelegramUI` | `yourorg/custom-frontend` |
| `FRONTEND_REF` | `main` | `release-v2.0` |
| `BACKEND_REPO` | `QuantTraderTools/qcdemo` | `yourorg/custom-backend` |
| `BACKEND_REF` | `main` | `dev` |

### 6. Test the Workflow

#### Option 1: Create a GitHub Release
1. Go to **Releases** → **Draft a new release**
2. Create a tag (e.g., `v1.0.0`)
3. Write release notes
4. Click **Publish release**
5. Workflow will trigger automatically

#### Option 2: Manual Trigger
1. Go to **Actions** tab
2. Select **Build and Upload Windows Installer** or **Full Installer Pipeline**
3. Click **Run workflow**
4. Enter optional release tag
5. Click **Run workflow**

---

## Architecture Overview

```
QuantCopierReleaseNotes (Orchestrator Repo)
├── .github/workflows/
│   ├── build-installer.yml        # Basic Tauri build
│   └── full-installer-pipeline.yml # Tauri + Inno Setup
├── scripts/
│   ├── upload_firebase.py         # Firebase Storage uploader
│   ├── release_to_json.js         # Release notes JSON generator
│   └── requirements.txt           # Python dependencies
└── README.md

External Repos (checked out during workflow):
├── QuantCopierTelegramUI (Frontend)
│   ├── src-tauri/                 # Tauri app
│   │   └── binaries/              # Sidecar binary placed here
│   ├── app/                       # Next.js frontend
│   └── QCTelegramMT5_SetupExe_Spec.iss # Inno Setup script
└── qcdemo (Backend)
    ├── QuantCopierTelegram.py     # Main Python script
    ├── QuantCopierTelegram.spec   # PyInstaller spec
    └── requirements.txt           # Python dependencies
```

---

## Troubleshooting

### Build fails with "Installer not found"
- Check `tauri.conf.json` bundle settings in the frontend repo
- Ensure `npm run tauri build` works locally in the frontend repo
- Check Tauri build logs in workflow

### Firebase upload fails
- Verify service account key is correctly base64-encoded
- Check bucket permissions (Storage Object Admin)
- Ensure bucket name matches your Firebase project

### Sidecar binary not found
- Check PyInstaller spec file in backend repo (`.spec`)
- Verify `requirements.txt` has all dependencies
- Check `dist/` folder structure after build

### Frontend/Backend checkout fails
- For private repos, add `FRONTEND_REPO_TOKEN` or `BACKEND_REPO_TOKEN` secrets
- Token needs `repo` scope for private repositories
- Verify repo names and branches are correct

### Secrets not found
- Verify secret names match exactly (case-sensitive)
- Check secrets are added to **this orchestrator repo**, not the frontend/backend repos
- For organization repos, check org-level secrets

### Slow builds
- First build: ~5-10 minutes (no cache)
- Subsequent builds: ~2-3 minutes (with cache)
- Rust and npm caches are stored between runs

---

## Security Best Practices

✅ **DO:**
- Use least-privilege service accounts (Storage Object Admin only)
- Store credentials in GitHub Secrets (encrypted at rest)
- Rotate service account keys periodically
- Review workflow logs for sensitive data leaks
- Use separate Firebase projects for dev/prod

❌ **DON'T:**
- Commit service account keys to repo
- Use overly-permissive IAM roles (Owner, Editor)
- Echo secrets in logs
- Share secrets between projects
- Grant public write access to Firebase Storage

---

## Monitoring & Artifacts

### Check Workflow Status
- Go to **Actions** tab in GitHub
- View recent workflow runs
- Click on a run for detailed logs

### Download Artifacts
- Open completed workflow run
- Scroll to **Artifacts** section
- Download `windows-installer-<tag>`

### Firebase Storage
- Check uploaded files at [Firebase Console](https://console.firebase.google.com)
- Navigate to **Storage** → `installers/` folder
- View file permissions and metadata

---

## Support

For issues:
1. Check workflow logs in GitHub Actions
2. Verify all secrets are set correctly
3. Test scripts locally first
4. Review Tauri build documentation

---

**Last Updated:** January 3, 2026
