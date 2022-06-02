#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'

if [ -f .env ];
then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
else
    printf "${BLUE}[docker]${NC} .env not found...\r\n"
    exit 1
fi

# Backup Database
printf "${BLUE}[docker]${NC} backing up db_data volume...\r\n"
docker run --rm \
    -v ${COMPOSE_PROJECT_NAME}_db_data:/data \
    -v $(pwd)/backups:/backup ubuntu \
    tar -cf /backup/db_data.tar /data

# Backup WordPress
printf "${BLUE}[docker]${NC} backing up wp_data volume...\r\n"
docker run --rm \
    -v ${COMPOSE_PROJECT_NAME}_wp_data:/data \
    -v $(pwd)/backups:/backup ubuntu \
    tar -cf /backup/wp_data.tar /data
