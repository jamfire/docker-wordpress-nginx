# WordPress Docker Stack

This Docker stack initializes the following services:

- **Traefik** for accepting incoming http/https requests and automating ssl certificates both in dev and production. The dev ssl certificate will generate a browser warning.
- **Nginx** with caching for reverse proxying to the WordPress php-fpm service
- **WordPress** php-fpm image for the WordPress installation. Themes and plugins can be stored in code under the ./wordpress directory.
- **WordPress CLI** service for running wp-cli against WordPress.
- **MariaDB** service for the database.
- **Redis** for caching alongside php object cache.
- **Watchtower** for automatically updating your docker images. Specify a minor version in the .env file to update minor releases or lock down upates by specifying a patch version. The .env-template file lists minor versions.

This repository is meant to act as a template for setting up your WordPress stack.

## Initial Setup

**Step 1**: Update your ```.env``` dotfile for the enviornment that your working in (development, staging, production).

**Step 2**: Start docker and launch this stack using ```docker compose up -d```.

## Step 1: Environment Configuration

This stack can be configured for different environments using the ```.env``` dotfile. See ```.env-template``` for all variables available. Copy ```.env-template``` to ```.env``` and update as necessary. This is where you change database username and password, update nginx configuration, specify which docker image versions to use for each service, etc.

## Configuration

Service configuration can be adjusted under ```/.docker```. You can adjust settings like php memory, nginx conf, mysql memory limit, and etc.

```
.docker
├── mysql
│   └── my.cnf
├── nginx
│   └── conf.d
│       └── default.conf
└── php
    └── custom.ini
```

## Step 2: Start Docker Stack

In a development environment, you can download [Docker Desktop](https://www.docker.com/products/docker-desktop). On other systems, you will need to install Docker Engine and start the dameon.

Once Docker has been started, you can issue ```docker compose up -d``` and the stack will start. Please see below for more information on using docker compose.
## Docker Compose Basics

View the [docker compose documentation.](https://docs.docker.com/compose/)

Common commands to use on a docker stack.

```
docker compose up -d            # start services

docker compose ps               # view service info

docker compose logs nginx       # view nginx logs

docker compose stop             # stop containers

docker compose rm               # remove containers
```

## Development Environment

Using [Multipass](https://multipass.run/docs), it is easy to develop locally using this stack. Execute the included ```multipass.sh``` script to start an ubuntu based docker instance. This will install Docker with the compose plugin.

```
sh multipass.sh
```

In order to access your multipass ubuntu instance for development, you need to add a hosts entry. Get the IP address of your instance by running ```multipass ls``` and then add the IP address and domain name you want to access your instance from to your ```/etc/hosts``` file. For example:

```
multipass ls
docker-wordpress        Running           10.211.55.40     Ubuntu 21.10
                                          172.17.0.1
                                          10.1.0.1
                                          172.18.0.1
                                          172.19.0.1
```

Add the ip/domain entry to /etc/hosts.

```
10.211.55.40 wordpress.local
```