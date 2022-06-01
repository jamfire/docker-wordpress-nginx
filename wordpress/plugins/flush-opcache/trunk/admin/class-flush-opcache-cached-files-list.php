<?php
/**
 * Class to manage OPcache cached files
 *
 * @package flush-opcache
 */

if ( ! class_exists( 'WP_List_Table' ) ) {
		require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 *  Extends WP_List_Table to manage OPcache cached files
 */
class Flush_Opcache_Cached_Files_List extends WP_List_Table {

	/**
	 * Construct of Flush_Opcache_Cached_Files_List
	 */
	public function __construct() {
		parent::__construct(
			array(
				'singular' => __( 'file', 'flush-opcache' ),
				'plural'   => __( 'files', 'flush-opcache' ),
				'ajax'     => false,
			)
		);
	}

	/**
	 * Properties of columns
	 */
	public function get_columns() {
		$columns = array(
			'cb'                  => '<input type="checkbox" />',
			'full_path'           => __( 'File', 'flush-opcache' ),
			'hits'                => __( 'Hits', 'flush-opcache' ),
			'memory_consumption'  => __( 'Memory', 'flush-opcache' ),
			'last_used_timestamp' => __( 'Last used', 'flush-opcache' ),
			'timestamp'           => __( 'Last modified', 'flush-opcache' ),
		);

		return $columns;
	}

	/**
	 * Get sortable columns
	 */
	protected function get_sortable_columns() {
		$sortable_columns = array(
			'full_path'           => array( 'full_path', false ),
			'hits'                => array( 'hits', false ),
			'memory_consumption'  => array( 'memory_consumption', false ),
			'last_used_timestamp' => array( 'last_used_timestamp', false ),
			'timestamp'           => array( 'timestamp', false ),
		);

		return $sortable_columns;
	}

	/**
	 * Setup everything to populate the table
	 */
	public function prepare_items() {
		$this->process_action();

		$per_page = 100;

		/* Build column headers */
		$columns               = $this->get_columns();
		$hidden                = array();
		$sortable              = $this->get_sortable_columns();
		$this->_column_headers = array( $columns, $hidden, $sortable );

		/* Populate the table */
		$items_infos = $this->get_entries( $per_page );
		$this->items = $items_infos['items'];

		/* Build pagination */
		$current_page = $this->get_pagenum();
		$total_items  = $items_infos['total_items'];
		$this->set_pagination_args(
			array(
				'total_items' => $total_items,
				'per_page'    => $per_page,
				'total_pages' => ceil( $total_items / $per_page ),
			)
		);
	}

	/**
	 * Get cached files information from opcache_get_status
	 *
	 * @param int $per_page number of elements to print per page.
	 * @return array
	 */
	private function get_entries( $per_page = 100 ) {
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
						$item                        = array();
						$item['full_path']           = str_replace( get_home_path(), './', $script['full_path'] );
						$item['hits']                = $script['hits'];
						$item['memory_consumption']  = $script['memory_consumption'];
						$item['timestamp']           = $script['timestamp'];
						$item['last_used_timestamp'] = $script['last_used_timestamp'];
						array_push( $opcache_scripts, $item );
					}
				}
			} catch ( \Throwable $e ) {
				error_log( sprintf( 'Unable to query OPcache status: %s.', $e->getMessage() ), $e->getCode() ); // phpcs:ignore
			}
		}

		/*
			Filter array with search if needed
		 */
		if ( ! empty( $_GET['s'] ) ) { // phpcs:ignore
			$opcache_scripts_filtered = array_filter(
				$opcache_scripts,
				function ( $array ) {
					return sanitize_key( $_GET['s'] ) !== '' && mb_strpos( $array['full_path'], sanitize_key( $_GET['s'] ) ) !== false; // phpcs:ignore
				}
			);
		} else {
			$opcache_scripts_filtered = $opcache_scripts;
		}

		/* Sort array if needed */
		if ( ! empty( $_GET['orderby'] ) ) { // phpcs:ignore
			usort(
				$opcache_scripts_filtered,
				function( $a, $b ) {
					$orderby = sanitize_key( $_GET['orderby'] ); // phpcs:ignore
					if ( isset( $_GET['order'] ) && 'asc' === $_GET['order'] ) { // phpcs:ignore
						return $a[ $orderby ] <=> $b[ $orderby ];
					} else {
						return $b[ $orderby ] <=> $a[ $orderby ];
					}
				}
			);
		}

		/* Only get slice of array matching the current page */
		$offset                = ( $this->get_pagenum() - 1 ) * $per_page;
		$opcache_scripts_items = array_slice( $opcache_scripts_filtered, $offset, $per_page, $preserve_keys = true );

		return array(
			'items'       => $opcache_scripts_items,
			'total_items' => count( $opcache_scripts_filtered ),
		);

	}

	/**
	 * Print column html
	 *
	 * @param  array  $item array containing all informations about cached files.
	 * @param  string $column_name name of the column.
	 * @return string
	 */
	protected function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'full_path':
				$invalidate_url = wp_nonce_url(
					add_query_arg(
						array(
							'file'   => $item['full_path'],
							'action' => 'delete',
						)
					)
				);
				$actions        = array(
					'delete' => sprintf( '<a href="%1$s">%2$s</a>', $invalidate_url, __( 'Invalidate', 'flush-opcache' ) ),
				);
				return sprintf( '<span id="%s">%s</span> %s', $item[ $column_name ], $item[ $column_name ], $this->row_actions( $actions ) );
				break; // phpcs:ignore
			case 'memory_consumption':
				return size_format( $item[ $column_name ] );
				break; // phpcs:ignore
			case 'timestamp':
			case 'last_used_timestamp':
				$offset = get_option( 'gmt_offset' ) * HOUR_IN_SECONDS;
				return date_i18n( 'Y/m/d g:i:s A', $item[ $column_name ] + $offset );
				break; // phpcs:ignore
			default:
				return $item[ $column_name ];
		}
	}

	/**
	 * Print checkbox column html
	 *
	 * @param array $item array containing all informations about cached files.
	 * @return string
	 */
	protected function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="%1$s[]" value="%2$s"/>',
			$this->_args['singular'],
			$item['full_path']
		);
	}

	/**
	 * Flush files from Opcache
	 */
	private function process_action() {
		if ( ! isset( $_REQUEST['file'] ) ) {
			return;
		}

		/* Put files in array to treat single action and bulk action the same way */
		$array_file = (array) ( $_REQUEST['file'] ); // phpcs:ignore

		if (
				( $this->current_action() === 'delete' && wp_verify_nonce( $_REQUEST['_wpnonce'], 'bulk-' . $this->_args['plural'] ) ) || // phpcs:ignore
				( $this->current_action() === 'delete' && wp_verify_nonce( $_REQUEST['_wpnonce'] ) ) // phpcs:ignore
		) {
			foreach ( $array_file as $file ) {
				wp_opcache_invalidate( get_home_path() . $file, true );
			}
		}
	}

	/**
	 * Define bulk actions
	 *
	 * @return array
	 */
	protected function get_bulk_actions() {
		$actions = array(
			'delete' => __( 'Invalidate', 'flush-opcache' ),
		);
		return $actions;
	}

	/**
	 * Remove action and action2 parameters to avoid invalidating same files again
	 */
	public function remove_parameters() {
		$options                = array(
			'action',
			'action2',
		);
		$_SERVER['REQUEST_URI'] = remove_query_arg( $options, $_SERVER['REQUEST_URI'] ); // phpcs:ignore
	}

	/**
	 * Displays the search box.
	 *
	 * @param string $text     The 'submit' button label.
	 * @param string $input_id ID attribute value for the search input field.
	 */
	public function search_box( $text, $input_id ) {
		if ( empty( $_REQUEST['s'] ) && ! $this->has_items() ) { // phpcs:ignore
			return;
		}

		$input_id = $input_id . '-search-input';

		if ( ! empty( $_REQUEST['orderby'] ) ) { // phpcs:ignore
			echo '<input type="hidden" name="orderby" value="' . esc_attr( wp_unslash( $_REQUEST['orderby'] ) ) . '" />'; // phpcs:ignore
		}
		if ( ! empty( $_REQUEST['order'] ) ) { // phpcs:ignore
			echo '<input type="hidden" name="order" value="' . esc_attr( wp_unslash( $_REQUEST['order'] ) ) . '" />'; // phpcs:ignore
		}
		if ( ! empty( $_REQUEST['post_mime_type'] ) ) { // phpcs:ignore
			echo '<input type="hidden" name="post_mime_type" value="' . esc_attr( wp_unslash( $_REQUEST['post_mime_type'] ) ) . '" />'; // phpcs:ignore
		}
		if ( ! empty( $_REQUEST['detached'] ) ) { // phpcs:ignore
			echo '<input type="hidden" name="detached" value="' . esc_attr( wp_unslash( $_REQUEST['detached'] ) ) . '" />'; // phpcs:ignore
		}
		if ( ! empty( $_REQUEST['tab'] ) ) { // phpcs:ignore
			echo '<input type="hidden" name="tab" value="' . esc_attr( wp_unslash( $_REQUEST['tab'] ) ) . '" />'; // phpcs:ignore
		}
		?>
<p class="search-box">
	<label class="screen-reader-text" for="<?php echo esc_attr( $input_id ); ?>"><?php echo esc_attr( $text ); ?>:</label>
	<input type="search" id="<?php echo esc_attr( $input_id ); ?>" name="s" value="<?php _admin_search_query(); ?>" />
		<?php
		submit_button(
			$text,
			'',
			'',
			false,
			array(
				'id'  => 'search-submit',
				'tab' => 'cached_files',
			)
		);
		?>
</p>
		<?php
	}

}
