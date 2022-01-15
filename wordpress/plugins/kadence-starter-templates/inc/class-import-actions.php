<?php
/**
 * Class for the import actions used in the One Click Demo Import plugin.
 * Register default WP actions for OCDI plugin.
 *
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

class ImportActions {
	/**
	 * Register all action hooks for this class.
	 */
	public function register_hooks() {
		// Before content import.
		add_action( 'kadence-starter-templates/before_content_import_execution', array( $this, 'before_content_import_action' ), 10, 5 );
		//add_action( 'kadence-starter-templates/before_content_import_execution', array( $this, 'before_content_import_reset_setting' ), 10, 5 );

		// After content import.
		add_action( 'kadence-starter-templates/after_content_import_execution', array( $this, 'before_widget_import_action' ), 10, 5 );
		add_action( 'kadence-starter-templates/after_content_import_execution', array( $this, 'widgets_import' ), 20, 5 );

		add_action( 'kadence-starter-templates/after_content_import_execution', array( $this, 'forms_import' ), 20, 5 );
		add_action( 'kadence-starter-templates/after_content_import_execution', array( $this, 'donations_import' ), 20, 5 );
		add_action( 'kadence-starter-templates/after_content_import_execution', array( $this, 'give_forms_import' ), 20, 5 );

		// Customizer import.
		add_action( 'kadence-starter-templates/customizer_import_execution', array( $this, 'customizer_import' ), 10, 1 );

		// Customizer Color Only import.
		add_action( 'kadence-starter-templates/customizer_import_color_only_execution', array( $this, 'customizer_import_color_only' ), 10, 1 );

		// Customizer font Only import.
		add_action( 'kadence-starter-templates/customizer_import_font_only_execution', array( $this, 'customizer_import_font_only' ), 10, 1 );

		// After full import action.
		add_action( 'kadence-starter-templates/after_all_import_execution', array( $this, 'after_import_action' ), 10, 5 );

		// Special widget import cases.
		add_action( 'kadence-starter-templates/widget_settings_array', array( $this, 'fix_custom_menu_widget_ids' ) );
	}


	/**
	 * Change the menu IDs in the custom menu widgets in the widget import data.
	 * This solves the issue with custom menu widgets not having the correct (new) menu ID, because they
	 * have the old menu ID from the export site.
	 *
	 * @param array $widget The widget settings array.
	 */
	public function fix_custom_menu_widget_ids( $widget ) {
		// Skip (no changes needed), if this is not a custom menu widget.
		if ( ! array_key_exists( 'nav_menu', $widget ) || empty( $widget['nav_menu'] ) || ! is_int( $widget['nav_menu'] ) ) {
			return $widget;
		}

		// Get import data, with new menu IDs.
		$ocdi                = Starter_Templates::get_instance();
		$content_import_data = $ocdi->importer->get_importer_data();
		$term_ids            = $content_import_data['mapping']['term_id'];

		// Set the new menu ID for the widget.
		if ( is_array( $term_ids ) && isset( $term_ids[ $widget['nav_menu'] ] ) ) {
			$widget['nav_menu'] = $term_ids[ $widget['nav_menu'] ];
		}

		return $widget;
	}

	/**
	 * Execute the forms import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function forms_import( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		if ( ! empty( $selected_import_files['forms'] ) && class_exists( 'Kadence_Starter_Templates\Kadence_Starter_Templates_Fluent_Import' ) ) {
			Kadence_Starter_Templates_Fluent_Import::import( $selected_import_files['forms'] );
		}
	}

	/**
	 * Execute the Give donations import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function donations_import( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		if ( ! empty( $selected_import_files['give-donations'] ) && class_exists( 'Kadence_Starter_Templates\Kadence_Starter_Templates_Give_Import' ) ) {
			Kadence_Starter_Templates_Give_Import::import( $selected_import_files['give-donations'] );
		}
	}
	/**
	 * Execute the Give forms import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function give_forms_import( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		if ( ! empty( $selected_import_files['give-forms'] ) && class_exists( 'Kadence_Starter_Templates\Kadence_Starter_Templates_Give_Import' ) ) {
			Kadence_Starter_Templates_Give_Import::import_forms( $selected_import_files['give-forms'] );
		}
	}
	/**
	 * Execute the widgets import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function widgets_import( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		if ( ! empty( $selected_import_files['widgets'] ) ) {
			WidgetImporter::import( $selected_import_files['widgets'] );
		}
	}

	/**
	 * Execute the customizer import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function customizer_import_color_only( $selected_import_files ) {
		if ( ! empty( $selected_import_files['customizer'] ) ) {
			CustomizerImporter::import_color( $selected_import_files['customizer'] );
		}
	}

	/**
	 * Execute the customizer import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function customizer_import_font_only( $selected_import_files ) {
		if ( ! empty( $selected_import_files['customizer'] ) ) {
			CustomizerImporter::import_font( $selected_import_files['customizer'] );
		}
	}
	/**
	 * Execute the customizer import.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function customizer_import( $selected_import_files ) {
		if ( ! empty( $selected_import_files['customizer'] ) ) {
			CustomizerImporter::import( $selected_import_files['customizer'] );
		}
	}

	/**
	 * Before Content Import lets reset the theme options.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function before_content_import_reset_setting( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {

		//$old_data = get_option( '_kadence_starter_templates_last_import_data', array() );

	}
	/**
	 * Execute the action: 'kadence-starter-templates/before_content_import'.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function before_content_import_action( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		$this->do_import_action( 'kadence-starter-templates/before_content_import', $import_files[ $selected_index ], $selected_palette, $selected_font );
	}


	/**
	 * Execute the action: 'kadence-starter-templates/before_widgets_import'.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function before_widget_import_action( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		$this->do_import_action( 'kadence-starter-templates/before_widgets_import', $import_files[ $selected_index ], $selected_palette, $selected_font );
	}


	/**
	 * Execute the action: 'kadence-starter-templates/after_import'.
	 *
	 * @param array $selected_import_files Actual selected import files (content, widgets, customizer, redux).
	 * @param array $import_files          The filtered import files defined in `kadence-starter-templates/import_files` filter.
	 * @param int   $selected_index        Selected index of import.
	 */
	public function after_import_action( $selected_import_files, $import_files, $selected_index, $selected_palette, $selected_font ) {
		$this->do_import_action( 'kadence-starter-templates/after_import', $import_files[ $selected_index ], $selected_palette, $selected_font );
	}


	/**
	 * Register the do_action hook, so users can hook to these during import.
	 *
	 * @param string $action          The action name to be executed.
	 * @param array  $selected_import The data of selected import from `kadence-starter-templates/import_files` filter.
	 */
	private function do_import_action( $action, $selected_import, $selected_palette, $selected_font ) {
		if ( false !== has_action( $action ) ) {
			$kadence_starter_templates         = Starter_Templates::get_instance();
			$log_file_path = $kadence_starter_templates->get_log_file_path();

			ob_start();
				do_action( $action, $selected_import, $selected_palette, $selected_font );
			$message = ob_get_clean();
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Add this message to log file.
				$log_added = Helpers::append_to_file(
					$message,
					$log_file_path,
					$action
				);
			}
		}
	}
}
