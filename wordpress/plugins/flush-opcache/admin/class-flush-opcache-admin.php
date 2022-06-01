<?php
/**
 * Main admin class file
 *
 * @package flush-opcache
 */

/**
 * Main class
 *
 * Handle all stuff in admin area
 *
 * @package flush-opcache
 */
class Flush_Opcache_Admin {

	/**
	 * Name of the plugin
	 *
	 * @var string
	 */
	private $name;

	/**
	 * Version of the plugin
	 *
	 * @var string
	 */
	private $version;

	/**
	 * Construct of the main class
	 *
	 * Only here to set name and version
	 *
	 * @param string $name Name of the plugin.
	 * @param string $version Version of the plugin.
	 */
	public function __construct( $name, $version ) {
		$this->name    = $name;
		$this->version = $version;
	}

	/**
	 * Enqueue style.css when in stats admin area
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			'flush-opcache',
			plugin_dir_url( __FILE__ ) . 'css/style.css',
			array(),
			$this->version,
			'all'
		);
	}

	/**
	 * Generate menu pages in admin area
	 */
	public function flush_opcache_admin_menu() {
		if ( is_multisite() && is_super_admin() && is_main_site() ) {
			add_menu_page(
				__( 'WP OPcache Settings', 'flush-opcache' ),
				__( 'WP OPcache', 'flush-opcache' ),
				'manage_network_options',
				'flush-opcache',
				array( $this, 'flush_opcache_admin_page' )
			);
		} elseif ( ! is_multisite() && is_admin() ) {
			add_menu_page(
				__( 'WP OPcache Settings', 'flush-opcache' ),
				__( 'WP OPcache', 'flush-opcache' ),
				'manage_options',
				'flush-opcache',
				array( $this, 'flush_opcache_admin_page' )
			);
		}
	}

	/**
	 * Populate admin page
	 */
	public function flush_opcache_admin_page() {
		if ( ! is_admin() ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to access this page.', 'wporg' ) );
		}
		if ( ! extension_loaded( 'Zend OPcache' ) ) {
			echo '<div class="notice notice-error">
              <p>' . esc_html__( 'You do not have the Zend OPcache extension loaded, you need to install it to use this plugin.', 'flush-opcache' ) . '</p>
            </div>';
		}
		if ( ! opcache_get_status() ) {
			echo '<div class="notice notice-error">
              <p>' . esc_html__( 'Zend OPcache is loaded but not activated. You need to set opcache.enable=1 in your php.ini', 'flush-opcache' ) . '</p>
            </div>';
		}
		$current_tab = $this->manage_tabs();
		switch ( $current_tab ) {
			case 'settings':
				$this->page_settings();
				break;
			case 'statistics':
				$this->page_statistics();
				break;
			case 'cached_files':
				$this->page_cached_files();
				break;
		}
	}

