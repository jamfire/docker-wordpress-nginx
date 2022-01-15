<?php
/**
 * A class that extends WP_Customize_Setting so we can access
 * the protected updated method when importing options.
 *
 * Used in the Customizer importer.
 *
 * @since 1.0.4
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

use WP_Customize_Setting;

/**
 * A class that extends WP_Customize_Setting so we can access
 * the protected updated method when importing options.
 */
final class Import_Option extends \WP_Customize_Setting {

	/**
	 * Import an option value for this setting.
	 *
	 * @since 0.3
	 * @param mixed $value The option value.
	 * @return void
	 */
	public function import( $value ) {
		$this->update( $value );
	}
}
