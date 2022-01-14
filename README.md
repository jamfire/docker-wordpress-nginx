# WordPress Docker Stack

This Docker stack initializes WordPress, MariaDB, Redis for object caching, and a 3 node Elastic Search cluster.

## Docker Compose Basics

View the [docker-compose documentation.](https://docs.docker.com/compose/)

This stack can be used for local development, staging, and production. If running locally, you will need to map domains in your os hosts file or use a tool like dnsmasq to map domains automatically. The development environment on this stack is configured to use https://wordpress.local. You will need to generate local certificates using ```mkcert``` in order to use https.

Start Docker and then run ```docker-compose up -d``` to bring the stack up and detach it from stdout. Here are some basic commands.

```
docker-compose up -d            # start services

docker-compose ps               # view service info

docker-compose logs nginx       # view nginx logs 

docker-compose stop             # stop containers

docker-compose rm               # remove containers
```

## Generate Local Certificates

Install [mkcert](https://github.com/FiloSottile/mkcert#installation) and then run the mkcert command in the ```./certs``` directory. Update the environmental configuration for Nginx SSL as needed.

```
$ mkcert -install
Created a new local CA 💥
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊

$ mkcert wordpress.local "*.wordpress.local"

Created a new certificate valid for the following names 📜
 - "wordpress.local"
 - "*.wordpress.local"

The certificate is at "./wordpress.local+1.pem" and the key at "./wordpress.local+1-key.pem" ✅
```

## Use SSL Certificates

Copy your certificate and key to certs and update environment variables in ```.env``` as needed.

## Environment Configuration

This stack can be configured for different environments using the env dotfile. See ```.env-template``` for all variables available. This is where you change database username and password, update nginx configuration, specify which docker image versions to use for each service, etc.