<?php
/**
 * Default Events Template
 * This file is the basic wrapper template for all the views if 'Default Events Template'
 * is selected in Events -> Settings -> Display -> Events Template.
 *
 * Override this template in your own theme by creating a file at [your-theme]/tribe-events/default-template.php
 *
 * @package TribeEventsCalendar
 * @version 4.6.23
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

get_header();
/**
 * Hook for anything before main tag
 */
do_action( 'kadence_tribe_events_before_main_tag' );
?>
<main id="tribe-events-pg-template" class="tribe-events-pg-template entry content-bg">
	<div class="entry-content-wrap">
	<?php tribe_events_before_html(); ?>
	<?php tribe_get_view(); ?>
	<?php tribe_events_after_html(); ?>
	</div>
</main> <!-- #tribe-events-pg-template -->
<?php
/**
 * Hook for anything before main tag
 */
do_action( 'kadence_tribe_events_after_main_tag' );
get_footer();
