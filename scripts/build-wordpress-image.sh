#!/bin/sh

BLUE='\033[0;34m'
NC='\033[0m'
 
# Backup Database
printf "${BLUE}[docker]${NC} build jamfire/wordpress:fpm-alpine..."
docker build -t jamfire/wordpress:fpm-alpine ./wordpress

printf "${BLUE}[docker]${NC} push jamfire/wordpress:fpm-alpine..."
docker push jamfire/wordpress:fpm-alpine
