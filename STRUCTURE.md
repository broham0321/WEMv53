# Deployment Folder Structure

This document explains the structure of the deployment folder.

## Root Files

- `package.json` - Project configuration and dependencies
- `package-lock.json` - Exact dependency versions
- `.htaccess` - Apache server configuration
- `next.config.mjs` - Next.js configuration
- `server.js` - Simple Node.js server for running the application
- `deployment-info.json` - Information about this deployment package
- `README.md` - Deployment instructions

## Directories

### `.next/`

Contains the compiled Next.js application:
- `.next/server/` - Server-side rendered pages
- `.next/static/` - Static assets and JavaScript bundles
- `.next/cache/` - Build cache (not included in deployment)

### `public/`

Static files that are served directly:
- Images
- Fonts
- Other static assets

### `node_modules/`

Third-party dependencies (optional, can be installed on the server).

### `.deploy-now/`

IONOS Deploy Now configuration files.

## Deployment Types

This structure supports multiple deployment options:

1. **Node.js Server** - Full server-side rendering capabilities
2. **Static Export** - For static hosting platforms
3. **IONOS Deploy Now** - Specialized for IONOS hosting

Choose the deployment type that best suits your needs.

