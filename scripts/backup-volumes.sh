#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'

# Backup Database
printf "${BLUE}[docker]${NC} backing up database volume..."
docker run --rm \
    --volume wordpress-db-data:/data \
    --volume $(pwd):/backup ubuntu \
    tar -zcvf /backup/wordpress-db-data.tar /data

# Backup WordPress
printf "${BLUE}[docker]${NC} backing up wordpress volume..."
docker run --rm \
    --volume wordpress-data:/data \
    --volume $(pwd):/backup ubuntu \
    tar -zcvf /backup/wordpress-data.tar /data
