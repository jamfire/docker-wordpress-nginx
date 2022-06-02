#!/bin/bash
multipass launch docker -n docker-wordpress -c 2 -d 40G -m 4G
multipass mount . docker-wordpress:/home/ubuntu/wordpress
multipass exec docker-wordpress -- bash -c 'sudo apt-get update'
multipass exec docker-wordpress -- bash -c 'sudo apt-get install docker-compose-plugin'
multipass exec docker-wordpress -- bash -c 'cd /home/ubuntu/wordpress && docker compose up -d'