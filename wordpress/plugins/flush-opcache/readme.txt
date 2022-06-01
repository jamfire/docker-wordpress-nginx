=== WP OPcache ===
Contributors: mnttech
Tags: opcache, cache, flush, php, multisite
Requires at least: 5.5
Requires PHP: 7.2
Tested up to: 5.9
Stable tag: 4.1.3
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Manage OPcache inside your WordPress admin dashboard.

== Description ==

**Flush OPcache**

* add a button in admin bar to flush OPcache
* flush only files in WordPress absolute path
* individual or bulk file invalidation
* support both memory and file caching
* support multisite

**OPcache Statistics**

* memory, hits, strings and keys statistics
* directives, functions and general informations
* list all files
* fully responsive

There are three tabs in admin page:

* General settings: plugin settings
* Statistics: responsive dashboard about OPcache statistics
* Cached files: list of cached files with the possibility of invalidating them

== Installation ==

As usual...

== Screenshots ==

1. Flush button in admin bar
2. WordPress Notice after flushing OPcache
3. General settings tab
4. Statistics tab
5. Cached files tab

== Changelog ==

= 4.1.3 =
* Fix a bug on datetime in cached file list

= 4.1.2 =
* Fix a bug with ABSPATH when WordPress uses its own directory

= 4.1.1 =
* Tested up to WordPress 5.8

= 4.1.0 =
* Remove i18n (use translate.wordpress.org)
* Use wp_opcache_invalidate instead of opcache_invalidate

= 4.0.1 =
* Enhance README.txt
* Remove old screenshots

= 4.0.0 =
* Invalidate files only in WordPress absolute path
* Use tabs instead of pages in admin area
* New tab with cached files list
* Tested up to WordPress 5.7.1

Full changelog [here](https://github.com/nierdz/flush-opcache/releases)
