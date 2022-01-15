<?php
/**
 * Logger class
 * Describes a logger instance
 *
 * Based on PSR-3: http://www.php-fig.org/psr/psr-3/
 *
 * The message MUST be a string or object implementing __toString().
 *
 * The message MAY contain placeholders in the form: {foo} where foo
 * will be replaced by the context data in key "foo".
 *
 * The context array can contain arbitrary data, the only assumption that
 * can be made by implementors is that if an Exception instance is given
 * to produce a stack trace, it MUST be in a key named "exception".
 *
 * See https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
 * for the full interface specification.
 *
 * @see https://github.com/humanmade/WordPress-Importer/blob/master/class-logger.php
 * @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

class Logger_CLI extends Logger {

	public $min_level = 'notice';
	/**
	 * Variable for front-end error display.
	 *
	 * @var string
	 */
	public $error_output = '';

	/**
	 * Overwritten log function from WP_Importer_Logger_CLI.
	 *
	 * Logs with an arbitrary level.
	 *
	 * @param mixed  $level level of reporting.
	 * @param string $message log message.
	 * @param array  $context context to the log message.
	 */
	public function log( $level, $message, array $context = array() ) {
		// Save error messages for front-end display.
		$this->error_output( $level, $message, $context = array() );

		if ( $this->level_to_numeric( $level ) < $this->level_to_numeric( $this->min_level ) ) {
			return;
		}

		printf(
			'[%s] %s' . PHP_EOL,
			strtoupper( $level ),
			$message
		);
	}


	/**
	 * Save messages for error output.
	 * Only the messages greater then Error.
	 *
	 * @param mixed  $level level of reporting.
	 * @param string $message log message.
	 * @param array  $context context to the log message.
	 */
	public function error_output( $level, $message, array $context = array() ) {
		if ( $this->level_to_numeric( $level ) < $this->level_to_numeric( 'error' ) ) {
			return;
		}

		$this->error_output .= sprintf(
			'[%s] %s<br>',
			strtoupper( $level ),
			$message
		);
	}

	public static function level_to_numeric( $level ) {
		$levels = array(
			'emergency' => 8,
			'alert'     => 7,
			'critical'  => 6,
			'error'     => 5,
			'warning'   => 4,
			'notice'    => 3,
			'info'      => 2,
			'debug'     => 1,
		);
		if ( ! isset( $levels[ $level ] ) ) {
			return 0;
		}

		return $levels[ $level ];
	}
}