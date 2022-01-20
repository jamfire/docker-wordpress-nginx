# build from wordpress fpm apline image
FROM wordpress:fpm-alpine

# remove cruft
RUN rm /usr/src/wordpress/wp-content/plugins/hello.php \
    && rm -r /usr/src/wordpress/wp-content/themes/twentynineteen \
    && rm -r /usr/src/wordpress/wp-content/themes/twentytwenty

# copy plugins and themes for static deploy
COPY wordpress/plugins /usr/src/wordpress/wp-content/plugins
COPY wordpress/themes /usr/src/wordpress/wp-content/themes

# ensure permissions are correct
# RUN chown -R www-data:www-data /var/www/html
