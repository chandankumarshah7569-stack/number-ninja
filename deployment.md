# How to Publish Your Math Game

## Option 1: GitHub Pages (Recommended - FREE)

### Steps:
1. **Create a GitHub account** (if you don't have one)
   - Go to https://github.com/signup

2. **Create a new repository**
   - Click "New repository"
   - Name it: `math-game` (or any name you like)
   - Make it Public
   - Don't initialize with README (we already have one)

3. **Upload your files**
   
   **Method A: Using Git (Command Line)**
   ```bash
   # Open terminal in your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/math-game.git
   git push -u origin main
   ```

   **Method B: Using GitHub Website**
   - Go to your repository
   - Click "uploading an existing file"
   - Drag and drop all your files
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Click "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 1-2 minutes

5. **Your game is live!**
   - URL: `https://YOUR-USERNAME.github.io/math-game/`
   - Share this link with anyone!

---

## Option 2: Netlify (FREE - Drag & Drop)

### Steps:
1. Go to https://www.netlify.com/
2. Sign up for free
3. Click "Add new site" → "Deploy manually"
4. Drag your entire project folder
5. Done! You get a URL like: `https://random-name.netlify.app`
6. You can customize the domain name in settings

---

## Option 3: Vercel (FREE - Fast Deployment)

### Steps:
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Your site is live at: `https://your-project.vercel.app`

---

## Option 4: Render (FREE)

### Steps:
1. Go to https://render.com/
2. Sign up for free
3. Click "New" → "Static Site"
4. Connect your GitHub repository
5. Deploy!

---

## Option 5: Surge.sh (FREE - Command Line)

### Steps:
```bash
# Install surge globally
npm install -g surge

# Navigate to your project folder
cd path/to/your/project

# Deploy
surge
```
- Follow the prompts
- Your site will be at: `https://your-subdomain.surge.sh`

---

## Option 6: Cloudflare Pages (FREE)

### Steps:
1. Go to https://pages.cloudflare.com/
2. Sign up for free
3. Connect your GitHub account
4. Select your repository
5. Click "Begin setup" → "Save and Deploy"

---

## Custom Domain (Optional)

If you want a custom domain like `mathgame.com`:

1. Buy a domain from:
   - Namecheap (~$10/year)
   - Google Domains (~$12/year)
   - GoDaddy (~$15/year)

2. Connect it to your hosting:
   - GitHub Pages: Add CNAME file
   - Netlify/Vercel: Add domain in settings
   - Follow their documentation

---

## Recommended: GitHub Pages

**Why?**
- ✅ Completely FREE
- ✅ No credit card required
- ✅ Unlimited bandwidth
- ✅ Easy to update (just push to GitHub)
- ✅ Professional URL
- ✅ Automatic HTTPS
- ✅ Version control included

---

## After Publishing

### Share your game:
- Copy the URL
- Share on social media
- Add to your portfolio
- Send to friends and teachers

### Update your game:
- Make changes to your files
- Push to GitHub (or re-upload)
- Changes appear automatically!

---

## Need Help?

If you're stuck, you can:
1. Watch YouTube tutorials: "How to deploy to GitHub Pages"
2. Ask ChatGPT or AI assistants
3. Check the hosting platform's documentation

Good luck! 🚀
