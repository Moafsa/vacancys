#!/bin/bash

# Stop any running containers
echo "Stopping running containers..."
docker-compose down

# Build the new images
echo "Building new images..."
docker-compose build

# Start the containers
echo "Starting containers..."
docker-compose up -d

# Show container status
echo "Container status:"
docker-compose ps

echo "Deployment complete!" 