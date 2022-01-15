<?php
/**
 * NOTE: This template is from the TutorLMS plugin is is overridden in Kadence Theme for better theme support of TutorLMS.
 * Template for displaying courses
 *
 * Edited by Kadence Theme, Original Author:
 * @author Themeum
 * @url https://themeum.com
 *
 * @package TutorLMS/Templates
 * @version 1.5.8
 */

get_header(); ?>
	<?php do_action('tutor_course/archive/before/wrap'); ?>
<?php
	$course_filter = (bool) tutor_utils()->get_option('course_archive_filter', false);
$supported_filters = tutor_utils()->get_option('supported_course_filters', array());

if ($course_filter && count($supported_filters)) {
?>
	<div class="tutor-course-filter-wrapper">
		<div class="tutor-course-filter-container">
			<?php tutor_load_template('course-filter.filters'); ?>
		</div>
		<div>
			<div class="<?php tutor_container_classes(); ?> tutor-course-filter-loop-container" data-column_per_row="<?php echo tutor_utils()->get_option( 'courses_col_per_row', 4 ); ?>">
				<?php tutor_load_template('archive-course-init'); ?>
			</div><!-- .wrap -->
		</div>
	</div>
<?php
} else {
	?>
		<div class="<?php tutor_container_classes(); ?>">
			<?php tutor_load_template('archive-course-init'); ?>
		</div>
	<?php
}
?>

	<?php do_action('tutor_course/archive/after/wrap'); ?>

<?php get_footer();