# GitHub Setup Script for CarPool Project
Write-Host "=== GitHub Setup for CarPool Project ===" -ForegroundColor Cyan

# Check if git is installed
$gitInstalled = $false
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $gitInstalled = $true
        Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
    }
} catch {
    $gitInstalled = $false
}

if (-not $gitInstalled) {
    Write-Host "`n❌ Git is not installed or not in PATH." -ForegroundColor Red
    Write-Host "`nPlease install Git using one of these methods:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Or use winget: winget install --id Git.Git -e --source winget" -ForegroundColor White
    Write-Host "`nAfter installing Git, please:" -ForegroundColor Yellow
    Write-Host "- Restart your terminal/PowerShell" -ForegroundColor White
    Write-Host "- Run this script again" -ForegroundColor White
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check if already a git repository
if (Test-Path ".git") {
    Write-Host "`n✓ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to initialize git repository" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Check git config
Write-Host "`nChecking Git configuration..." -ForegroundColor Yellow
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "`n⚠ Git user configuration is missing" -ForegroundColor Yellow
    Write-Host "Please configure your Git identity:" -ForegroundColor White
    Write-Host "  git config --global user.name 'Your Name'" -ForegroundColor Cyan
    Write-Host "  git config --global user.email 'your.email@example.com'" -ForegroundColor Cyan
    Write-Host "`nOr configure locally for this repository:" -ForegroundColor White
    Write-Host "  git config user.name 'Your Name'" -ForegroundColor Cyan
    Write-Host "  git config user.email 'your.email@example.com'" -ForegroundColor Cyan
    Write-Host "`nPress any key to continue (you can configure later)..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Add all files
Write-Host "`nAdding files to Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Files added" -ForegroundColor Green

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "`nCreating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: CarPool - Car Pooling Website"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create commit" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "`n✓ No changes to commit (repository is up to date)" -ForegroundColor Green
}

# Check for remote
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "`n1. Create a new repository on GitHub:" -ForegroundColor White
    Write-Host "   - Go to: https://github.com/new" -ForegroundColor Yellow
    Write-Host "   - Repository name: carpool (or your preferred name)" -ForegroundColor Yellow
    Write-Host "   - Choose Public or Private" -ForegroundColor Yellow
    Write-Host "   - DO NOT initialize with README, .gitignore, or license" -ForegroundColor Yellow
    Write-Host "   - Click 'Create repository'" -ForegroundColor Yellow
    Write-Host "`n2. After creating the repository, run these commands:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/carpool.git" -ForegroundColor Cyan
    Write-Host "   git branch -M main" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host "`n   (Replace YOUR_USERNAME with your GitHub username)" -ForegroundColor Yellow
    Write-Host "`nOr if you prefer SSH:" -ForegroundColor White
    Write-Host "   git remote add origin git@github.com:YOUR_USERNAME/carpool.git" -ForegroundColor Cyan
    Write-Host "   git branch -M main" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
} else {
    Write-Host "`n✓ Remote 'origin' is already configured: $remote" -ForegroundColor Green
    Write-Host "`nTo push to GitHub, run:" -ForegroundColor Yellow
    Write-Host "   git branch -M main" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

