#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'

# Restore Database Volume
printf "${BLUE}[docker]${NC} restore database volume..."
docker run --rm \
    --volume wordpress-db-data:/data \
    --volume $(pwd):/backup ubuntu \
    tar xvf /backup/wordpress-db-data.tar -C /data

# Restore WordPress Volume
printf "${BLUE}[docker]${NC} restore wordpress volume..."
docker run --rm \
    --volume wordpress-data:/data \
    --volume $(pwd):/backup ubuntu \
    tar xvf /backup/wordpress-data.tar -C /data
