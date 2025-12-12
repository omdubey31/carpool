# Complete GitHub Setup and Push Script
param(
    [string]$RepoName = "carpool"
)

Write-Host "=== GitHub Setup for CarPool Project ===" -ForegroundColor Cyan

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check git
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ Git is not available" -ForegroundColor Red
    exit 1
}

# Set branch to main
Write-Host "`nSetting branch to 'main'..." -ForegroundColor Yellow
git branch -M main 2>&1 | Out-Null

# Check GitHub CLI authentication
Write-Host "`nChecking GitHub authentication..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠ You need to authenticate with GitHub first." -ForegroundColor Yellow
    Write-Host "`nPlease run this command and follow the prompts:" -ForegroundColor White
    Write-Host "   gh auth login" -ForegroundColor Cyan
    Write-Host "`nChoose:" -ForegroundColor White
    Write-Host "   - GitHub.com" -ForegroundColor Yellow
    Write-Host "   - HTTPS" -ForegroundColor Yellow
    Write-Host "   - Login with a web browser" -ForegroundColor Yellow
    Write-Host "`nAfter authentication, run this script again." -ForegroundColor White
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✓ Authenticated with GitHub" -ForegroundColor Green

# Get GitHub username
$username = gh api user --jq .login
if (-not $username) {
    Write-Host "❌ Could not get GitHub username" -ForegroundColor Red
    exit 1
}
Write-Host "✓ GitHub username: $username" -ForegroundColor Green

# Check if repository already exists
Write-Host "`nChecking if repository exists..." -ForegroundColor Yellow
$repoExists = gh repo view "$username/$RepoName" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Repository already exists: https://github.com/$username/$RepoName" -ForegroundColor Green
} else {
    Write-Host "Creating new repository '$RepoName'..." -ForegroundColor Yellow
    gh repo create $RepoName --public --source=. --remote=origin --push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Repository created and code pushed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create repository" -ForegroundColor Red
        Write-Host "`nTrying alternative method..." -ForegroundColor Yellow
        
        # Alternative: Create repo without push, then push manually
        gh repo create $RepoName --public --source=. --remote=origin
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Repository created" -ForegroundColor Green
            Write-Host "`nPushing code..." -ForegroundColor Yellow
            git push -u origin main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Code pushed successfully!" -ForegroundColor Green
            } else {
                Write-Host "❌ Failed to push code" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "❌ Failed to create repository" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
Write-Host "`nYour repository is available at:" -ForegroundColor Cyan
Write-Host "   https://github.com/$username/$RepoName" -ForegroundColor Yellow
Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

