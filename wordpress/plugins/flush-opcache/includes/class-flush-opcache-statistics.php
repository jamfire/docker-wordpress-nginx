<?php
/**
 * OPcache statistics class file
 * Thanks to https://github.com/amnuts/opcache-gui
 *
 * @package flush-opcache
 */

/**
 * Main class
 *
 * Get all statistics and configurations
 *
 * @package flush-opcache
 */
class Flush_Opcache_Statistics {

	/**
	 * Array containing statistics and configurations
	 *
	 * @var array
	 */
	protected $data;

	/**
	 * Array containing OPcache optimization levels
	 *
	 * @var array
	 */
	protected $optimization_levels;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->optimization_levels = array(
			1 << 0  => 'CSE, STRING construction',
			1 << 1  => 'Constant conversion and jumps',
			1 << 2  => '++, +=, series of jumps',
			1 << 3  => 'INIT_FCALL_BY_NAME -> DO_FCALL',
			1 << 4  => 'CFG based optimization',
			1 << 5  => 'DFA based optimization',
			1 << 6  => 'CALL GRAPH optimization',
			1 << 7  => 'SCCP (constant propagation)',
			1 << 8  => 'TMP VAR usage',
			1 << 9  => 'NOP removal',
			1 << 10 => 'Merge equal constants',
			1 << 11 => 'Adjust used stack',
			1 << 12 => 'Remove unused variables',
			1 << 13 => 'DCE (dead code elimination)',
			1 << 14 => '(unsafe) Collect constants',
			1 << 15 => 'Inline functions',
		);

		$this->data = $this->merge_stats();
	}

	/**
	 * Public function to retrieve all statistics
	 *
	 * @param  string|null $section to get only part of stats.
	 * @param  string|null $property to get only part of section.
	 * @return array|mixed|null
	 */
	public function get_stats( ?string $section = null, ?string $property = null ) {
		if ( null === $section ) {
			return $this->data;
		}
			$section = strtolower( $section );
		if ( isset( $this->data[ $section ] ) ) {
			if ( null === $property || ! isset( $this->data[ $section ][ $property ] ) ) {
				return $this->data[ $section ];
			}
			return $this->data[ $section ][ $property ];
		}
		return null;
	}

	/**
	 * Merge all stats in one array
	 *
	 * @return array
	 */
	protected function merge_stats(): array {
		$status         = opcache_get_status();
		$config         = opcache_get_configuration();
		$missing_config = array_diff_key( ini_get_all( 'zend opcache', false ), $config['directives'] );
		if ( ! empty( $missing_config ) ) {
			$config['directives'] = array_merge( $config['directives'], $missing_config );
		}

		if ( $config['directives']['opcache.file_cache_only'] || ! empty( $status['file_cache_only'] ) ) {
				$overview = false;
		} else {
				$overview = array_merge(
					$status['memory_usage'],
					$status['opcache_statistics'],
					array(
						'used_memory_percentage' => round(
							100 * (
							( $status['memory_usage']['used_memory'] + $status['memory_usage']['wasted_memory'] )
							/ $config['directives']['opcache.memory_consumption']
							)
						),
						'hit_rate_percentage'    => round( $status['opcache_statistics']['opcache_hit_rate'] ),
						'used_key_percentage'    => round(
							100 * (
							$status['opcache_statistics']['num_cached_keys']
							/ $status['opcache_statistics']['max_cached_keys']
							)
						),
						'wasted_percentage'      => round( $status['memory_usage']['current_wasted_percentage'], 2 ),
						'readable'               => array(
							'total_memory'       => size_format( $config['directives']['opcache.memory_consumption'] ),
							'used_memory'        => size_format( $status['memory_usage']['used_memory'] ),
							'free_memory'        => size_format( $status['memory_usage']['free_memory'] ),
							'wasted_memory'      => size_format( $status['memory_usage']['wasted_memory'] ),
							'num_cached_scripts' => number_format( $status['opcache_statistics']['num_cached_scripts'] ),
							'hits'               => number_format( $status['opcache_statistics']['hits'] ),
							'misses'             => number_format( $status['opcache_statistics']['misses'] ),
							'blacklist_miss'     => number_format( $status['opcache_statistics']['blacklist_misses'] ),
							'num_cached_keys'    => number_format( $status['opcache_statistics']['num_cached_keys'] ),
							'max_cached_keys'    => number_format( $status['opcache_statistics']['max_cached_keys'] ),
							'interned'           => null,
							'start_time'         => gmdate( 'Y-m-d H:i:s', $status['opcache_statistics']['start_time'] ),
							'last_restart_time'  => ( 0 === $status['opcache_statistics']['last_restart_time']
									? 'never'
									: gmdate( 'Y-m-d H:i:s', $status['opcache_statistics']['last_restart_time'] )
							),
						),
					)
				);
		}

		$preload = array();
		if ( ! empty( $status['preload_statistics']['scripts'] ) ) {
			$preload = $status['preload_statistics']['scripts'];
			sort( $preload, SORT_STRING );
			if ( $overview ) {
				$overview['preload_memory']             = $status['preload_statistics']['memory_consumption'];
				$overview['readable']['preload_memory'] = size_format( $status['preload_statistics']['memory_consumption'] );
			}
		}

		if ( ! empty( $status['interned_strings_usage'] ) ) {
			$overview['readable']['interned'] = array(
				'buffer_size'         => size_format( $status['interned_strings_usage']['buffer_size'] ),
				'strings_used_memory' => size_format( $status['interned_strings_usage']['used_memory'] ),
				'strings_free_memory' => size_format( $status['interned_strings_usage']['free_memory'] ),
				'number_of_strings'   => number_format( $status['interned_strings_usage']['number_of_strings'] ),
			);
		}

		$directives = array();
		ksort( $config['directives'] );
		foreach ( $config['directives'] as $k => $v ) {
			if ( in_array( $k, array( 'opcache.max_file_size', 'opcache.memory_consumption' ), true ) && $v ) {
				$v = size_format( $v ) . " ({$v})";
			} elseif ( 'opcache.optimization_level' === $k ) {
				$levels = array();
				foreach ( $this->optimization_levels as $level => $info ) {
					if ( $level & $v ) {
						$levels[] = $info;
					}
				}
				$v = isset( $levels ) ? $levels : 'none';
			}
			$directives[] = array(
				'k' => $k,
				'v' => $v,
			);
		}

		$version = array_merge(
			$config['version'],
			array(
				'php'    => phpversion(),
				'server' => isset( $_SERVER['SERVER_SOFTWARE'] ) ? $_SERVER['SERVER_SOFTWARE'] : '', // phpcs:ignore
				'host'   => ( function_exists( 'gethostname' )
						? gethostname()
						: ( php_uname( 'n' )
							?: ( empty( $_SERVER['SERVER_NAME'] ) // phpcs:ignore
								? $_SERVER['HOST_NAME'] // phpcs:ignore
								: $_SERVER['SERVER_NAME'] // phpcs:ignore
							)
						)
				),
			)
		);

		return array(
			'version'    => $version,
			'overview'   => $overview,
			'preload'    => $preload,
			'directives' => $directives,
			'blacklist'  => $config['blacklist'],
			'functions'  => get_extension_funcs( 'Zend OPcache' ),
		);

	}
}
