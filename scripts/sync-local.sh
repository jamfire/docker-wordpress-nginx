#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'

# Remote Connection Information
SERVER=kaleb@www.tcmi.edu
WORDPRESS_PATH=/var/www/edutcmi/public

# Stage 1: Sync remote files to local volume
printf "${BLUE}[docker]${NC} syncing production uploads to local..."
docker compose exec wordpress \
    rsync -ah --info=progress2 \
    $SERVER:$WORDPRESS_PATH/wp-content/uploads /var/www/html/wp-content

# Stage 2: Backup database from production
printf "\n${BLUE}[docker]${NC} exporting production database...\n"
docker compose exec wordpress \
    ssh kaleb@www.tcmi.edu "cd ${WORDPRESS_PATH} && wp db export production.sql"

# Stage 3: Sync database to local
printf "\n${BLUE}[docker]${NC} syncing production database to local..."
docker compose exec wordpress \
    rsync -ah --info=progress2 \
    $SERVER:$WORDPRESS_PATH/production.sql .

# Stage 4: Import database to local
printf "\n${BLUE}[docker]${NC} importing production database to local..."
docker compose run --rm wpcli sh -c \
   'wp db import production.sql \
    && wp cache flush \
    && wp search-replace "www.tcmi.edu" "wordpress.local" --all-tables \
    && wp cache flush'

# Stage 5: Activate/Deactivate Plugins
printf "\n${BLUE}[docker]${NC} configuring plugins for environment"
