# CI/CD Setup Guide

Complete guide for setting up automated builds and releases for QuantCopier.

---

## 🎯 Overview

This CI/CD pipeline automatically:
1. ✅ Builds Windows installer (.exe) when you publish a GitHub Release
2. ✅ Uploads installer to Firebase Storage
3. ✅ Generates public download URL
4. ✅ Creates GitHub Actions artifacts for developers

**Build time:** ~2-3 minutes (with cache)

---

## 📋 Prerequisites

- GitHub repository (private OK)
- Firebase project with Storage enabled
- Google Cloud project (same as Firebase)

---

## 🔧 Setup Steps

### Step 1: Create Firebase Service Account

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project (e.g., `quantcopierreleasenotes`)
3. Go to **⚙️ Project Settings** (top left gear icon)
4. Click **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** in confirmation dialog
7. Save the JSON file as `firebase-sa-key.json`
8. ⚠️ **Keep this file secure and never commit it to Git**

### Step 2: Grant Storage Permissions

1. Open [Google Cloud Console](https://console.cloud.google.com)
2. Select the same project
3. Navigate to **Cloud Storage** → **Browser**
4. Click on your bucket (e.g., `quantcopierreleasenotes.appspot.com`)
5. Click **Permissions** tab
6. Click **+ Grant Access**
7. In "Add principals", paste the service account email from the JSON file
   - Format: `firebase-adminsdk-xxxxx@yourproject.iam.gserviceaccount.com`
8. In "Select a role", choose:
   - **Cloud Storage** → **Storage Object Admin**
9. Click **Save**

### Step 3: Encode Service Account Key to Base64

**Windows (PowerShell):**
```powershell
$json = Get-Content firebase-sa-key.json -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$base64 = [Convert]::ToBase64String($bytes)
$base64 | Out-File -Encoding ASCII encoded-key.txt
Write-Host "Encoded key saved to encoded-key.txt"
```

**Linux/Mac:**
```bash
base64 -i firebase-sa-key.json | tr -d '\n' > encoded-key.txt
echo "Encoded key saved to encoded-key.txt"
```

**Manual (any platform):**
```bash
cat firebase-sa-key.json | base64
# Copy the output (entire single line)
```

### Step 4: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **⚙️ Settings** tab
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add these 3 required secrets:

#### Secret 1: FIREBASE_SERVICE_ACCOUNT_KEY
- **Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`
- **Value:** Paste the entire base64 string from `encoded-key.txt`
- Click **Add secret**

#### Secret 2: FIREBASE_PROJECT_ID
- **Name:** `FIREBASE_PROJECT_ID`
- **Value:** Your Firebase project ID (e.g., `quantcopierreleasenotes`)
- Click **Add secret**

#### Secret 3: FIREBASE_STORAGE_BUCKET
- **Name:** `FIREBASE_STORAGE_BUCKET`
- **Value:** Your bucket name (e.g., `quantcopierreleasenotes.appspot.com`)
- Click **Add secret**

#### Optional Secrets (for code signing):
- `TAURI_PRIVATE_KEY` - Tauri code signing private key
- `TAURI_KEY_PASSWORD` - Password for the private key

### Step 5: Install Python Dependencies (Local Testing)

```bash
cd QuantCopierUi
pip install -r scripts/requirements.txt
```

### Step 6: Verify Workflow Files

Check these files exist:
```
QuantCopierUi/
  ├── .github/workflows/
  │   └── build-installer.yml          ✓ Main workflow
  ├── scripts/
  │   ├── upload_firebase.py           ✓ Upload script
  │   ├── release_to_json.js           ✓ JSON generator
  │   └── requirements.txt             ✓ Python deps
  └── CICD_SETUP.md                    ✓ This file
```

---

## 🚀 Usage

### Method 1: Publish a GitHub Release (Recommended)

1. Go to your repo → **Releases** → **Draft a new release**
2. Click **Choose a tag** → create new tag (e.g., `v1.0.0`)
3. Fill in release details:
   - **Release title:** `Version 1.0.0`
   - **Description:** Your changelog
4. Click **Publish release**
5. Workflow triggers automatically
6. Monitor progress in **Actions** tab

### Method 2: Manual Workflow Run

1. Go to **Actions** tab
2. Select **Build and Upload Windows Installer**
3. Click **Run workflow** dropdown
4. (Optional) Enter release tag
5. Click **Run workflow** button

---

## 📥 Download Installer

### For End Users (Public Download):

After workflow completes, the installer is available at:
```
https://firebasestorage.googleapis.com/v0/b/<bucket>/o/installers%2F<tag>%2F<filename>.exe?alt=media
```

Example:
```
https://firebasestorage.googleapis.com/v0/b/quantcopierreleasenotes.appspot.com/o/installers%2Fv1.0.0%2FQuantCopier.exe?alt=media
```

### For Developers (GitHub Artifact):

1. Go to completed workflow run
2. Scroll to **Artifacts** section
3. Download `windows-installer-<tag>.zip`
4. Extract the .exe

---

## 🔍 Monitoring

### Check Workflow Status
- **Actions** tab → recent runs
- Green ✅ = success
- Red ❌ = failed (click for logs)

### View Uploaded Files
1. [Firebase Console](https://console.firebase.google.com) → Storage
2. Browse `installers/` folder
3. Click file → see metadata and URL

### Read Workflow Logs
1. Click on workflow run
2. Click on job name
3. Expand steps to see detailed logs

---

## 🐛 Troubleshooting

### ❌ "FIREBASE_SERVICE_ACCOUNT_KEY secret is not set"
**Solution:** Add the secret in GitHub Settings → Secrets → Actions

### ❌ "Upload to Firebase Storage failed"
**Causes:**
- Service account doesn't have Storage Object Admin role
- Bucket name is incorrect
- Service account key is invalid

**Solution:**
1. Verify bucket permissions in Google Cloud Console
2. Check service account email matches the one in JSON
3. Re-generate and re-encode the key

### ❌ "Installer not found"
**Causes:**
- Tauri build failed
- Build output location changed

**Solution:**
1. Check Tauri build logs in workflow
2. Test `npm run tauri build` locally
3. Verify `src-tauri/tauri.conf.json` bundle settings

### ⚠️ Slow builds (>10 minutes)
**Causes:**
- First build (no cache)
- Large dependencies

**Solution:**
- First build is always slower (~5-10 min)
- Subsequent builds use cache (~2-3 min)
- Cache is stored for 7 days

### ❌ "Permission denied" when uploading
**Solution:**
1. Verify service account has **Storage Object Admin** role
2. Check bucket name matches exactly
3. Ensure service account is from the same project

---

## 🔒 Security Best Practices

✅ **Good:**
- Store credentials in GitHub Secrets (encrypted)
- Use least-privilege service account (Storage Object Admin only)
- Rotate service account keys every 90 days
- Delete old service account keys after rotation

❌ **Bad:**
- Commit service account keys to repo
- Use Owner or Editor roles
- Share secrets between projects
- Echo secrets in workflow logs

---

## 📊 What Gets Built

```
src-tauri/target/release/bundle/
   ├── nsis/
   │   └── QuantCopier.exe    ← Uploaded to Firebase
   └── msi/
         └── QuantCopier_1.0.0_x64_en-US.msi
```

**Upload destination:**
```
gs://<bucket>/Telegram/installers/<tag>/<filename>.exe
```

---

## 🎯 Expected Output

After successful workflow:

```
================================================
  BUILD COMPLETE
================================================

Release Tag:      v1.0.0
   Installer:        QuantCopier.exe
   Firebase Path:    gs://quantcopierreleasenotes.appspot.com/installers/v1.0.0/QuantCopier.exe
Download URL:     https://firebasestorage.googleapis.com/...

================================================
```

---

## 📚 Additional Resources

- [Tauri Build Documentation](https://tauri.app/v1/guides/building/)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Google Cloud Storage IAM](https://cloud.google.com/storage/docs/access-control/iam)

---

## 🆘 Still Having Issues?

1. ✅ Verify all secrets are set correctly
2. ✅ Check service account permissions
3. ✅ Test upload script locally:
   ```bash
   python scripts/upload_firebase.py \
     --bucket "your-bucket.appspot.com" \
     --file "test.txt" \
     --dest "test/test.txt" \
     --credentials "firebase-sa-key.json"
   ```
4. ✅ Review workflow logs line-by-line
5. ✅ Test Tauri build locally: `npm run tauri build`

---

**Setup Complete! 🎉**

You can now publish GitHub Releases and get automatic installer builds!
