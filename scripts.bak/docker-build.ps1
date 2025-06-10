# Docker Build Script for Windows PowerShell
Write-Host "===== Building Vacancy.service for Production =====" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with the required environment variables." -ForegroundColor Yellow
    Write-Host "You can use .env.example as a template." -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Validate required environment variables
$requiredVars = @("DATABASE_URL", "REDIS_URL", "JWT_SECRET")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not [Environment]::GetEnvironmentVariable($var)) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "ERROR: Missing required environment variables:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "`nEnvironment variables loaded successfully!" -ForegroundColor Green

# Stop any running containers
Write-Host "`nStopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.production.yml down

# Build the production image
Write-Host "`nBuilding Docker image..." -ForegroundColor Yellow
docker-compose -f docker-compose.production.yml build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nBuild completed successfully!" -ForegroundColor Green

# Ask if user wants to start the container
$response = Read-Host "`nDo you want to start the container now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`nStarting container..." -ForegroundColor Yellow
    docker-compose -f docker-compose.production.yml up -d
    
    Write-Host "`nWaiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check health
    Write-Host "`nChecking service health..." -ForegroundColor Yellow
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
        Write-Host "Service is healthy!" -ForegroundColor Green
        Write-Host "Database: $($health.services.database)" -ForegroundColor Cyan
        Write-Host "Redis: $($health.services.redis)" -ForegroundColor Cyan
    } catch {
        Write-Host "WARNING: Health check failed. Service might still be starting..." -ForegroundColor Yellow
    }
    
    Write-Host "`nApplication is running at: http://localhost:3000" -ForegroundColor Green
    Write-Host "To view logs: docker-compose -f docker-compose.production.yml logs -f" -ForegroundColor Cyan
    Write-Host "To stop: docker-compose -f docker-compose.production.yml down" -ForegroundColor Cyan
} 