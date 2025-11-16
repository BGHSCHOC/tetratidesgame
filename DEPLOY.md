# Deploying TetraTides to GitHub Pages

This guide will help you deploy your TetraTides game to GitHub Pages.

## Setup Steps

### 1. Push Latest Changes to GitHub

Use the "Push to GitHub" button in the game's home screen to upload all your files including the new deployment configuration.

### 2. Enable GitHub Pages

1. Go to your repository on GitHub (e.g., `https://github.com/YOUR_USERNAME/tetratides-game`)
2. Click on **Settings** (top navigation bar)
3. Scroll down and click on **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. Click **Save**

### 3. Automatic Deployment

The GitHub Actions workflow will automatically:
- Build your game whenever you push changes to the `main` branch
- Deploy it to GitHub Pages

### 4. Access Your Game

After the deployment completes (usually 2-3 minutes), your game will be available at:

```
https://YOUR_USERNAME.github.io/REPOSITORY_NAME/
```

For example:
- If your username is `john` and repository is `tetratides-game`
- Your game URL will be: `https://john.github.io/tetratides-game/`

## Checking Deployment Status

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see the deployment workflow running
4. Once it shows a green checkmark ✓, your game is live!

## Troubleshooting

### Game shows blank page
- Make sure GitHub Pages is enabled in Settings → Pages
- Check that "Source" is set to "GitHub Actions"
- Wait a few minutes after the first deployment

### Workflow fails
- Check the Actions tab for error messages
- Make sure all files were pushed to GitHub
- The workflow needs the `dist/public` folder to be created during build

## Re-deploying

Every time you push changes to the `main` branch on GitHub, your game will automatically rebuild and redeploy!

---

**Note**: This deployment is for the frontend game only. The backend features (like GitHub integration) won't work on GitHub Pages since it's a static hosting service.