	/**
	 * Populate settings tab of admin page
	 */
	private function page_settings() {
		?>
	<div class="wrap">
		<?php if ( isset( $_GET['page'] ) && isset( $_GET['settings-updated'] ) && 'flush-opcache' === $_GET['page'] && 'true' === $_GET['settings-updated'] ) { // phpcs:ignore WordPress.Security.NonceVerification ?>
		<div id="message" class="updated notice is-dismissible">
			<p><?php esc_html_e( 'Settings saved.', 'wporg' ); ?></p>
		</div>
			<?php
		}
		if ( is_multisite() ) {
			?>
		<form method="post" action="edit.php?action=flush_opcache_update">
			<?php
			wp_nonce_field( 'update_flush_opcache_options', 'update_flush_opcache_options' );
		} else {
			?>
		<form method="post" action="options.php">
			<?php
		}
		settings_fields( 'flush-opcache-settings-group' );
		do_settings_sections( 'flush-opcache-settings-group' );
		?>
		<table class="form-table">
			<tbody>
			<tr>
				<th scope="row">
					<?php esc_html_e( 'Automatically flush OPcache after an upgrade', 'flush-opcache' ); ?>
				</th>
				<td>
				<input
					type="checkbox"
					name="flush-opcache-upgrade"
					value="1"
					<?php checked( 1, get_site_option( 'flush-opcache-upgrade' ), true ); ?>
				>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<?php esc_html_e( 'Hide Flush PHP Opcache button in admin bar', 'flush-opcache' ); ?>
				</th>
				<td>
				<input
					type="checkbox"
					name="flush-opcache-hide-button"
					value="1"
					<?php checked( 1, get_site_option( 'flush-opcache-hide-button' ), true ); ?>
				>
				</td>
			</tr>
			</tbody>
		</table>
			<?php submit_button(); ?>
		</form>
		<?php
		$base_url   = remove_query_arg( 'settings-updated' );
		$flush_url  = add_query_arg( array( 'flush_opcache_action' => 'flushopcacheall' ), $base_url );
		$nonced_url = wp_nonce_url( $flush_url, 'flush_opcache_all' );
		?>
		<form method="post" action="<?php echo esc_url( $nonced_url ); ?>">
			<p class="submit">
				<input
					style="color: #FFF; background: #DD3D36; border-color: #DD3D36; text-shadow: unset; box-shadow: unset;"
					type="submit"
					name="submit"
					id="submit"
					class="button button-primary"
					value="<?php esc_html_e( 'Flush PHP OPcache', 'flush-opcache' ); ?>">
			</p>
		</form>
		<?php
	}

	/**
	 * Display tabs of admin page
	 */
	private function manage_tabs() {

		$settings_tabs                 = array();
		$settings_tabs['settings']     = __( 'General settings', 'flush-opcache' );
		$settings_tabs['statistics']   = __( 'Statistics', 'flush-opcache' );
		$settings_tabs['cached_files'] = __( 'Cached files', 'flush-opcache' );

		$current_tab = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'settings'; // phpcs:ignore WordPress.Security.NonceVerification
		echo '<h2 class="nav-tab-wrapper">';
		foreach ( $settings_tabs as $tab_key => $tab_caption ) {
			$active = ( $current_tab === $tab_key ) ? ' nav-tab-active' : '';
			echo '<a class="nav-tab' . esc_attr( $active ) . '" href="?page=flush-opcache&amp;tab=' . esc_attr( $tab_key ) . '">' . esc_attr( $tab_caption ) . '</a>';
		}
		echo '</h2>';

		return $current_tab;
	}

	/**
	 * Populate statistics tab of admin page
	 */
	private function page_statistics() {
		require_once 'flush-opcache-statistics.php';
	}

