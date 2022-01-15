<?php
/**
 * Class for declaring the content importer used in the One Click Demo Import plugin
 *
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

class Importer {
	/**
	 * The importer class object used for importing content.
	 *
	 * @var object
	 */
	private $importer;

	/**
	 * Time in milliseconds, marking the beginning of the import.
	 *
	 * @var float
	 */
	private $microtime;

	/**
	 * The instance of the Kadence_Starter_Templates\Logger class.
	 *
	 * @var object
	 */
	public $logger;

	/**
	 * The instance of the Kadence_Starter_Templates class.
	 *
	 * @var object
	 */
	private $kadence_starter_templates;
	/**
	 * A list of allowed mimes.
	 *
	 * @var array
	 */
	protected $extensions = array(
		'jpg|jpeg|jpe' => 'image/jpeg',
		'png'          => 'image/png',
		'webp'         => 'image/webp',
		'svg'          => 'image/svg+xml',
	);
	/**
	 * Constructor method.
	 *
	 * @param array  $importer_options Importer options.
	 * @param object $logger           Logger object used in the importer.
	 */
	public function __construct( $importer_options = array(), $logger = null ) {
		// Include files that are needed for WordPress Importer v2.
		$this->include_required_files();

		// Set the WordPress Importer v2 as the importer used in this plugin.
		// More: https://github.com/humanmade/WordPress-Importer.
		$this->importer = new WXRImporter( $importer_options );

		// Set logger to the importer.
		$this->logger = $logger;
		if ( ! empty( $this->logger ) ) {
			$this->set_logger( $this->logger );
		}

		// Get the kadence_starter_templates (main plugin class) instance.
		$this->kadence_starter_templates = Starter_Templates::get_instance();
	}


	/**
	 * Include required files.
	 */
	private function include_required_files() {
		if ( ! class_exists( '\WP_Importer' ) ) {
			require ABSPATH . '/wp-admin/includes/class-wp-importer.php';
		}
		if ( ! class_exists( '\AwesomeMotive\WPContentImporter2\WXRImporter' ) ) {
			require_once KADENCE_STARTER_TEMPLATES_PATH . 'vendor/wxr-importer/WXRImporter.php';
		}
		if ( ! class_exists( '\AwesomeMotive\WPContentImporter2\WXRImportInfo' ) ) {
			require_once KADENCE_STARTER_TEMPLATES_PATH . 'vendor/wxr-importer/WXRImportInfo.php';
		}
		if ( ! class_exists( '\AwesomeMotive\WPContentImporter2\Importer' ) ) {
			require_once KADENCE_STARTER_TEMPLATES_PATH . 'vendor/wxr-importer/Importer.php';
		}
		require_once KADENCE_STARTER_TEMPLATES_PATH . 'inc/class-wxr-importer.php';
	}


	/**
	 * Imports content from a WordPress export file.
	 *
	 * @param string $data_file path to xml file, file with WordPress export data.
	 */
	public function import( $data_file ) {
		$this->importer->import( $data_file );
	}


	/**
	 * Set the logger used in the import
	 *
	 * @param object $logger logger instance.
	 */
	public function set_logger( $logger ) {
		$this->importer->set_logger( $logger );
	}


	/**
	 * Get all protected variables from the WXR_Importer needed for continuing the import.
	 */
	public function get_importer_data() {
		return $this->importer->get_importer_data();
	}


	/**
	 * Sets all protected variables from the WXR_Importer needed for continuing the import.
	 *
	 * @param array $data with set variables.
	 */
	public function set_importer_data( $data ) {
		$this->importer->set_importer_data( $data );
	}

	/**
	 * Sets all protected variables from the WXR_Importer needed for continuing the import.
	 *
	 * @param  array $postdata Post data.
	 * @param  array $data     Post data.
	 * @return array           Post data.
	 */
	public function pre_post_data( $postdata, $data ) {
		$postdata['guid'] = '';

		return $postdata;
	}


	/**
	 * Import content from an WP XML file.
	 *
	 * @param string $import_file_path Path to the import file.
	 */
	public function import_content( $import_file_path, $single_page = false, $page_meta = '' ) {
		$this->microtime = microtime( true );

		// Increase PHP max execution time. Just in case, even though the AJAX calls are only 25 sec long.
		if ( strpos( ini_get( 'disable_functions' ), 'set_time_limit' ) === false ) {
			set_time_limit( apply_filters( 'kadence-starter-templates/set_time_limit_for_demo_data_import', 300 ) );
		}

		// Disable import of authors.
		add_filter( 'wxr_importer.pre_process.user', '__return_false', 20 );

		//add_filter( 'wp_import_post_data_processed', array( $this, 'pre_post_data' ), 10, 2 );
		// Meta Save Tracking info so we can remove later if desired.
		add_filter( 'wxr_importer.processed.term', array( $this, 'add_term_tracking' ), 10, 2 );
		add_action( 'wxr_importer.processed.post', array( $this, 'add_post_tracking' ), 10, 5 );

		if ( class_exists( 'Astra_WXR_Importer' ) ) {
			$astra_site_instance = \Astra_WXR_Importer::instance();
			remove_filter( 'wxr_importer.pre_process.post', array( $astra_site_instance, 'pre_process_post' ), 10 );
		}
		if ( $single_page ) {
			// Set the importing author to the current user and Import images.
			add_filter( 'wxr_importer.pre_process.post', array( $this, 'check_for_content_images' ), 10, 4 );
			//add_filter( 'wxr_importer.pre_process.post', array( $this, 'process_kadence_block_css' ), 10, 4 );
			add_action( 'wxr_importer.processed.post', array( $this, 'process_elementor' ), 10, 5 );
			if ( $page_meta && $page_meta === 'clear' ) {
				add_action( 'wxr_importer.processed.post', array( $this, 'process_single_page_clean_meta' ), 10, 5 );
			}
		} else {
			add_filter( 'wxr_importer.pre_process.post_meta', array( $this, 'process_elementor_images' ), 10, 2 );
			add_filter( 'wxr_importer.pre_process.post', array( $this, 'process_kadence_block_css' ), 10, 4 );
			//add_filter( 'wp_import_post_data_processed', array( $this, 'process_kadence_block_css_post' ), 10, 2 );
			add_filter( 'wxr_importer.pre_process.post', array( $this, 'process_internal_links' ), 11, 4 );
			//add_action( 'wxr_importer.processed.post', array( $this, 'process_internal_links' ), 10, 5 );
			// Check, if we need to send another AJAX request and set the importing author to the current user.
			add_filter( 'wxr_importer.pre_process.post', array( $this, 'new_ajax_request_maybe' ) );
			//add_action( 'wxr_importer.processed.post', array( $this, 'process_kadence_block_css_processed' ), 10, 5 );
			//add_filter( 'wxr_importer.pre_process.post', array( $this, 'process_kadence_block_css' ), 10, 5 );
			//add_action( 'wxr_importer.processed.post', array( $this, 'process_kadence_galleries' ), 10, 5 );
		}

		// Disables generation of multiple image sizes (thumbnails) in the content import step.
		if ( ! apply_filters( 'kadence-starter-templates/regenerate_thumbnails_in_content_import', true ) ) {
			add_filter( 'intermediate_image_sizes_advanced', '__return_null' );
		}

		// Import content.
		if ( ! empty( $import_file_path ) ) {
			ob_start();
				$this->import( $import_file_path );
			$message = ob_get_clean();
		}
		if ( $single_page ) {
			return $this->logger;
		}
		// Return any error messages for the front page output (errors, critical, alert and emergency level messages only).
		if ( is_object( $this->logger ) && property_exists( $this->logger, 'error_output' ) && $this->logger->error_output ) {
			return $this->logger->error_output;
		}
		return '';
	}
	/**
	 * Run elementor Import.
	 *
	 * @param int $post_id New post ID.
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function process_elementor( $post_id, $data, $meta, $comments, $terms ) {
		$meta_data = wp_list_pluck( $meta, 'key' );
		if ( in_array( '_elementor_data', $meta_data, true ) ) {
			if ( class_exists( '\Elementor\TemplateLibrary\Kadence_Starter_Templates_Elementor_Import' ) ) {
				$el_import = new \Elementor\TemplateLibrary\Kadence_Starter_Templates_Elementor_Import();
				foreach ( $meta as $key => $value ) {
					if ( '_elementor_data' === $value['key'] ) {
						$import_data = $el_import->import( $post_id, $value['value'] );
					}
				}
			}
		}
	}
	/**
	 * Process internal_links
	 *
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function process_internal_links( $data, $meta, $comments, $terms ) {
		if ( ! empty( $data['post_content'] ) && has_blocks( $data['post_content'] ) ) {
			$edit_content = stripslashes( $data['post_content'] );
			// Extract all links.
			preg_match_all( '#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $edit_content, $match );
			$all_links = array_unique( $match[0] );
			$link_mapping = array();
			$page_links  = array();
			$some_links  = array();
			// Not have any link.
			if ( ! empty( $all_links ) ) {
				// Extract normal and image links.
				foreach ( $all_links as $key => $link ) {
					if ( ! preg_match( '/^((https?:\/\/)|(www\.))([a-z0-9-].?)+(:[0-9]+)?\/[\w\-]+\.(jpg|png|gif|jpeg|svg)\/?$/i', $link ) )  {
						$page_links[] = $link;
					}
				}
				$demo_data = get_option( '_kadence_starter_templates_last_import_data', array() );
				if ( ! empty( $demo_data['url'] ) ) {
					$site_url = get_site_url();
					$demo_url = rtrim( sanitize_text_field( $demo_data['url'] ), '/' );
					foreach ( $page_links as $key => $link ) {
						$new_link = str_replace( $demo_url, $site_url, $link );
						if ( $new_link !== $link ) {
							$link_mapping[ $link ] = $new_link;
						}
					}
				}
				if ( ! empty( $link_mapping ) ) {
					foreach ( $link_mapping as $old_url => $new_url ) {
						$data['post_content'] = str_replace( $old_url, $new_url, $data['post_content'] );

						// Replace the slashed URLs if any exist.
						$old_url = str_replace( '/', '/\\', $old_url );
						$new_url = str_replace( '/', '/\\', $new_url );
						$data['post_content'] = str_replace( $old_url, $new_url, $data['post_content'] );
					}
				}
			}
		}
		return $data;
	}
	/**
	 * Process Kadence Block CSS
	 *
	 * @param string $content New post ID.
	 * @param array  $data Raw data imported for the post.
	 */
	public function process_kadence_block_css_post( $content, $data ) {
		if ( ! empty( $content['post_content'] ) ) {
			$post_content = parse_blocks( stripslashes( $content['post_content'] ) );
			foreach ( $post_content as $block ) {
				if ( ! empty( $block['attrs']['kadenceBlockCSS'] ) ) {
					$slash = str_replace( 'n ', '\n ', $block['attrs']['kadenceBlockCSS'] );
					$slash = str_replace( ';n', ';\n', $slash );
					$slash = str_replace( 'nselector', '\nselector', $slash );
					// $update = str_replace( 'n ', '\\\n ', $block['attrs']['kadenceBlockCSS'] );
					// $update = str_replace( ';n', ';\\\n', $update );
					// $update = str_replace( 'nselector', '\\\nselector', $update );
					$update = str_replace( 'n ', '', $block['attrs']['kadenceBlockCSS'] );
					$update = str_replace( ';n', ';', $update );
					$update = str_replace( 'nselector', 'selector', $update );
					if ( $update !== $slash ) {
						$content['post_content'] = str_replace( $slash, $update, $content['post_content'] );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Process Kadence Block CSS
	 *
	 * @param int $post_id New post ID.
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function process_kadence_block_css_processed( $post_id, $data, $meta, $comments, $terms ) {
		if ( ! empty( $data['post_content'] ) ) {
			$post_content = parse_blocks( $data['post_content'] );
			foreach ( $post_content as $block ) {
				if ( ! empty( $block['attrs']['kadenceBlockCSS'] ) ) {
					//error_log( print_r( $data['post_content'], true ) );
					//error_log( print_r( $block['attrs']['kadenceBlockCSS'], true ) );
					$slash = str_replace( 'n ', '\n ', $block['attrs']['kadenceBlockCSS'] );
					$slash = str_replace( ';n', ';\n', $slash );
					$slash = str_replace( '; n', '; \n', $slash );
					$slash = str_replace( 'nselector', '\nselector', $slash );
					$update = str_replace( 'n ', '\\\n ', $block['attrs']['kadenceBlockCSS'] );
					$update = str_replace( ';n', ';\\\n', $update );
					$update = str_replace( '; n', '; \\\n', $update );
					$update = str_replace( 'nselector', '\\\nselector', $update );
					// $update = str_replace( 'n ', '', $block['attrs']['kadenceBlockCSS'] );
					// $update = str_replace( ';n', ';', $update );
					// $update = str_replace( 'nselector', 'selector', $update );
					$data['post_content'] = str_replace( $slash, $update, $data['post_content'] );
					$data['post_content'] = str_replace( $block['attrs']['kadenceBlockCSS'], $update, $data['post_content'] );
				}
			}
			wp_update_post(
				array(
					'ID' => $post_id,
					'post_content' => $data['post_content'],
				)
			);
		}
	}
	/**
	 * Process Kadence Block CSS
	 *
	 * @param int $post_id New post ID.
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function process_kadence_block_css( $data, $meta, $comments, $terms ) {		
		if ( ! empty( $data['post_content'] ) && has_blocks( $data['post_content'] ) ) {
			$content = parse_blocks( $data['post_content'] );
			foreach ( $content as $indexkey => $block ) {
				if ( ! empty( $block['attrs']['kadenceBlockCSS'] ) ) {
					//stripslashes( $data['post_content'] )
					// $slash = str_replace( '{n ', '{\n ', $block['attrs']['kadenceBlockCSS'] );
					// $slash = str_replace( ';n', ';\n', $slash );
					// $slash = str_replace( '; n', '; \n', $slash );
					// $slash = str_replace( '}n', '}\n', $slash );
					// $slash = str_replace( 'nselector', '\nselector', $slash );
					$slash = wp_json_encode( $block['attrs']['kadenceBlockCSS'] );
					$update = str_replace( '\n', '\\\n', $slash );
					$slash = str_replace( '--global-palette', '\u002d\u002dglobal-palette', $slash );
					if ( $update !== $slash ) {
						$data['post_content'] = str_replace( $slash, $update, $data['post_content'] );
					}
				}
				// if ( 'kadence/testimonials' === $block['blockName'] ) {
				// 	if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
				// 		if ( ! empty( $block['attrs']['testimonials'] ) && is_array( $block['attrs']['testimonials'] ) ) {
				// 			foreach ( $block['attrs']['testimonials'] as $test_key => $test_content ) {
				// 				if ( ! empty( $test_content['title'] ) ) {
				// 					$test_slash = wp_json_encode( $test_content['title'] );
				// 					$test_update = str_replace( '\"', '\\"', $test_slash );
				// 					$test_update = str_replace( '<\/', '<\\/', $test_update );
				// 					$data['post_content'] = str_replace( $test_slash, $test_update, $data['post_content'] );
				// 				}
				// 			}
				// 		}
				// 	}
				// }
				if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
					$data['post_content'] = $this->blocks_cycle_through( $data['post_content'], $block['innerBlocks'] );
				}
			}
		}
		return $data;
	}
	/**
	 * Builds css for inner blocks
	 *
	 * @param array $inner_blocks array of inner blocks.
	 */
	public function blocks_cycle_through( $post_content, $inner_blocks ) {
		foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
			if ( ! empty( $inner_block['attrs']['kadenceBlockCSS'] ) ) {
				// $slash = str_replace( '{n ', '{\n ', $inner_block['attrs']['kadenceBlockCSS'] );
				// $slash = str_replace( ';n', ';\n', $slash );
				// $slash = str_replace( '; n', '; \n', $slash );
				// $slash = str_replace( 'nselector', '\nselector', $slash );
				// $update = str_replace( '{\n ', '{\\\n ', $inner_block['attrs']['kadenceBlockCSS'] );
				// $update = str_replace( ';\n', ';\\\n', $update );
				// $update = str_replace( '; \n', '; \\\n', $update );
				// $update = str_replace( '\nselector', '\\\nselector', $update );
				// $update = str_replace( '{n ', '{\\\n ', $update );
				// $update = str_replace( ';n', ';\\\n', $update );
				// $update = str_replace( '; n', '; \\\n', $update );
				// $update = str_replace( 'nselector', '\\\nselector', $update );
				// $update = str_replace( 'n ', '', $block['attrs']['kadenceBlockCSS'] );
				// $update = str_replace( ';n', ';', $update );
				// $update = str_replace( 'nselector', 'selector', $update );
				$slash = wp_json_encode( $inner_block['attrs']['kadenceBlockCSS'] );
				$update = str_replace( '\n', ' \\\n', $slash );
				$slash = str_replace( '--global-palette', '\u002d\u002dglobal-palette', $slash );
				if ( $update !== $slash ) {
					$post_content = str_replace( $slash, $update, $post_content );
				}
			}
			// if ( 'kadence/testimonials' === $inner_block['blockName'] ) {
			// 	if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
			// 		if ( ! empty( $inner_block['attrs']['testimonials'] ) && is_array( $inner_block['attrs']['testimonials'] ) ) {
			// 			foreach ( $inner_block['attrs']['testimonials'] as $test_key => $test_content ) {
			// 				if ( ! empty( $test_content['title'] ) ) {
			// 					$test_slash = wp_json_encode( $test_content['title'] );
			// 					$test_update = str_replace( '\"', '\\"', $test_slash );
			// 					$test_update = str_replace( '<\/', '<\\/', $test_update );
			// 					$post_content = str_replace( $test_slash, $test_update, $post_content );
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			if ( isset( $inner_block['innerBlocks'] ) && ! empty( $inner_block['innerBlocks'] ) && is_array( $inner_block['innerBlocks'] ) ) {
				$post_content = $this->blocks_cycle_through( $post_content, $inner_block['innerBlocks'] );
			}
		}
		return $post_content;
	}
	/**
	 * Process Gallery Block
	 *
	 * @param int $post_id New post ID.
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function process_kadence_galleries( $post_id, $data, $meta, $comments, $terms ) {
		$meta_data = wp_list_pluck( $meta, 'key' );
		if ( in_array( '_elementor_data', $meta_data, true ) ) {
			return;
		}
		$content_post = get_post( $post_id );
		if ( $content_post ) {
			$content = $content_post->post_content;
			$images = $this->find_all_image_urls( $content );
			if ( count( $images ) == 0 ) {
				return $data;
			}
			foreach ( $images as $image ) {
				if ( ! empty( $image['url'] ) ) {
					$this->replace_image_urls( $meta_item['value'] );
					//error_log( print_r( $images, true ) );
				}
			}
		}
	}
	/**
	 * Run elementor Import.
	 *
	 * @param int $post_id New post ID.
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function process_single_page_clean_meta( $post_id, $data, $meta, $comments, $terms ) {
		update_post_meta( $post_id, '_kad_post_title', 'hide' );
		update_post_meta( $post_id, '_kad_post_content_style', 'unboxed' );
		update_post_meta( $post_id, '_kad_post_vertical_padding', 'hide' );
		update_post_meta( $post_id, '_kad_post_feature', 'hide' );
		update_post_meta( $post_id, '_kad_post_layout', 'fullwidth' );
	}

	/**
	 * Pre-process post meta data.
	 *
	 * @param array $meta_item Meta data. (Return empty to skip.)
	 * @param int $post_id Post the meta is attached to.
	 */
	public function process_elementor_images( $meta_item, $post_id ) {
		if ( $meta_item['key'] === '_elementor_data' ) {
			if ( ! empty( $meta_item['value'] ) ) {
				$meta_item['value'] = $this->replace_image_urls( $meta_item['value'] );
			}
		}
		return $meta_item;
	}

	/**
	 * Replace demo urls in meta with site urls.
	 */
	public function replace_image_urls( $markup ) {
		// Get all slashed and un-slashed urls.
		$old_urls = $this->get_urls_to_replace( $markup );
		if ( ! is_array( $old_urls ) || empty( $old_urls ) ) {
			return $markup;
		}

		// Create an associative array.
		$urls = array_combine( $old_urls, $old_urls );
		// Unslash values of associative array.
		$urls = array_map( 'wp_unslash', $urls );
		// Remap host and directory path.
		$urls = array_map( array( $this, 'remap_host' ), $urls );
		// Replace image urls in meta.
		$markup = str_replace( array_keys( $urls ), array_values( $urls ), $markup );

		return $markup;
	}

	/**
	 * Get url replace array.
	 *
	 * @return array
	 */
	private function get_urls_to_replace( $markup ) {
		$regex = '/(?:http(?:s?):)(?:[\/\\\\\\\\|.|\w|\s|-])*\.(?:' . implode( '|', array_keys( $this->extensions ) ) . ')/m';

		if ( ! is_string( $markup ) ) {
			return array();
		}

		preg_match_all( $regex, $markup, $urls );

		$urls = array_map(
			function ( $value ) {
				return rtrim( html_entity_decode( $value ), '\\' );
			},
			$urls[0]
		);

		$urls = array_unique( $urls );

		return array_values( $urls );
	}

	/**
	 * Remap URLs host.
	 *
	 * @param $url
	 *
	 * @return string
	 */
	private function remap_host( $url ) {
		if ( ! strpos( $url, '/uploads/' ) ) {
			return $url;
		}
		$old_url   = $url;
		$url_parts = parse_url( $url );

		if ( ! isset( $url_parts['host'] ) ) {
			return $url;
		}
		$url_parts['path'] = preg_split( '/\//', $url_parts['path'] );
		$url_parts['path'] = array_slice( $url_parts['path'], - 3 );

		$uploads_dir = wp_get_upload_dir();
		$uploads_url = $uploads_dir['baseurl'];

		$new_url = esc_url( $uploads_url . '/' . join( '/', $url_parts['path'] ) );

		return str_replace( $old_url, $new_url, $url );
	}
	/**
	 * Check if we need to create a new AJAX request, so that server does not timeout.
	 *
	 * @param array $data current post data.
	 * @return array
	 */
	public function check_for_content_images( $data, $meta, $comments, $terms ) {
		$time = microtime( true ) - $this->microtime;

		// We should make a new ajax call, if the time is right.
		if ( $time > apply_filters( 'kadence-starter-templates/time_for_one_ajax_call', 25 ) ) {
			$response = array(
				'status'  => 'newAJAX',
				'message' => 'Time for new AJAX request!: ' . $time,
			);

			// Add any output to the log file and clear the buffers.
			$message = ob_get_clean();

			// Add any error messages to the frontend_error_messages variable in OCDI main class.
			if ( ! empty( $message ) ) {
				$this->kadence_starter_templates->append_to_frontend_error_messages( $message );
			}
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Add message to log file.
				$log_added = Helpers::append_to_file(
					__( 'New AJAX call!' , 'kadence-starter-templates' ) . PHP_EOL . $message,
					$this->kadence_starter_templates->get_log_file_path(),
					''
				);
			}

			// Set the current importer stat, so it can be continued on the next AJAX call.
			$this->set_current_importer_data();

			// Send the request for a new AJAX call.
			wp_send_json( $response );
		}

		// Set importing author to the current user.
		// Fixes the [WARNING] Could not find the author for ... log warning messages.
		$current_user_obj    = wp_get_current_user();
		$data['post_author'] = $current_user_obj->user_login;

		if ( isset( $data['post_content'] ) && ! empty( $data['post_content'] ) ) {

			$meta_data = wp_list_pluck( $meta, 'key' );

			if ( in_array( '_elementor_data', $meta_data, true ) ) {
				$data['post_content'] = '';
			}
		}

		if ( isset( $data['post_content'] ) && ! empty( $data['post_content'] ) ) {

			$images = $this->find_all_image_urls( stripslashes( $data['post_content'] ) );
			if ( count( $images ) == 0 ) {
				return $data;
			}
			foreach ( $images as $image ) {
				if ( ! empty( $image['url'] ) ) {
					$url_already = $this->check_for_image( $image['url'] );
					if ( $url_already ) {
						$data['post_content'] = preg_replace( '/' . preg_quote( $image['url'], '/' ) . '/', $url_already, $data['post_content'] );
					} else {
						$image_data = self::sideload_image( $image['url'] );
						if ( is_object( $image_data ) ) {
							$image_url = $image_data->url;
							$data['post_content'] = preg_replace( '/' . preg_quote( $image['url'], '/' ) . '/', $image_url, $data['post_content'] );
						}
					}
				}
			}
		}

		return $data;
	}
	/**
	 * Helper function: Sideload Image import
	 * Taken from the core media_sideload_image function and
	 * modified to return an array of data instead of html.
	 *
	 * @since 1.1.1.
	 * @param string $file The image file path.
	 * @return array An array of image data.
	 */
	private function check_for_image( $file ) {
		if ( ! empty( $file ) ) {
			preg_match( '/[^\?]+\.(jpe?g|jpe|gif|png)\b/i', $file, $matches );
			$file_name = basename( $matches[0] );
			$ext = array( ".png", ".jpg", ".gif", ".jpeg" );
			$clean_filename = str_replace( $ext, "", $file_name );
			$clean_filename = trim( html_entity_decode( sanitize_title( $clean_filename ) ) );
			if ( post_exists( $clean_filename ) ) {
				$attachment = get_page_by_title( $clean_filename, OBJECT, 'attachment' );
				if ( ! empty( $attachment ) ) {
					return wp_get_attachment_url( $attachment->ID );
				}
			}
		}
		return false;

	}

	/**
	 * Helper function: Sideload Image import
	 * Taken from the core media_sideload_image function and
	 * modified to return an array of data instead of html.
	 *
	 * @since 1.1.1.
	 * @param string $file The image file path.
	 * @return array An array of image data.
	 */
	private static function sideload_image( $file ) {
		$data = new \stdClass();

		if ( ! function_exists( 'media_handle_sideload' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/media.php' );
			require_once( ABSPATH . 'wp-admin/includes/file.php' );
			require_once( ABSPATH . 'wp-admin/includes/image.php' );
		}
		if ( ! empty( $file ) ) {
			// Set variables for storage, fix file filename for query strings.
			preg_match( '/[^\?]+\.(jpe?g|jpe|gif|png)\b/i', $file, $matches );
			$file_array = array();
			$file_array['name'] = basename( $matches[0] );

			// Download file to temp location.
			$file_array['tmp_name'] = download_url( $file );

			// If error storing temporarily, return the error.
			if ( is_wp_error( $file_array['tmp_name'] ) ) {
				return $file_array['tmp_name'];
			}

			// Do the validation and storage stuff.
			$id = media_handle_sideload( $file_array, 0 );

			// If error storing permanently, unlink.
			if ( is_wp_error( $id ) ) {
				unlink( $file_array['tmp_name'] );
				return $id;
			}

			// Build the object to return.
			$meta                = wp_get_attachment_metadata( $id );
			$data->attachment_id = $id;
			$data->url           = wp_get_attachment_url( $id );
			$data->thumbnail_url = wp_get_attachment_thumb_url( $id );
			$data->height        = $meta['height'];
			$data->width         = $meta['width'];
		}

		return $data;
	}
	/**
	 * Find image urls in content and retrieve urls by array
	 *
	 * @param string $content the post content.
	 * @return array
	 */
	public function find_all_image_urls( $content ) {
		$urls1 = array();
		preg_match_all( '/<img[^>]*srcset=["\']([^"\']*)[^"\']*["\'][^>]*>/i', $content, $srcsets, PREG_SET_ORDER );
		if ( count( $srcsets ) > 0 ) {
			$count = 0;
			foreach ( $srcsets as $key => $srcset ) {
				preg_match_all( '/https?:\/\/[^\s,]+/i', $srcset[1], $srcsetUrls, PREG_SET_ORDER );
				if ( count( $srcsetUrls ) == 0 ) {
					continue;
				}
				foreach ( $srcsetUrls as $srcsetUrl ) {
					$urls1[$count][] = $srcset[0];
					$urls1[$count][] = $srcsetUrl[0];
					$count++;
				}
			}
		}

		preg_match_all( '/<img[^>]*src=["\']([^"\']*)[^"\']*["\'][^>]*>/i', $content, $urls, PREG_SET_ORDER );
		$urls = array_merge( $urls, $urls1 );

		//preg_match_all( '/"bgImg":["]([^"]*)[^"]*["][^>]*-->/i', $content, $bg_urls, PREG_SET_ORDER );
		preg_match_all( '/"bgImg":"([^"]*)["]*"/i', $content, $bg_urls, PREG_SET_ORDER );
		if ( is_array( $bg_urls ) ) {
			$urls = array_merge( $bg_urls, $urls );
		}

		if ( count( $urls ) == 0 ) {
			return array();
		}

		foreach ( $urls as $index => &$url ) {
			$images[ $index ]['url'] = $url = $url[1];
		}
		foreach ( array_unique( $urls ) as $index => $url ) {
			$unique_array[] = $images[ $index ];
		}
		return $unique_array;
	}
	/**
	 * Check if we need to create a new AJAX request, so that server does not timeout.
	 *
	 * @param array $data current post data.
	 * @return array
	 */
	public function new_ajax_request_maybe( $data ) {
		$time = microtime( true ) - $this->microtime;

		// We should make a new ajax call, if the time is right.
		if ( $time > apply_filters( 'kadence-starter-templates/time_for_one_ajax_call', 25 ) ) {
			$response = array(
				'status'  => 'newAJAX',
				'message' => 'Time for new AJAX request!: ' . $time,
			);

			// Add any output to the log file and clear the buffers.
			$message = ob_get_clean();

			// Add any error messages to the frontend_error_messages variable in OCDI main class.
			if ( ! empty( $message ) ) {
				$this->kadence_starter_templates->append_to_frontend_error_messages( $message );
			}
			if ( apply_filters( 'kadence_starter_templates_save_log_files', false ) ) {
				// Add message to log file.
				$log_added = Helpers::append_to_file(
					__( 'New AJAX call!' , 'kadence-starter-templates' ) . PHP_EOL . $message,
					$this->kadence_starter_templates->get_log_file_path(),
					''
				);
			}

			// Set the current importer stat, so it can be continued on the next AJAX call.
			$this->set_current_importer_data();

			// Send the request for a new AJAX call.
			wp_send_json( $response );
		}

		// Set importing author to the current user.
		// Fixes the [WARNING] Could not find the author for ... log warning messages.
		$current_user_obj    = wp_get_current_user();
		$data['post_author'] = $current_user_obj->user_login;

		return $data;
	}
	/**
	 * Add Meta info so we can query this term later if needed to remove.
	 *
	 * @param int $term_id New term ID.
	 * @param array $data Raw data imported for the term.
	 */
	public function add_term_tracking( $term_id, $data ) {
		update_term_meta( $term_id, '_kadence_starter_templates_imported_term', true );
	}
	/**
	 * Run elementor Import.
	 *
	 * @param int $post_id New post ID.
	 * @param array $data Raw data imported for the post.
	 * @param array $meta Raw meta data, already processed by {@see process_post_meta}.
	 * @param array $comments Raw comment data, already processed by {@see process_comments}.
	 * @param array $terms Raw term data, already processed.
	 */
	public function add_post_tracking( $post_id, $data, $meta, $comments, $terms ) {
		update_post_meta( $post_id, '_kadence_starter_templates_imported_post', true );
	}

	/**
	 * Set current state of the content importer, so we can continue the import with new AJAX request.
	 */
	private function set_current_importer_data() {
		$data = array_merge( $this->kadence_starter_templates->get_current_importer_data(), $this->get_importer_data() );

		Helpers::set_import_data_transient( $data );
	}
}
