# IONOS Deployment Guide

This guide provides step-by-step instructions for deploying your Next.js application to IONOS Deploy Now.

## Prerequisites

1. An IONOS account with Deploy Now access
2. Your project code in a GitHub repository

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository contains the following files:
- `.deploy-now/config.yaml` - Configuration for Deploy Now
- `.github/workflows/ionos-deploy.yml` - GitHub Actions workflow
- `.htaccess` - Apache server configuration

### 2. Connect to IONOS Deploy Now

1. Log in to your IONOS account
2. Navigate to Deploy Now
3. Click "Create new project"
4. Select "From GitHub repository"
5. Authorize IONOS to access your GitHub account
6. Select your repository

### 3. Configure Your Project

1. Choose "Next.js" as your framework
2. Configure your build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Set up environment variables:
   - PORT: `8080` (Recommended port for IONOS Deploy Now)
   - Add any other environment variables your application needs

### 4. Deploy Your Project

1. Click "Deploy" to start the deployment process
2. IONOS will clone your repository, build your application, and deploy it
3. Once deployment is complete, you'll receive a URL for your application

### 5. Set Up Custom Domain (Optional)

1. In the IONOS Deploy Now dashboard, go to your project
2. Click "Domains"
3. Click "Add domain"
4. Enter your domain name
5. Follow the instructions to configure DNS settings

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs in the IONOS Deploy Now dashboard
2. Verify that your application builds successfully locally
3. Ensure all required environment variables are set
4. Check that your `.deploy-now/config.yaml` file is correctly configured

## Additional Resources

- [IONOS Deploy Now Documentation](https://docs.ionos.com/deploy-now)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

