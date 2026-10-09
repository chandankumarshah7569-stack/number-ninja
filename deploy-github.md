# Quick GitHub Pages Deployment

## Prerequisites
- Git installed on your computer
- GitHub account created

## Step-by-Step Commands

### 1. Open Terminal/Command Prompt in your project folder

**Windows:**
- Right-click in the folder → "Open in Terminal" or "Git Bash Here"

**Mac/Linux:**
- Right-click → "Open Terminal Here"

### 2. Run these commands one by one:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Math Game"

# Set main branch
git branch -M main

# Add your GitHub repository (REPLACE with your actual URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in left sidebar
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"

### 4. Wait 1-2 minutes

Your site will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

---

## Troubleshooting

### "git is not recognized"
- Install Git: https://git-scm.com/downloads

### "Permission denied"
- Make sure you're logged into GitHub
- Use HTTPS URL, not SSH

### "Repository not found"
- Make sure you created the repository on GitHub first
- Check the URL is correct

### Files not showing
- Make sure `index.html` is in the root folder
- Check GitHub Pages settings are correct

---

## Updating Your Game

After making changes:

```bash
git add .
git commit -m "Updated game features"
git push
```

Changes will appear on your site in 1-2 minutes!
