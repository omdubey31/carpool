# Push to GitHub Script
param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "carpool"
)

Write-Host "=== Pushing CarPool to GitHub ===" -ForegroundColor Cyan

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if git is available
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Git not found"
    }
} catch {
    Write-Host "❌ Git is not available. Please install Git first." -ForegroundColor Red
    exit 1
}

# Set branch to main
Write-Host "`nSetting branch to 'main'..." -ForegroundColor Yellow
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: Could not rename branch (might already be main)" -ForegroundColor Yellow
}

# Add remote
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "`nAdding remote 'origin'..." -ForegroundColor Yellow
git remote remove origin 2>&1 | Out-Null
git remote add origin $remoteUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add remote" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Remote added: $remoteUrl" -ForegroundColor Green

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Push failed. Common reasons:" -ForegroundColor Red
    Write-Host "   1. Repository doesn't exist on GitHub yet" -ForegroundColor White
    Write-Host "   2. Authentication required (you may need to use a Personal Access Token)" -ForegroundColor White
    Write-Host "   3. Network issues" -ForegroundColor White
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "   1. Make sure the repository exists at: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor White
    Write-Host "   2. If using HTTPS, you may need to use a Personal Access Token instead of password" -ForegroundColor White
    Write-Host "      Get one at: https://github.com/settings/tokens" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "`nYour repository is available at:" -ForegroundColor Cyan
Write-Host "   https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Yellow
Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

