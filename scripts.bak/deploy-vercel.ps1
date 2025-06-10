# Vercel Deployment Script for Windows PowerShell
Write-Host "===== Deploying Vacancy.service to Vercel =====" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI version: $vercelVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Please install Vercel CLI: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with the required environment variables." -ForegroundColor Yellow
    exit 1
}

Write-Host "`nPre-deployment checks..." -ForegroundColor Yellow

# Run build locally to check for errors
Write-Host "Running local build test..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed! Please fix the errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "`nBuild test passed!" -ForegroundColor Green

# Confirm deployment
Write-Host "`nIMPORTANT: Make sure you have configured the following environment variables in Vercel Dashboard:" -ForegroundColor Yellow
Write-Host "  - DATABASE_URL (Supabase PostgreSQL connection string)" -ForegroundColor Cyan
Write-Host "  - REDIS_URL (Your Redis server connection string)" -ForegroundColor Cyan
Write-Host "  - JWT_SECRET (A secure secret key)" -ForegroundColor Cyan
Write-Host "  - Any other required environment variables" -ForegroundColor Cyan

$response = Read-Host "`nHave you configured all environment variables in Vercel? (y/n)"
if ($response -ne 'y' -and $response -ne 'Y') {
    Write-Host "Please configure environment variables first at: https://vercel.com/dashboard/project/[your-project]/settings/environment-variables" -ForegroundColor Yellow
    exit 0
}

# Deploy to Vercel
Write-Host "`nStarting deployment to Vercel..." -ForegroundColor Yellow

$deployType = Read-Host "Deploy to production or preview? (prod/preview)"

if ($deployType -eq 'prod' -or $deployType -eq 'production') {
    Write-Host "Deploying to PRODUCTION..." -ForegroundColor Red
    vercel --prod
} else {
    Write-Host "Deploying to PREVIEW..." -ForegroundColor Yellow
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment completed successfully!" -ForegroundColor Green
    Write-Host "Check your Vercel dashboard for the deployment URL." -ForegroundColor Cyan
} else {
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above and try again." -ForegroundColor Yellow
} 