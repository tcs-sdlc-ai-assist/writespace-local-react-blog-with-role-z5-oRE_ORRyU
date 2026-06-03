# Deployment Guide

This document covers deployment configuration and hosting setup for the WriteSpace application.

## Table of Contents

- [Overview](#overview)
- [Build](#build)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment](#automatic-deployment)
  - [Manual Deployment](#manual-deployment)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Other Hosting Platforms](#other-hosting-platforms)
- [Environment Variables](#environment-variables)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)

## Overview

WriteSpace is a client-side single-page application (SPA) built with Vite and React. It produces a static `dist/` directory that can be served by any static hosting provider. There is no server-side component — all data is persisted in the browser's `localStorage`.

## Build

Create a production-optimized build:

```bash
npm run build
```

This runs `vite build` and outputs static assets to the `dist/` directory. The build includes:

- Minified JavaScript bundles
- Processed and purged Tailwind CSS
- Source maps for debugging (`sourcemap: true` in `vite.config.js`)
- `index.html` entry point

To preview the production build locally before deploying:

```bash
npm run preview
```

## Vercel Deployment

[Vercel](https://vercel.com/) is the recommended hosting platform. The project includes a `vercel.json` configuration file that handles SPA routing out of the box.

### Automatic Deployment

1. Push the repository to a Git provider (GitHub, GitLab, or Bitbucket).
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the repository from your Git provider.
4. Vercel auto-detects the Vite framework and applies the correct settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

Once connected, Vercel automatically deploys on every push to the default branch (e.g., `main`). Pull request branches receive preview deployments with unique URLs.

### Manual Deployment

If you prefer to deploy without connecting a Git repository, use the Vercel CLI:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy from the project root
vercel

# Deploy to production
vercel --prod
```

The CLI will prompt you to link the project to your Vercel account on first run.

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router v6. All routes (e.g., `/blogs`, `/admin/dashboard`, `/blogs/edit/:id`) must resolve to `index.html` so React Router can handle them.

The `vercel.json` file at the project root configures this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite rule catches all incoming requests and serves `index.html`, allowing React Router to match the URL and render the correct page component. Without this configuration, direct navigation to any route other than `/` would return a 404 error.

## Other Hosting Platforms

For any static hosting provider, follow these general steps:

1. Run `npm run build` to generate the `dist/` directory.
2. Upload or serve the contents of `dist/`.
3. Configure a catch-all redirect so all routes serve `index.html`.

### Netlify

Create a `_redirects` file in the `public/` directory (or `dist/` after build):

```
/*    /index.html   200
```

Or add a `netlify.toml` at the project root:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Nginx

Add the following to your Nginx server block:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Apache

Add a `.htaccess` file to the `dist/` directory:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. Use a `404.html` workaround:

1. Copy `dist/index.html` to `dist/404.html`.
2. Deploy the `dist/` directory to the `gh-pages` branch.

### Docker (Static Serve)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

WriteSpace does **not** require any environment variables. All data is stored client-side in `localStorage` under the following keys:

| Key | Description |
|---|---|
| `writespace_users` | Array of registered user objects |
| `writespace_posts` | Array of blog post objects |
| `writespace_session` | Current user session object |

A hard-coded admin account is available out of the box:

- **Username:** `admin`
- **Password:** `admin123`

No API keys, database connection strings, or server-side secrets are needed. If environment variables are added in the future, they must be prefixed with `VITE_` to be exposed to the client via `import.meta.env.VITE_*` (per Vite conventions).

## CI/CD

### Vercel Auto-Deploy

When the repository is connected to Vercel:

- **Production deploys** are triggered automatically on every push to the default branch (e.g., `main` or `master`).
- **Preview deploys** are created for every pull request branch, each with a unique URL for review.
- **Instant rollbacks** are available from the Vercel dashboard if a deployment introduces issues.

No additional CI/CD configuration is required. Vercel handles the install, build, and deploy steps automatically.

### Running Tests Before Deploy

To run the test suite before deploying, you can add a build command override in Vercel project settings:

```
npm run test && npm run build
```

Or configure this in `vercel.json`:

```json
{
  "buildCommand": "npm run test && npm run build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all tests pass before the production build is created. If any test fails, the deployment is blocked.

### GitHub Actions (Optional)

If you prefer a separate CI pipeline, create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm install
      - run: npm run test
      - run: npm run build
```

## Troubleshooting

### 404 on Page Refresh

If navigating directly to a route like `/blogs` or `/admin/dashboard` returns a 404, the hosting platform is not configured to serve `index.html` for all routes. Ensure the SPA rewrite/redirect rules described above are in place.

### Blank Page After Deploy

- Verify the build completed without errors by running `npm run build` locally.
- Check the browser console for JavaScript errors.
- Ensure the `dist/` directory contains `index.html` and the `assets/` folder with `.js` and `.css` files.

### Stale Data After Redeployment

Since all data is stored in `localStorage`, redeploying the application does not affect user data. Users retain their posts, accounts, and sessions across deployments. To reset data, users must clear their browser's `localStorage` for the site.

### Build Failures on Vercel

- Confirm `node_modules/` is listed in `.gitignore` and is not committed to the repository.
- Ensure `package.json` and `package-lock.json` are both committed.
- Verify the Node.js version is 18 or higher in Vercel project settings.