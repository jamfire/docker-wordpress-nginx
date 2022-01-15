<?php
/**
 * Class for importing elementor data.
 *
 * @package Kadence Starter Templates
 */

namespace Elementor\TemplateLibrary;

if ( ! class_exists( '\Elementor\Plugin' ) ) {
	return;
}

use Elementor\Plugin;

/**
 * Class for importing elementor data.
 */
class Kadence_Starter_Templates_Elementor_Import extends Source_Local {

	/**
	 * Update the elementor meta data.
	 *
	 * @param integer $post_id the post id to update.
	 * @param array   $data the meta data to update.
	 */
	public function import( $post_id = 0, $data = array() ) {
		if ( empty( $post_id ) || empty( $data ) ) {
			return array();
		}
		if ( ! is_array( $data ) ) {
			$data = json_decode( $data, true );
		}
		// Import the data.
		$data = $this->replace_elements_ids( $data );
		$data = $this->process_export_import_content( $data, 'on_import' );

		$document = Plugin::$instance->documents->get( $post_id );
		if ( $document ) {
			$data = $document->get_elements_raw_data( $data, true );
		}

		// Update processed meta.
		update_metadata( 'post', $post_id, '_elementor_data', $data );

		Plugin::$instance->files_manager->clear_cache();

		return $data;

	}
}
