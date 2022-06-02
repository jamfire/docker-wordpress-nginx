#!/bin/bash

BLUE='\033[0;34m'
NC='\033[0m'

printf "${BLUE}[multipass]${NC} initialize docker instance..."
multipass launch docker -n docker-wordpress -c 2 -d 40G -m 4G
multipass mount . docker-wordpress:/home/ubuntu/wordpress

printf "${BLUE}[multipass]${NC} install docker compose..."
multipass exec docker-wordpress -- bash -c 'sudo apt-get update'
multipass exec docker-wordpress -- bash -c 'sudo apt-get install docker-compose-plugin'

printf "${BLUE}[multipass]${NC} launch services..."
multipass exec docker-wordpress -- bash -c 'cd /home/ubuntu/wordpress && docker compose up -d'
