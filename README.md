# AI Gateway — Free GitHub Pages Hosting Guide

This guide walks you through deploying your promotional website to GitHub's free hosting with an automatic `.github.io` domain and free SSL certificate.

---

## 🚀 2-Minute Quick Setup

### Step 1: Create a GitHub Repository
1. Log in to your [GitHub Account](https://github.com).
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Choose your repository name:
   - **Option A (Root Domain - Recommended)**: Name the repository exactly `<your-username>.github.io` (e.g., `alex.github.io`). Your site will be published directly at `https://alex.github.io`.
   - **Option B (Project Sub-path)**: Name the repository anything else (e.g., `ai-gateway`). Your site will be published at `https://<your-username>.github.io/ai-gateway`.
4. Leave it **Public** and do NOT check "Add a README file". Click **Create repository**.

---

### Step 2: Push Your Code to GitHub
Run the automated script in your project root:
```cmd
DEPLOY-TO-GITHUB.bat
```
*Or manually via command line:*
```cmd
git init
git add .
git commit -m "Add promotional website and GitHub Pages workflow"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

### Step 3: Enable GitHub Pages (1-Click)
1. In your GitHub repository, click **Settings** &rarr; **Pages** (in the left sidebar).
2. Under **Build and deployment** &rarr; **Source**, select **`GitHub Actions`**.
3. That's it! GitHub Actions will automatically trigger and publish your website.

---

## 🌐 How to Customize Your Promotional Site

All website files are located in the `promo/` directory:
- **`promo/index.html`**:
  - Update the API Base URL (`https://api.hzapi.vip/v1` or your custom gateway domain).
  - Update your contact links (Telegram, Discord, QQ, WeChat, Email) in the footer.
  - Update your shop/CDK recharge URL in the CTA buttons.
- **`promo/styles.css`**: Color scheme and visual styling.
- **`promo/script.js`**: Pricing calculation logic and interactive components.

Whenever you make changes to files inside `promo/` and push to GitHub, your live website will update automatically within 60 seconds!
