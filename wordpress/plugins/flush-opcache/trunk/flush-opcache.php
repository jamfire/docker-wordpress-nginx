<?php
/**
 * Main plugin file
 *
 * @package flush-opcache
 *
 * @wordpress-plugin
 * Plugin Name:       WP OPcache
 * Plugin URI:        http://wordpress.org/plugins/flush-opcache/
 * Description:       This plugin allows to manage Zend OPcache inside your WordPress admin dashboard.
 * Version:           4.1.3
 * Author:            nierdz
 * Author URI:        https://igln.fr/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       flush-opcache
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'FLUSH_OPCACHE_VERSION', '4.1.3' );
define( 'FLUSH_OPCACHE_NAME', 'flush-opcache' );

require plugin_dir_path( __FILE__ ) . 'includes/class-flush-opcache.php';

/** Main function to fire plugin execution */
function run_flush_opcache() {
	$plugin = new Flush_Opcache();
}

run_flush_opcache();
