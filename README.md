# IONOS Deploy Now Configuration

This directory contains configuration files for deploying your Next.js application on IONOS Deploy Now.

## Setup Instructions

1. Sign up for an IONOS Deploy Now account at https://ionos.com/hosting/deploy-now
2. Create a new project and connect it to your GitHub repository
3. Add the following secrets to your GitHub repository:
   - `IONOS_API_KEY`: Your IONOS API key
   - `IONOS_SERVICE_ID`: Your IONOS service ID
   - `IONOS_PROJECT_ID`: Your IONOS project ID
   - `IONOS_BRANCH_ID`: Your IONOS branch ID

These values can be found in your IONOS Deploy Now dashboard after creating a project.

## Deployment

Once configured, your application will automatically deploy to IONOS whenever you push to the main branch.

