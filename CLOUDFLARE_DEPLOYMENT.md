# Cloudflare Pages Deployment Guide

## Prerequisites
- Cloudflare account (free tier works)
- Project pushed to GitHub (already done ✓)
- pnpm installed locally

## Step-by-step Deployment

### 1. Prepare Your Project
The project is already configured! Key files created:
- ✅ `wrangler.toml` - Cloudflare configuration
- ✅ `_redirects` - SPA routing rules
- ✅ `package.json` - Updated with build scripts

### 2. Deploy to Cloudflare Pages

#### Option A: Using Cloudflare Dashboard (Recommended)
1. Go to https://dash.cloudflare.com
2. Click "Pages" → "Create a project"
3. Choose "Connect to Git"
4. Select repository: `venom083/soly-birthday`
5. Configure build settings:
   - **Framework**: None (custom)
   - **Build command**: `pnpm install && pnpm run build:site`
   - **Build output directory**: `artifacts/birthday-site/dist/public`
   - **Root directory**: `/`
6. Click "Save and Deploy"
7. Cloudflare will automatically deploy on every push to `main`

#### Option B: Using Wrangler CLI
```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy from the site folder
cd artifacts/birthday-site
wrangler pages deploy dist/public --project-name soly-birthday
```

#### Recommended pnpm workspace command
```bash
pnpm --dir artifacts/birthday-site exec wrangler pages deploy dist/public --project-name soly-birthday
```

### 3. Custom Domain Setup (Optional)
1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add your domain
4. Update DNS records as instructed

### 4. Environment Variables (If Needed)
1. Go to project Settings → Environment variables
2. Add variables for production environment:
   - `API_URL` - Your API endpoint (if deploying API separately)
   - Any other secrets or configuration

## Testing Before Deployment

Local test:
```bash
pnpm run build:site
pnpm --filter @workspace/birthday-site run serve
```

Then visit `http://localhost:5000` (default preview port)

## Monitoring

After deployment:
- Check deployment logs: Project → Deployments
- View Analytics: Project → Analytics
- Monitor build failures: Project → Builds

## Notes

- **Free tier limit**: 500 deployments/month (plenty for development)
- **SPA routing**: Already configured with `_redirects` file
- **Auto-deployment**: Enabled when connected to GitHub
- **Build time**: Usually ~2-3 minutes on first deployment

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `Build command` in dashboard matches wrangler.toml |
| Routes not working | Verify `_redirects` file exists in `artifacts/birthday-site/public/` |
| Blank page | Check browser console for errors; verify dist folder has files |
| 404 errors | SPA routing enabled - `_redirects` rule should catch all paths |

## Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite + Cloudflare Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite-project/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/wrangler/)
