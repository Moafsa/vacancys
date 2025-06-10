# CI/CD Configuration for Core Module

This document describes the Continuous Integration and Continuous Deployment setup for the Core Module of the Vacancy application.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and consists of two main workflows:
1. **Continuous Integration (CI)** - Triggered on every push and pull request to verify code quality and test coverage.
2. **Continuous Deployment (CD)** - Automatically deploys the application to staging after successful merges to main, and to production when a new version tag is created.

## Continuous Integration

File: `.github/workflows/ci.yml`

The CI workflow performs the following steps:
- Sets up the required services (PostgreSQL and Redis)
- Checks out the code
- Installs dependencies
- Runs linting
- Sets up the database schema
- Runs tests
- Generates and uploads test coverage reports

### Triggering CI

The CI workflow is triggered:
- On every push to the `main` and `develop` branches
- On every pull request targeting the `main` and `develop` branches
- Only when changes are made in the `modules/core` directory

## Continuous Deployment

File: `.github/workflows/cd.yml`

The CD workflow performs the following steps:
- Checks out the code
- Builds the application
- Creates a Docker image
- Pushes the Docker image to Docker Hub
- Deploys to the staging environment (for merges to `main`)
- Deploys to the production environment (for version tags)

### Triggering CD

The CD workflow is triggered:
- On pushes to the `main` branch (deploys to staging)
- On creation of version tags like `v1.0.0` (deploys to production)
- Only when changes are made in the `modules/core` directory

## Deployment Environments

### Staging

- Docker Compose file: `docker-compose.staging.yml`
- Environment variables are stored in GitHub Secrets
- Single instance deployment
- Moderate logging (info level)

### Production

- Docker Compose file: `docker-compose.production.yml`
- Environment variables are stored in GitHub Secrets
- Multi-replica deployment with resource limits
- Minimal logging (error level only)

## Required Secrets

The following secrets need to be configured in the GitHub repository:

- `DOCKER_HUB_USERNAME`: Username for Docker Hub
- `DOCKER_HUB_TOKEN`: Access token for Docker Hub
- `DEPLOY_TOKEN`: Token used for deployment authentication
- `STAGING_SSH_KEY`: SSH key for the staging server
- `PRODUCTION_SSH_KEY`: SSH key for the production server

## Manual Deployment

In addition to the automated CI/CD pipelines, a manual deployment script is available:

```bash
./scripts/deploy.sh [environment]
```

Where `[environment]` can be:
- `dev`: Local development environment
- `staging`: Staging environment
- `production`: Production environment

## Monitoring

After deployment, the application health can be monitored through:
- Health check endpoint: `/api/health`
- Docker health checks built into the container
- Docker logs and metrics

## Rollback Procedure

In case of deployment issues:

1. Identify the last stable version tag
2. Trigger a manual deployment of that version:
   ```bash
   ./scripts/deploy.sh production v1.2.3
   ```
3. Alternatively, roll back using Docker:
   ```bash
   docker pull vacancy/core-module:v1.2.3
   docker-compose -f docker-compose.production.yml up -d
   ``` 