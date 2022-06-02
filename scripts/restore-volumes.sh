#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'

if [ -f .env ];
then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

# Restore Database Volume
printf "${BLUE}[docker]${NC} restore database volume...\r\n"
docker run --rm \
    --volume ${COMPOSE_PROJECT_NAME}_db_data:/data \
    --volume $(pwd)/backups:/backup ubuntu \
    bash -c "cd /data && tar xf /backup/db_data.tar --strip 1"

# Restore WordPress Volume
printf "${BLUE}[docker]${NC} restore wordpress volume...\r\n"
docker run --rm \
    --volume ${COMPOSE_PROJECT_NAME}_wp_data:/data \
    --volume $(pwd)/backups:/backup ubuntu \
    bash -c "cd /data && tar xf /backup/wp_data.tar --strip 1"

# Restarting Docker
printf "${BLUE}[docker]${NC} restart docker containers...\r\n"
docker compose restart