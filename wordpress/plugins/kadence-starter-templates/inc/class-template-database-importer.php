<?php
/**
 * Class for pulling in template database and saving locally
 * Based on a package from the WPTT Team for local fonts.
 *
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

/**
 * Class for pulling in template database and saving locally
 */
class Template_Database_Importer {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * API key for kadence membership
	 *
	 * @var null
	 */
	private $api_key = '';

	/**
	 * API email for kadence membership
	 *
	 * @var string
	 */
	private $api_email = '';
	/**
	 * API email for kadence membership
	 *
	 * @var string
	 */
	private $template_type = 'blocks';
	/**
	 * Base URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $base_url;
	/**
	 * Base path.
	 *
	 * @access protected
	 * @var string
	 */
	protected $base_path;
	/**
	 * Subfolder name.
	 *
	 * @access protected
	 * @var string
	 */
	protected $subfolder_name;

	/**
	 * The starter templates folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $starter_templates_folder;
	/**
	 * The local stylesheet's path.
	 *
	 * @access protected
	 * @var string
	 */
	protected $local_template_data_path;

	/**
	 * The local stylesheet's URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $local_template_data_url;
	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_url = 'https://api.startertemplatecloud.com/wp-json/kadence-starter/v1/get/';

	/**
	 * The final data.
	 *
	 * @access protected
	 * @var string
	 */
	protected $data;
	/**
	 * Cleanup routine frequency.
	 */
	const CLEANUP_FREQUENCY = 'monthly';

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( is_admin() ) {
			// Ajax Calls.
			add_action( 'wp_ajax_kadence_import_get_template_data', array( $this, 'template_data_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_reload_template_data', array( $this, 'template_data_reload_ajax_callback' ) );
		}

		// Add a cleanup routine.
		$this->schedule_cleanup();
		add_action( 'delete_starter_templates_folder', array( $this, 'delete_starter_templates_folder' ) );
	}
	/**
	 * Get the local data file if there, else query the api.
	 *
	 * @access public
	 * @return string
	 */
	public function get_template_data( $skip_local = false ) {
		if ( 'custom' === $this->template_type ) {
			return wp_json_encode( apply_filters( 'kadence_starter_templates_custom_array', array() ) );
		}
		// Check if the local data file exists. (true means the file doesn't exist).
		if ( $skip_local || $this->local_file_exists() ) {
			// Attempt to create the file.
			if ( $this->create_template_data_file( $skip_local ) ) {
				return $this->get_local_template_data_contents();
			}
		}
		if ( '[]' === $this->get_local_template_data_contents() ) {
			if ( $this->create_template_data_file( $skip_local ) ) {
				return $this->get_local_template_data_contents();
			}
		}
		// If the local file exists, return it's data.
		return file_exists( $this->get_local_template_data_path() )
			? $this->get_local_template_data_contents()
			: '';
	}
	/**
	 * Write the data to the filesystem.
	 *
	 * @access protected
	 * @return string|false Returns the absolute path of the file on success, or false on fail.
	 */
	protected function create_template_data_file( $skip_local ) {
		$file_path  = $this->get_local_template_data_path();
		$filesystem = $this->get_filesystem();

		// If the folder doesn't exist, create it.
		if ( ! file_exists( $this->get_starter_templates_folder() ) ) {
			$chmod_dir = ( 0755 & ~ umask() );
			if ( defined( 'FS_CHMOD_DIR' ) ) {
				$chmod_dir = FS_CHMOD_DIR;
			}
			$this->get_filesystem()->mkdir( $this->get_starter_templates_folder(), $chmod_dir );
		}

		// If the file doesn't exist, create it. Return false if it can not be created.
		if ( ! $filesystem->exists( $file_path ) && ! $filesystem->touch( $file_path ) ) {
			return false;
		}

		// If we got this far, we need to write the file.
		// Get the data.
		if ( $skip_local || ! $this->data ) {
			$this->get_data();
		}

		// Put the contents in the file. Return false if that fails.
		if ( ! $filesystem->put_contents( $file_path, $this->data ) ) {
			return false;
		}

		return $file_path;
	}
	/**
	 * Get data.
	 *
	 * @access public
	 * @return string
	 */
	public function get_data() {
		// Get the remote URL contents.
		$this->data = $this->get_remote_url_contents();

		return $this->data;
	}
	/**
	 * Get local data contents.
	 *
	 * @access public
	 * @return string|false Returns the data contents.
	 */
	public function get_local_template_data_contents() {
		$local_path = $this->get_local_template_data_path();

		// Check if the local stylesheet exists. (true means the file doesn't exist).
		if ( $this->local_file_exists() ) {
			return false;
		}

		ob_start();
		include $local_path;
		return ob_get_clean();
	}
	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_url_contents() {
		// We only need the site url to validate iThemes license.
		if ( 'iThemes' === $this->api_email ) {
			if ( is_callable( 'network_home_url' ) ) {
				$site_url = network_home_url( '', 'http' );
			} else {
				$site_url = get_bloginfo( 'url' );
			}
			$site_url = preg_replace( '/^https/', 'http', $site_url );
			$site_url = preg_replace( '|/$|', '', $site_url );
		} else {
			$site_url = '';
		}
		$args = array(
			'request'   => ( $this->template_type ? $this->template_type : 'blocks' ),
			'api_email' => $this->api_email,
			'api_key'   => $this->api_key,
			'site_url'  => $site_url,
		);
		// Get the response.
		$api_url  = add_query_arg( $args, $this->remote_url );
		$response = wp_remote_get( $api_url );
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return '';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );

		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return;
		}

		return $contents;
	}
	/**
	 * Check if the local file exists.
	 *
	 * @access public
	 * @return bool
	 */
	public function local_file_exists() {
		return ( ! file_exists( $this->get_local_template_data_path() ) );
	}
	/**
	 * Get the data path.
	 *
	 * @access public
	 * @return string
	 */
	public function get_local_template_data_path() {
		if ( ! $this->local_template_data_path ) {
			$this->local_template_data_path = $this->get_starter_templates_folder() . '/' . $this->get_local_template_data_filename() . '.json';
		}
		return $this->local_template_data_path;
	}
	/**
	 * Get the local data filename.
	 *
	 * This is a hash, generated from the site-URL, the wp-content path and the URL.
	 * This way we can avoid issues with sites changing their URL, or the wp-content path etc.
	 *
	 * @access public
	 * @return string
	 */
	public function get_local_template_data_filename() {
		$ktp_api = 'free';
		if ( class_exists( 'Kadence_Theme_Pro' ) ) {
			$ktp_data = get_option( 'ktp_api_manager' );
			if ( $ktp_data && isset( $ktp_data['ktp_api_key'] ) && ! empty( $ktp_data['ktp_api_key'] ) ) {
				$ktp_api = $ktp_data['ktp_api_key'];
			} else if ( $ktp_data && isset( $ktp_data['ithemes_key'] ) && ! empty( $ktp_data['ithemes_key'] ) ) {
				$ktp_api = $ktp_data['ithemes_key'];
			}
		}
		return md5( $this->get_base_url() . $this->get_base_path() . $this->template_type . KADENCE_STARTER_TEMPLATES_VERSION . $ktp_api );
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function template_data_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		Helpers::verify_ajax_call();
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email     = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->template_type = empty( $_POST['template_type'] ) ? 'blocks' : sanitize_text_field( $_POST['template_type'] );
		// Do you have the data?
		$get_data = $this->get_template_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No template data', 'kadence-starter-templates' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function template_data_reload_ajax_callback() {

		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		Helpers::verify_ajax_call();
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email     = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->template_type = empty( $_POST['template_type'] ) ? 'blocks' : sanitize_text_field( $_POST['template_type'] );

		$removed = $this->delete_starter_templates_folder();
		if ( ! $removed ) {
			wp_send_json_error( 'failed_to_flush' );
		}
		// Do you have the data?
		$get_data = $this->get_template_data( true );

		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No template data', 'kadence-starter-templates' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}

	/**
	 * Get Importer Array.
	 *
	 * Used durning import to get information from the json.
	 *
	 * @access public
	 * @param string $slug the template slug.
	 * @param string $type the template type.
	 * @return array
	 */
	public function get_importer_files( $slug, $type ) {
		$this->template_type = $type;
		$get_data = $this->get_template_data();
		if ( ! $get_data ) {
			return array();
		}
		$data = json_decode( $get_data, true );
		if ( isset( $data[ $slug ] ) ) {
			return $data;
		}
		return array();
	}
	/**
	 * Schedule a cleanup.
	 *
	 * Deletes the templates files on a regular basis.
	 * This way templates get updated regularly.
	 *
	 * @access public
	 * @return void
	 */
	public function schedule_cleanup() {
		if ( ! is_multisite() || ( is_multisite() && is_main_site() ) ) {
			if ( ! wp_next_scheduled( 'delete_starter_templates_folder' ) && ! wp_installing() ) {
				wp_schedule_event( time(), self::CLEANUP_FREQUENCY, 'delete_starter_templates_folder' );
			}
		}
	}
	/**
	 * Delete the fonts folder.
	 *
	 * This runs as part of a cleanup routine.
	 *
	 * @access public
	 * @return bool
	 */
	public function delete_starter_templates_folder() {
		return $this->get_filesystem()->delete( $this->get_starter_templates_folder(), true );
	}
	/**
	 * Get the folder for templates data.
	 *
	 * @access public
	 * @return string
	 */
	public function get_starter_templates_folder() {
		if ( ! $this->starter_templates_folder ) {
			$this->starter_templates_folder = $this->get_base_path();
			if ( $this->get_subfolder_name() ) {
				$this->starter_templates_folder .= $this->get_subfolder_name();
			}
		}
		return $this->starter_templates_folder;
	}
	/**
	 * Get the subfolder name.
	 *
	 * @access public
	 * @return string
	 */
	public function get_subfolder_name() {
		if ( ! $this->subfolder_name ) {
			$this->subfolder_name = apply_filters( 'kadence_starter_templates_local_data_subfolder_name', 'kadence_starter_templates' );
		}
		return $this->subfolder_name;
	}
	/**
	 * Get the base path.
	 *
	 * @access public
	 * @return string
	 */
	public function get_base_path() {
		if ( ! $this->base_path ) {
			$upload_dir = wp_upload_dir();
			$this->base_path = apply_filters( 'kadence_starter_templates_local_data_base_path', trailingslashit( $upload_dir['basedir'] ) );
		}
		return $this->base_path;
	}
	/**
	 * Get the base URL.
	 *
	 * @access public
	 * @return string
	 */
	public function get_base_url() {
		if ( ! $this->base_url ) {
			$this->base_url = apply_filters( 'kadence_starter_templates_local_data_base_url', content_url() );
		}
		return $this->base_url;
	}
	/**
	 * Get the filesystem.
	 *
	 * @access protected
	 * @return WP_Filesystem
	 */
	protected function get_filesystem() {
		global $wp_filesystem;

		// If the filesystem has not been instantiated yet, do it here.
		if ( ! $wp_filesystem ) {
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
			}
			WP_Filesystem();
		}
		return $wp_filesystem;
	}
}
Template_Database_Importer::get_instance();
