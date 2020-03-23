<?php
/**
 * The core plugin class.
 *
 * Page template code from https://github.com/wpexplorer/page-templater
 */

/**
 * WP_Bingo
 */
class WP_Bingo {
	/**
	 * Instance of this class
	 *
	 * @var boolean
	 */
	private static $instance = false;

	/**
	 * Distribute tasks
	 */
	public function __construct() {
		$this->load_dependencies();
	}

	/**
	 * Singleton
	 *
	 * Returns a single instance of this class.
	 */
	public static function singleton() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Load the required dependencies for the plugin.
	 */
	private function load_dependencies() {
		/**
		 * The class responsible for setting up the page-template of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'inc/class-wp-bingo-template.php';
		WP_Bingo_Template::singleton();

		/**
		 * The class responsible for setting up the shortcode of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'inc/class-wp-bingo-shortcode.php';
		WP_Bingo_Shortcode::singleton();

		/**
		 * The class responsible for handling the metadata for our plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'inc/class-wp-bingo-metadata.php';
		WP_Bingo_Metadata::singleton();
	}

}
