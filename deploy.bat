@echo off

echo Stopping running containers...
docker-compose down

echo Building new images...
docker-compose build

echo Starting containers...
docker-compose up -d

echo Container status:
docker-compose ps

echo Deployment complete! 