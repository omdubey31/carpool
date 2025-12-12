# GitHub Setup Instructions

## Quick Setup (Automated)

Run the push script with your GitHub username:

```powershell
.\push-to-github.ps1 -GitHubUsername YOUR_USERNAME -RepoName carpool
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Manual Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `carpool` (or your preferred name)
3. Choose **Public** or **Private**
4. **IMPORTANT**: Do NOT initialize with README, .gitignore, or license
5. Click **"Create repository"**

### Step 2: Push Your Code

After creating the repository, run:

```powershell
.\push-to-github.ps1 -GitHubUsername YOUR_USERNAME -RepoName carpool
```

Or manually:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/carpool.git
git push -u origin main
```

### Step 3: Authentication

If you're prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)

## Your Repository Link

Once pushed, your repository will be available at:
**https://github.com/YOUR_USERNAME/carpool**

Replace `YOUR_USERNAME` with your actual GitHub username.

