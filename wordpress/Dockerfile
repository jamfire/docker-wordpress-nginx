# build from wordpress fpm apline image
FROM wordpress:fpm-alpine

# added packages
RUN apk --update add openssh rsync \
    && rm -rf /var/cache/apk/*

# remove cruft
RUN rm /usr/src/wordpress/wp-content/plugins/hello.php \
    && rm -r /usr/src/wordpress/wp-content/themes/twentynineteen \
    && rm -r /usr/src/wordpress/wp-content/themes/twentytwenty

# copy plugins and themes for static deploy
COPY plugins /usr/src/wordpress/wp-content/plugins
COPY themes /usr/src/wordpress/wp-content/themes

# ensure permissions are correct
RUN chown -R www-data:www-data /var/www/html
RUN find /var/www/ -type d -exec chmod 0755 {} \;
RUN find /var/www/ -type f -exec chmod 644 {} \;