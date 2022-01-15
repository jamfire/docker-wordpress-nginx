FROM wordpress:fpm-alpine

RUN mkdir -p /usr/src/wordpress/wp-content/mu-plugins \
    && rm /usr/src/wordpress/wp-content/plugins/hello.php


RUN && chown -R www-data:www-data /usr/src/wordpress
