<?php
/**
 * Kadence\Elementor_Pro\Component class
 *
 * @package kadence
 */

namespace Kadence\Elementor_Pro;

use Kadence\Component_Interface;
use Elementor;
use \Elementor\Plugin;
use ElementorPro\Modules\ThemeBuilder\ThemeSupport;
use Elementor\TemplateLibrary\Source_Local;
use ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager;
use ElementorPro\Modules\ThemeBuilder\Module;
use function Kadence\kadence;
use function add_action;
use function have_posts;
use function the_post;
use function apply_filters;
use function get_template_part;
use function get_post_type;


/**
 * Class for adding Elementor plugin support.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug() : string {
		return 'elementor_pro';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize() {
		add_action( 'elementor/theme/register_locations', array( $this, 'register_elementor_locations' ) );
		add_action( 'elementor/dynamic_tags/register_tags', array( $this, 'add_palette_colors' ) );
	}
	/**
	 * Elementor dynamic tag support.
	 *
	 * @param object $dynamic_tags the dynamic tags modal.
	 */
	public function add_palette_colors( $dynamic_tags ) {
		// In our Dynamic Tag we use a group named request-variables so we need.
		// To register that group as well before the tag.
		\Elementor\Plugin::$instance->dynamic_tags->register_group(
			'kadence-palette',
			array(
				'title' => __( 'Kadence Theme', 'kadence' ),
			)
		);

		require_once get_template_directory() . '/inc/components/elementor_pro/class-elementor-dynamic-colors.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound

		// Finally register the tag.
		$dynamic_tags->register_tag( 'Kadence\Elementor_Pro\Elementor_Dynamic_Colors' );
	}
	/**
	 * Elementor Location support.
	 *
	 * @param object $elementor_theme_manager the theme manager.
	 */
	public function register_elementor_locations( $elementor_theme_manager ) {
		$elementor_theme_manager->register_all_core_location();
		$elementor_theme_manager->register_location(
			'header',
			array(
				'hook'         => 'kadence_header',
				'remove_hooks' => array( 'Kadence\header_markup' ),
			)
		);
		$elementor_theme_manager->register_location(
			'footer',
			array(
				'hook'         => 'kadence_footer',
				'remove_hooks' => array( 'Kadence\footer_markup' ),
			)
		);
		$elementor_theme_manager->register_location(
			'single',
			array(
				'hook'         => 'kadence_single',
				'remove_hooks' => array( 'Kadence\single_markup' ),
			)
		);
	}
}
