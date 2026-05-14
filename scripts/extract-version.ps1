# extract-version.ps1
# =====================================================
# Extract version from GitHub release tag or markdown
# and apply it to PyInstaller and Inno Setup configs
# =====================================================

param(
    [Parameter(Mandatory = $false)]
    [string]$ReleaseTag = "",
    
    [Parameter(Mandatory = $false)]
    [string]$MarkdownFile = "md_docs/DELIVERY_SUMMARY.md",
    
    [Parameter(Mandatory = $false)]
    [string]$PyInstallerSpec = "QuantCopierUI/Backend/QuantCopierAPI.spec",
    
    [Parameter(Mandatory = $false)]
    [string]$InnoSetupScript = "QuantCopierUI/QCTelegramMT5_SetupExe_Spec.iss"
)

# =====================================================
# STEP 1: Extract version
# =====================================================
Write-Host "🔍 Extracting version information..." -ForegroundColor Cyan

$version = $null

# Priority 1: Use provided release tag
if ($ReleaseTag -and $ReleaseTag -match "^v?(\d+\.\d+\.\d+.*)$") {
    $version = $ReleaseTag -replace "^v", ""
    Write-Host "  ✓ From ReleaseTag parameter: $version" -ForegroundColor Green
}
# Priority 2: Try to extract from GitHub Actions environment variable
elseif ($env:RELEASE_TAG -and $env:RELEASE_TAG -match "^v?(\d+\.\d+\.\d+.*)$") {
    $version = $env:RELEASE_TAG -replace "^v", ""
    Write-Host "  ✓ From RELEASE_TAG env var: $version" -ForegroundColor Green
}
# Priority 3: Extract from first markdown file with version pattern
else {
    if (Test-Path $MarkdownFile) {
        $content = Get-Content $MarkdownFile -Raw
        if ($content -match "version.*?(\d+\.\d+\.\d+)") {
            $version = $matches[1]
            Write-Host "  ✓ From markdown file: $version" -ForegroundColor Green
        }
    }
}

# Priority 4: Use git tag if available
if (-not $version) {
    try {
        $gitTag = & git describe --tags --abbrev=0 2>$null
        if ($gitTag -match "^v?(\d+\.\d+\.\d+.*)$") {
            $version = $gitTag -replace "^v", ""
            Write-Host "  ✓ From git tag: $version" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ⚠ Could not get git tag" -ForegroundColor Yellow
    }
}

# Fallback
if (-not $version) {
    $version = "1.0.0"
    Write-Host "  ⚠ No version found, using default: $version" -ForegroundColor Yellow
}

Write-Host "  📦 Final version: $version" -ForegroundColor Yellow
Write-Host ""

# =====================================================
# STEP 2: Update PyInstaller spec file
# =====================================================
Write-Host "🐍 Updating PyInstaller spec..." -ForegroundColor Cyan

if (Test-Path $PyInstallerSpec) {
    $specContent = Get-Content $PyInstallerSpec -Raw
    
    # Check if version already exists
    if ($specContent -match "version\s*=\s*['\"]([^'\"]+)['\"]") {
        # Replace existing version
        $specContent = $specContent -replace "version\s*=\s*['\"][^'\"]+['\"]", "version='$version'"
        Write-Host "  ✓ Updated existing version" -ForegroundColor Green
    }
    else {
        # Add version to EXE() parameters
        $specContent = $specContent -replace "(name='QuantCopierAPI',)", "name='QuantCopierAPI',`n    version='$version',"
        Write-Host "  ✓ Added new version parameter" -ForegroundColor Green
    }
    
    Set-Content $PyInstallerSpec -Value $specContent -Encoding UTF8 -NoNewline
    Write-Host "  📄 File: $PyInstallerSpec" -ForegroundColor Yellow
}
else {
    Write-Host "  ❌ PyInstaller spec not found: $PyInstallerSpec" -ForegroundColor Red
}

Write-Host ""

# =====================================================
# STEP 3: Update Inno Setup script
# =====================================================
Write-Host "📦 Updating Inno Setup script..." -ForegroundColor Cyan

if (Test-Path $InnoSetupScript) {
    $issContent = Get-Content $InnoSetupScript -Raw
    
    # Update version define
    $issContent = $issContent -replace '#define MyAppVersion "([^"]+)"', "#define MyAppVersion ""$version"""
    
    # Also update file version if it exists
    if ($issContent -match '#define MyFileVersion') {
        $issContent = $issContent -replace '#define MyFileVersion "([^"]+)"', "#define MyFileVersion ""$version"""
        Write-Host "  ✓ Updated MyFileVersion" -ForegroundColor Green
    }
    else {
        # Add file version right after app version
        $issContent = $issContent -replace "(#define MyAppVersion ""$version"")", "`$1`n#define MyFileVersion ""$version"""
        Write-Host "  ✓ Added MyFileVersion" -ForegroundColor Green
    }
    
    Write-Host "  ✓ Updated version to: $version" -ForegroundColor Green
    
    Set-Content $InnoSetupScript -Value $issContent -Encoding UTF8 -NoNewline
    Write-Host "  📄 File: $InnoSetupScript" -ForegroundColor Yellow
}
else {
    Write-Host "  ❌ Inno Setup script not found: $InnoSetupScript" -ForegroundColor Red
}

Write-Host ""

# =====================================================
# STEP 4: Output for GitHub Actions
# =====================================================
Write-Host "📤 Setting GitHub Actions outputs..." -ForegroundColor Cyan

if ($env:GITHUB_OUTPUT) {
    # This runs in GitHub Actions
    echo "VERSION=$version" >> $env:GITHUB_OUTPUT
    echo "VERSION_CLEAN=$($version -replace '^v', '')" >> $env:GITHUB_OUTPUT
    Write-Host "  ✓ Set GITHUB_OUTPUT variables" -ForegroundColor Green
}
else {
    # Local development
    Write-Host "  ℹ GitHub Actions environment not detected (local execution)" -ForegroundColor Cyan
    Write-Host "  ✓ Version extracted: $version" -ForegroundColor Green
}

Write-Host ""

# =====================================================
# STEP 5: Summary
# =====================================================
Write-Host "✅ Version extraction complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  Version: $version"
Write-Host "  PyInstaller spec: $PyInstallerSpec"
Write-Host "  Inno Setup script: $InnoSetupScript"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify spec files are updated correctly"
Write-Host "  2. Build with: pyinstaller $($PyInstallerSpec.Split('/')[-1])"
Write-Host "  3. Build with: ISCC.exe $($InnoSetupScript.Split('/')[-1])"
Write-Host ""

exit 0
