<?php
/**
 * Class for importing fluent data.
 *
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

if ( ! defined( 'FLUENTFORM_VERSION' ) ) {
	return;
}

use FluentForm\Framework\Helpers\ArrayHelper;
use FluentForm\App\Modules\Form\wpFluent;
use FluentForm\App\Databases\DatabaseMigrator;

/**
 * Class for importing fluent forms.
 */
class Kadence_Starter_Templates_Fluent_Import {

	/**
	 * Import forms from JSON file.
	 *
	 * @param string $form_import_file_path path to the widget import file.
	 */
	public static function import( $form_import_file_path ) {
		$results       = array();
		$kadence_starter_templates = Starter_Templates::get_instance();
		$log_file_path = $kadence_starter_templates->get_log_file_path();

		// Import widgets and return result.
		if ( ! empty( $form_import_file_path ) ) {
			$results = self::import_forms( $form_import_file_path );
		}

		// Check for errors, else write the results to the log file.
		if ( is_wp_error( $results ) ) {
			$error_message = $results->get_error_message();

			// Add any error messages to the frontend_error_messages variable in OCDI main class.
			$kadence_starter_templates->append_to_frontend_error_messages( $error_message );
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Write error to log file.
				Helpers::append_to_file(
					$error_message,
					$log_file_path,
					esc_html__( 'Importing forms', 'kadence-starter-templates' )
				);
			}
		} else {
			ob_start();
				self::format_results_for_log( $results );
			$message = ob_get_clean();
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Add this message to log file.
				$log_added = Helpers::append_to_file(
					$message,
					$log_file_path,
					esc_html__( 'Importing forms' , 'kadence-starter-templates' )
				);
			}
		}

	}

	/**
	 * Imports widgets from a json file.
	 *
	 * @param string $data_file path to json file with WordPress widget export data.
	 */
	private static function import_forms( $data_file ) {
		// Get widgets data from file.
		$data = self::process_import_file( $data_file );

		// Return from this function if there was an error.
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		// Import the widget data and save the results.
		return self::import_data( $data );
	}
	/**
	 * Process import file - this parses the widget data and returns it.
	 *
	 * @param string $file path to json file.
	 * @return object $data decoded JSON string
	 */
	private static function process_import_file( $file ) {
		// File exists?
		if ( ! file_exists( $file ) ) {
			return new \WP_Error(
				'form_import_file_not_found',
				__( 'Error: Form import file could not be found.', 'kadence-starter-templates' )
			);
		}

		// Get file contents and decode.
		$data = Helpers::data_from_file( $file );

		// Return from this function if there was an error.
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		return \json_decode( $data, true );
	}

	/**
	 * Import fluent forms.
	 *
	 * @param string $forms the data for the forms.
	 */
	public static function import_data( $forms ) {
		// Have valid data? If no data or could not decode.
		if ( empty( $forms ) ) {
			return new \WP_Error(
				'corrupted_form_import_data',
				__( 'Error: Form import data could not be read. Please try a different file.', 'kadence-starter-templates' )
			);
		}
		// Make sure we can import.
		DatabaseMigrator::run();
		$insertedForms = [];
		if ( $forms && is_array( $forms ) ) {
			foreach ( $forms as $formItem ) {
				// First of all make the form object.
				$formFields = json_encode([]);
				if ( $fields = ArrayHelper::get( $formItem, 'form', '' ) ) {
					$formFields = json_encode( $fields );
				} else if( $fields = ArrayHelper::get( $formItem, 'form_fields', '' ) ) {
					$formFields = json_encode( $fields );
				} else {
					return new \WP_Error(
						'corrupted_form_import_data',
						__( 'Error: Form import data could not be read. Please try a different file.', 'kadence-starter-templates' )
					);
				}

				$form = [
					'title'       => ArrayHelper::get($formItem, 'title'),
					'form_fields' => $formFields,
					'status' => ArrayHelper::get($formItem, 'status', 'published'),
					'has_payment' => ArrayHelper::get($formItem, 'has_payment', 0),
					'type' => ArrayHelper::get($formItem, 'type', 'form'),
					'created_by'  => get_current_user_id()
				];

				if( ArrayHelper::get($formItem, 'conditions')) {
					$form['conditions'] = ArrayHelper::get($formItem, 'conditions');
				}

				if(isset($formItem['appearance_settings'])) {
					$form['appearance_settings'] = $formItem['appearance_settings'];
				}

				// Insert the form to the DB.
				$formId = wpFluent()->table('fluentform_forms')->insert($form);

				$insertedForms[$formId] = [
					'title' => $form['title'],
					'edit_url' => admin_url('admin.php?page=fluent_forms&route=editor&form_id='.$formId)
				];

				if(isset($formItem['metas'])) {

					foreach ($formItem['metas'] as $metaData) {
						$settings = [
							'form_id'  => $formId,
							'meta_key' => $metaData['meta_key'],
							'value'    => $metaData['value']
						];
						wpFluent()->table('fluentform_form_meta')->insert($settings);
					}

				} else {
					$oldKeys = [
						'formSettings',
						'notifications',
						'mailchimp_feeds',
						'slack'
					];
					foreach ($oldKeys as $key) {
						if(isset($formItem[$key])) {
							$settings = [
								'form_id'  => $formId,
								'meta_key' => $key,
								'value'    => json_encode($formItem[$key])
							];
							wpFluent()->table('fluentform_form_meta')->insert($settings);
						}
					}
				}

				do_action( 'fluentform_form_imported', $formId );

			}
			$results = array(
				'message' => __('You form has been successfully imported.', 'fluentform'),
				'inserted_forms' => $insertedForms,
			);
			// Return results.
			return apply_filters( 'kadence-starter-templates/form_import_results', $results );
		}
	}
	/**
	 * Format results for log file
	 *
	 * @param array $results widget import results.
	 */
	private static function format_results_for_log( $results ) {
		if ( empty( $results ) ) {
			esc_html_e( 'No results for form import!', 'kadence-starter-templates' );
		}
		if ( isset( $results['inserted_forms'] ) && is_array( $results['inserted_forms'] ) ) {
			// Loop forms.
			foreach ( $results['inserted_forms'] as $form_id => $form ) {
				echo esc_html( $form['title'] ) . ' : ' . esc_html__( 'Imported' ) . PHP_EOL . PHP_EOL;
				echo PHP_EOL;
			}
		}
	}
}
