#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'

if [ -f .env ];
then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

# Restore LE Volume
printf "${BLUE}[docker]${NC} stopping services...\r\n"
docker compose down

# Restore LE Volume
printf "${BLUE}[docker]${NC} restore le_data volume...\r\n"
docker run --rm \
    --volume ${COMPOSE_PROJECT_NAME}_le_data:/data \
    --volume $(pwd)/backups:/backup ubuntu \
    bash -c "cd /data && tar xf /backup/le_data.tar --strip 1"

# Restore Database Volume
printf "${BLUE}[docker]${NC} restore db_data volume...\r\n"
docker run --rm \
    --volume ${COMPOSE_PROJECT_NAME}_db_data:/data \
    --volume $(pwd)/backups:/backup ubuntu \
    bash -c "cd /data && tar xf /backup/db_data.tar --strip 1"

# Restore WordPress Volume
printf "${BLUE}[docker]${NC} restore wp_data volume...\r\n"
docker run --rm \
    --volume ${COMPOSE_PROJECT_NAME}_wp_data:/data \
    --volume $(pwd)/backups:/backup ubuntu \
    bash -c "cd /data && tar xf /backup/wp_data.tar --strip 1"

# Restarting Docker
printf "${BLUE}[docker]${NC} restart docker containers...\r\n"
docker compose up -d