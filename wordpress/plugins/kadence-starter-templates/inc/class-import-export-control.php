<?php
/**
 * The Import Export customize control extends the WP_Customize_Control class.
 *
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

use WP_Customize_Control;

if ( ! class_exists( 'WP_Customize_Control' ) ) {
	return;
}

/**
 * Class Kadence_Starter_Control_Import_Export
 *
 * @access public
 */
class Kadence_Starter_Control_Import_Export extends WP_Customize_Control {
	/**
	 * Control type
	 *
	 * @var string
	 */
	public $type = 'kadence_starter_import_export_control';
	/**
	 * Empty Render Function to prevent errors.
	 */
	public function render_content() {
		?>
			<span class="customize-control-title">
				<?php esc_html_e( 'Export', 'kadence' ); ?>
			</span>
			<span class="description customize-control-description">
				<?php esc_html_e( 'Click the button below to export the customization settings for this theme.', 'kadence' ); ?>
			</span>
			<input type="button" class="button kadence-starter-export kadence-starter-button" name="kadence-starter-export-button" value="<?php esc_attr_e( 'Export', 'kadence' ); ?>" />

			<hr class="kt-theme-hr" />

			<span class="customize-control-title">
				<?php esc_html_e( 'Import', 'kadence' ); ?>
			</span>
			<span class="description customize-control-description">
				<?php esc_html_e( 'Upload a file to import customization settings for this theme.', 'kadence' ); ?>
			</span>
			<div class="kadence-starter-import-controls">
				<input type="file" name="kadence-starter-import-file" class="kadence-starter-import-file" />
				<?php wp_nonce_field( 'kadence-starter-importing', 'kadence-starter-import' ); ?>
			</div>
			<div class="kadence-starter-uploading"><?php esc_html_e( 'Uploading...', 'kadence' ); ?></div>
			<input type="button" class="button kadence-starter-import kadence-starter-button" name="kadence-starter-import-button" value="<?php esc_attr_e( 'Import', 'kadence' ); ?>" />

			<hr class="kt-theme-hr" />
			<span class="customize-control-title">
				<?php esc_html_e( 'Reset', 'kadence' ); ?>
			</span>
			<span class="description customize-control-description">
				<?php esc_html_e( 'Click the button to reset all theme settings.', 'kadence' ); ?>
			</span>
			<input type="button" class="components-button is-destructive kadence-starter-reset kadence-starter-button" name="kadence-starter-reset-button" value="<?php esc_attr_e( 'Reset', 'kadence' ); ?>" />
			<?php
	}
}