<?php
/**
 * Plugin Name: Kadence Starter Templates
 * Description: Choose the prebuilt website and click to import.
 * Version: 1.2.12
 * Author: Kadence WP
 * Author URI: https://kadencewp.com/
 * License: GPLv2 or later
 * Text Domain: kadence-starter-templates
 *
 * @package Kadence Starter Templates
 */

// Block direct access to the main plugin file.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! version_compare( PHP_VERSION, '7.0', '>=' ) ) {
	add_action( 'admin_notices', 'kadence_starter_old_php_admin_error_notice' );
} else {
	require_once 'class-kadence-starter-templates.php';
}
/**
 * Display an admin error notice when PHP is older the version 5.3.2.
 * Hook it to the 'admin_notices' action.
 */
function kadence_starter_old_php_admin_error_notice() {
	$message = __( 'The Kadence Starter templates plugin requires at least PHP 7.0 to run properly. Please contact your hosting company and ask them to update the PHP version of your site to at least PHP 7.0. We strongly encourage you to update to 7.3+', 'kadence-starter-templates' );

	printf( '<div class="notice notice-error"><p>%1$s</p></div>', wp_kses_post( $message ) );
}
