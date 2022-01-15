<?php
/**
 * Class for importing fluent data.
 *
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

if ( ! defined( 'GIVE_VERSION' ) ) {
	return;
}

use function give_get_raw_data_from_file;
use function give_save_import_donation_to_db;
use function give_update_meta;

/**
 * Class for importing fluent forms.
 */
class Kadence_Starter_Templates_Give_Import {

	/**
	 * Import forms from JSON file.
	 *
	 * @param string $give_import_forms_file_path path to the widget import file.
	 */
	public static function import_forms( $give_import_forms_file_path ) {
		$results       = array();
		$kadence_starter_templates = Starter_Templates::get_instance();
		$log_file_path = $kadence_starter_templates->get_log_file_path();

		// Import Give forms and return result.
		if ( ! empty( $give_import_forms_file_path ) ) {
			$results = self::import_give_forms( $give_import_forms_file_path );
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
					esc_html__( 'Importing Give forms', 'kadence-starter-templates' )
				);
			}
		} else {
			$message = ( ! empty( $results['message'] ) ? $results['message'] : esc_html__( 'No results for Give Form import!', 'kadence-starter-templates' ) );
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Add this message to log file.
				$log_added = Helpers::append_to_file(
					$message,
					$log_file_path,
					esc_html__( 'Importing Give forms' , 'kadence-starter-templates' )
				);
			}
		}
	}
	/**
	 * Imports widgets from a json file.
	 *
	 * @param string $data_file path to json file with WordPress widget export data.
	 */
	private static function import_give_forms( $data_file ) {
		// Get widgets data from file.
		$data = self::process_import_form_file( $data_file );

		// Return from this function if there was an error.
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		// error_log( print_r( $data, true ) );
		// Import the form data and save the results.
		return self::import_form_data( $data );
	}
	/**
	 * Import raw data forms.
	 *
	 * @param string $raw_data the data for the forms.
	 */
	public static function import_form_data( $raw_data ) {
		// Have valid data? If no data or could not decode.
		if ( empty( $raw_data ) || ! is_array( $raw_data ) ) {
			return new \WP_Error(
				'corrupted_give_forms_import_data',
				__( 'Error: Widget import data could not be read. Please try a different file.', 'kadence-starter-templates' )
			);
		}
		// Begin results.
		$results = array();

		// Loop import data's sidebars.
		foreach ( $raw_data as $form_id => $form_data ) {
			foreach ( $form_data as $data_key => $data_value ) {
				//if ( '_give_sequoia_form_template_settings' === $data_key || '_give_form_template' === $data_key || '_give_goal_color' === $data_key ) {
					if ( is_array( $data_value ) && isset( $data_value[0] ) ) {
						$data_value = maybe_unserialize( $data_value[0] );
					}
					//error_log( print_r( $data_value, true ) );
					give_update_meta( $form_id, $data_key, $data_value, 'form' );
				//}
			}
		}
		return $results;
	}

	/**
	 * Import forms from JSON file.
	 *
	 * @param string $give_import_file_path path to the widget import file.
	 */
	public static function import( $give_import_file_path ) {
		$results       = array();
		$kadence_starter_templates = Starter_Templates::get_instance();
		$log_file_path = $kadence_starter_templates->get_log_file_path();

		// Import widgets and return result.
		if ( ! empty( $give_import_file_path ) ) {
			$results = self::import_donations( $give_import_file_path );
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
					esc_html__( 'Importing Give Donations', 'kadence-starter-templates' )
				);
			}
		} else {
			$message = ( ! empty( $results['message'] ) ? $results['message'] : esc_html__( 'No results for Give import!', 'kadence-starter-templates' ) );
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Add this message to log file.
				$log_added = Helpers::append_to_file(
					$message,
					$log_file_path,
					esc_html__( 'Importing Give Donations' , 'kadence-starter-templates' )
				);
			}
		}

	}

	/**
	 * Imports widgets from a json file.
	 *
	 * @param string $data_file path to json file with WordPress widget export data.
	 */
	private static function import_donations( $data_file ) {
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
	private static function process_import_form_file( $file ) {
		// File exists?
		if ( ! file_exists( $file ) ) {
			return new \WP_Error(
				'form_import_file_not_found',
				__( 'Error: Form import file could not be found.', 'kadence-starter-templates' )
			);
		}
		// // Get file contents and decode.
		$data = Helpers::data_from_file( $file );

		// Return from this function if there was an error.
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		return maybe_unserialize( $data, true );
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
		$data = give_get_raw_data_from_file( $file, 1, 25, ',' );
		// // Get file contents and decode.
		// $data = Helpers::data_from_file( $file );

		// Return from this function if there was an error.
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		return $data;
	}

	/**
	 * Import raw data forms.
	 *
	 * @param string $raw_data the data for the forms.
	 */
	public static function import_data( $raw_data ) {
		// Have valid data? If no data or could not decode.
		if ( empty( $raw_data ) ) {
			return new \WP_Error(
				'corrupted_give_import_data',
				__( 'Error: Give import data could not be read. Please try a different file.', 'kadence-starter-templates' )
			);
		}
		$import_setting = [];
		$raw_key = maybe_unserialize( 'a:29:{i:0;s:2:"id";i:1;s:0:"";i:2;s:6:"amount";i:3;s:8:"currency";i:4;s:0:"";i:5;s:11:"post_status";i:6;s:9:"post_date";i:7;s:9:"post_time";i:8;s:7:"gateway";i:9;s:4:"mode";i:10;s:7:"form_id";i:11;s:10:"form_title";i:12;s:10:"form_level";i:13;s:10:"form_level";i:14;s:12:"title_prefix";i:15;s:10:"first_name";i:16;s:9:"last_name";i:17;s:5:"email";i:18;s:12:"company_name";i:19;s:5:"line1";i:20;s:5:"line2";i:21;s:4:"city";i:22;s:5:"state";i:23;s:3:"zip";i:24;s:7:"country";i:25;s:0:"";i:26;s:7:"user_id";i:27;s:8:"donor_id";i:28;s:8:"donor_ip";}' );
		$import_setting['raw_key'] = $raw_key;
		$import_setting['dry_run'] = false;
		$main_key = maybe_unserialize( 'a:29:{i:0;s:11:"Donation ID";i:1;s:15:"Donation Number";i:2;s:14:"Donation Total";i:3;s:13:"Currency Code";i:4;s:15:"Currency Symbol";i:5;s:15:"Donation Status";i:6;s:13:"Donation Date";i:7;s:13:"Donation Time";i:8;s:15:"Payment Gateway";i:9;s:12:"Payment Mode";i:10;s:7:"Form ID";i:11;s:10:"Form Title";i:12;s:8:"Level ID";i:13;s:11:"Level Title";i:14;s:12:"Title Prefix";i:15;s:10:"First Name";i:16;s:9:"Last Name";i:17;s:13:"Email Address";i:18;s:12:"Company Name";i:19;s:9:"Address 1";i:20;s:9:"Address 2";i:21;s:4:"City";i:22;s:5:"State";i:23;s:3:"Zip";i:24;s:7:"Country";i:25;s:13:"Donor Comment";i:26;s:7:"User ID";i:27;s:8:"Donor ID";i:28;s:16:"Donor IP Address";}' );
		// Prevent normal emails.
		remove_action( 'give_complete_donation', 'give_trigger_donation_receipt', 999 );
		remove_action( 'give_insert_user', 'give_new_user_notification', 10 );
		remove_action( 'give_insert_payment', 'give_payment_save_page_data' );
		$current_key = 1;
		foreach ( $raw_data as $row_data ) {
			$import_setting['donation_key'] = $current_key;
			give_save_import_donation_to_db( $raw_key, $row_data, $main_key, $import_setting );
			$current_key ++;
		}

		// Check if function exists or not.
		if ( function_exists( 'give_payment_save_page_data' ) ) {
			add_action( 'give_insert_payment', 'give_payment_save_page_data' );
		}

		$results = array(
			'message' => __( 'Give data has been successfully imported.', 'kadence-starter-templates' ),
		);
		// Return results.
		return apply_filters( 'kadence-starter-templates/give_import_results', $results );
	}
}