	/**
	 * Populate cached files tab of admin page
	 */
	public function page_cached_files() {
		?>
		<div class="wrap">
			<div id="poststuff">
				<div id="post-body" class="metabox-holder">

					<form method="get">
						<input type="hidden" name="page" value="flush-opcache" />
						<?php $flush_opcache_cached_files_list = new Flush_Opcache_Cached_Files_List(); ?>
						<?php $flush_opcache_cached_files_list->prepare_items(); ?>
						<?php $flush_opcache_cached_files_list->remove_parameters(); ?>
						<?php $flush_opcache_cached_files_list->search_box( __( 'Search files', 'flush-opcache' ), 'search_id' ); ?>
						<?php $flush_opcache_cached_files_list->display(); ?>
					</form>

				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Register settings group to use settings API
	 */
	public function register_flush_opcache_settings() {
		register_setting( 'flush-opcache-settings-group', 'flush-opcache-upgrade' );
		register_setting( 'flush-opcache-settings-group', 'flush-opcache-hide-button' );
	}

	/**
	 * Generate flush button in admin bar
	 */
	public function flush_opcache_button() {
		global $wp_admin_bar;
		if ( ! is_user_logged_in() || ! is_admin_bar_showing() ) {
			return false;
		}
		if ( ! is_admin() ) {
			return false;
		}
		if ( get_site_option( 'flush-opcache-hide-button' ) === '1' ) {
			return false;
		}
		$base_url   = remove_query_arg( 'settings-updated' );
		$flush_url  = add_query_arg( array( 'flush_opcache_action' => 'flushopcacheall' ), $base_url );
		$nonced_url = wp_nonce_url( $flush_url, 'flush_opcache_all' );
		if ( ( is_multisite() && is_super_admin() && is_main_site() ) || ( ! is_multisite() && is_admin() ) ) {
			$wp_admin_bar->add_menu(
				array(
					'parent' => '',
					'id'     => 'flush_opcache_button',
					'title'  => __( 'Flush PHP OPcache', 'flush-opcache' ),
					'meta'   => array( 'title' => __( 'Flush PHP OPcache', 'flush-opcache' ) ),
					'href'   => $nonced_url,
				)
			);
		}
	}

	/**
	 * Check if we need to flush OPcache
	 */
	public function flush_opcache() {
		if ( ! isset( $_REQUEST['flush_opcache_action'] ) ) {
			return;
		}
		if ( isset( $_REQUEST['settings-updated'] ) ) {
			return;
		}
		if ( ! is_admin() ) {
			wp_die( esc_html__( 'Sorry, you can\'t flush OPcache.', 'flush-opcache' ) );
		}
		$action = sanitize_key( $_REQUEST['flush_opcache_action'] );
		if ( 'done' === $action ) {
			if ( is_multisite() ) {
				add_action( 'network_admin_notices', array( $this, 'show_opcache_notice' ) );
			} else {
				add_action( 'admin_notices', array( $this, 'show_opcache_notice' ) );
			}
			return;
		}
		check_admin_referer( 'flush_opcache_all' );
		if ( 'flushopcacheall' === $action ) {
			$this->flush_opcache_reset();
		}
		wp_safe_redirect( esc_url_raw( add_query_arg( array( 'flush_opcache_action' => 'done' ) ) ) );
		exit;
	}

	/**
	 * Where OPcache is actually flushed
	 */
	public function flush_opcache_reset() {
		$opcache_scripts = array();
		if ( function_exists( 'opcache_get_status' ) ) {
			try {
				$raw = opcache_get_status( true );
				if ( array_key_exists( 'scripts', $raw ) ) {
					foreach ( $raw['scripts'] as $script ) {
						/* Remove files outside of WP */
						if ( false === strpos( $script['full_path'], get_home_path() ) ) {
							continue;
						}
						array_push( $opcache_scripts, $script['full_path'] );
					}
				}
			} catch ( \Throwable $e ) {
				error_log( sprintf( 'Unable to query OPcache status: %s.', $e->getMessage() ), $e->getCode() ); // phpcs:ignore
			}
		}
		foreach ( $opcache_scripts as $file ) {
			wp_opcache_invalidate( $file, true );
		}
	}

	/**
	 * Display a notice when OPcache was flushed
	 */
	public function show_opcache_notice() {
		?>
	<div id="message" class="updated notice is-dismissible">
		<p><?php esc_html_e( 'OPcache was successfully flushed.', 'flush-opcache' ); ?></p>
	</div>
		<?php
	}

	/**
	 * Because settings API does not work in multisite we have to do it ourself
	 */
	public function flush_opcache_update_network_options() {
		check_admin_referer( 'update_flush_opcache_options', 'update_flush_opcache_options' );
		if ( isset( $_REQUEST['flush-opcache-upgrade'] ) && '1' === $_REQUEST['flush-opcache-upgrade'] ) {
			update_site_option( 'flush-opcache-upgrade', 1 );
		} else {
			update_site_option( 'flush-opcache-upgrade', 0 );
		}
		if ( isset( $_REQUEST['flush-opcache-hide-button'] ) && '1' === $_REQUEST['flush-opcache-hide-button'] ) {
			update_site_option( 'flush-opcache-hide-button', 1 );
		} else {
			update_site_option( 'flush-opcache-hide-button', 0 );
		}
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'             => 'flush-opcache',
					'settings-updated' => 'true',
				),
				network_admin_url( 'admin.php' )
			)
		);
		exit;
	}

	/**
	 * Check if we need to flush OPcache after an update
	 */
	public function flush_opcache_after_wp_update() {
		if ( get_site_option( 'flush-opcache-upgrade' ) === 1 ) {
			$this->flush_opcache_reset();
		}
	}

}
