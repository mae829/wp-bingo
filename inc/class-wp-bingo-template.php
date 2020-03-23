<?php
/**
 * The plugin class to set up template definition and loading.
 *
 * Page template code from https://github.com/wpexplorer/page-templater
 */

/**
 * WP_Bingo_Template
 */
class WP_Bingo_Template {
	/**
	 * Instance of this class
	 *
	 * @var boolean
	 */
	private static $instance = false;

	/**
	 * The array of templates that this plugin tracks.
	 *
	 * @var array
	 */
	protected $templates;

	/**
	 * Constructor
	 *
	 * - Used in the standard way and to defines all the WordPress actions and filters used by this theme
	 */
	public function __construct() {
		$this->templates = array();

		// Add a filter to the attributes metabox to inject template into the cache.
		if ( version_compare( floatval( get_bloginfo( 'version' ) ), '4.7', '<' ) ) {
			// 4.6 and older
			add_filter( 'page_attributes_dropdown_pages_args', array( $this, 'register_project_templates' ) );
		} else {
			// Add a filter to the wp 4.7 version attributes metabox.
			add_filter( 'theme_page_templates', array( $this, 'add_new_template' ) );
		}

		// Add a filter to the save post to inject out template into the page cache.
		add_filter( 'wp_insert_post_data', array( $this, 'register_project_templates' ) );

		// Add a filter to the template include to determine if the page has our template assigned and return it's path.
		add_filter( 'template_include', array( $this, 'view_project_template' ) );

		// Add your templates to this array.
		$this->templates = array(
			'template-bingo-simple.php' => 'Bingo - Simple',
			'template-bingo-theme.php'  => 'Bingo - Theme',
		);

		add_action( 'wp_enqueue_scripts', array( $this, 'register_public_scripts_and_styles' ) );
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
	 * Adds our template to the page dropdown for v4.7+
	 *
	 * @param string[] $posts_templates Array of page templates. Keys are filenames.
	 *
	 * @return array
	 */
	public function add_new_template( $posts_templates ) {
		$posts_templates = array_merge( $posts_templates, $this->templates );
		return $posts_templates;
	}

	/**
	 * Adds our template to the pages cache in order to trick WordPress
	 * into thinking the template file exists where it does not really exist.
	 *
	 * @param array $atts An array of slashed post data.
	 */
	public function register_project_templates( $atts ) {
		// Create the key used for the themes cache.
		$cache_key = 'page_templates-' . md5( get_theme_root() . '/' . get_stylesheet() );

		// Retrieve the cache list.
		// If it doesn't exist, or it's empty prepare an array.
		$templates = wp_get_theme()->get_page_templates();

		if ( empty( $templates ) ) {
			$templates = array();
		}

		// New cache, therefore remove the old one.
		wp_cache_delete( $cache_key, 'themes' );

		// Now add our template to the list of templates by merging our templates with the existing templates array from the cache.
		$templates = array_merge( $templates, $this->templates );

		// Add the modified cache to allow WordPress to pick it up for listing available templates.
		wp_cache_add( $cache_key, $templates, 'themes', 1800 );

		return $atts;
	}

	/**
	 * Checks if the template is assigned to the page
	 *
	 * @param  string $template Location to template to use.
	 * @return string           Original or our custom template to use.
	 */
	public function view_project_template( $template ) {
		// Return the search template if we're searching (instead of the template for the first result).
		if ( is_search() ) {
			return $template;
		}

		// Get global post.
		global $post;

		// Return template if post is empty.
		if ( ! $post ) {
			return $template;
		}

		$wp_page_template = get_post_meta( $post->ID, '_wp_page_template', true );

		// Return default template if we don't have a custom one defined.
		if ( ! isset( $this->templates[ $wp_page_template ] ) ) {
			return $template;
		}

		$file = plugin_dir_path( __FILE__ ) . $wp_page_template;

		// Just to be safe, we check if the file exist first.
		if ( file_exists( $file ) ) {
			return $file;
		}

		// Return template.
		return $template;
	}

	/**
	 * Register all of the hooks related to the public-facing functionality of the plugin.
	 */
	public function register_public_scripts_and_styles() {
		wp_register_style( 'wp-bingo', plugin_dir_url( dirname( __FILE__ ) ) . 'assets/css/wp-bingo.min.css', array(), WP_BINGO_VERSION );
		wp_register_script( 'wp-bingo', plugin_dir_url( dirname( __FILE__ ) ) . 'assets/js/wp-bingo.min.js', array(), WP_BINGO_VERSION, true );
	}

	/**
	 * Helper function to retrieve the templates list
	 *
	 * @return array Consists of the templates defined above by the class
	 */
	public function get_templates() {
		return $this->templates;
	}
}
