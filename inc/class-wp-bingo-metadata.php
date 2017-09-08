<?php
/**
 * The plugin class to set up metadata needed for our Bingo cards.
 */
class WP_Bingo_Metadata {

	/**
	 * A reference to an instance of this class.
	 */
	private static $instance = false;

	/**
	 * The array of templates that this plugin tracks.
	 */
	protected $templates;

	/**
	 * Singleton
	 *
	 * Returns a single instance of the current class.
	 */
	public static function singleton() {

		if ( !self::$instance )
			self::$instance = new self;

		return self::$instance;
	}

	public function __construct() {

		// Retrieve the templates from our template setup class
		$this->templates	= WP_Bingo_Template::singleton()->get_templates();

		add_action( 'add_meta_boxes', array( $this, 'add_buzzwords_metabox' ), 10, 2 );
		add_action( 'save_post', array( $this, 'save_buzzwords_data' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_metadata_scripts_and_styles' ) );

	}

	/**
	 * Checks if we are in an object that is using our templates
	 *
	 * @param string	$post_type	Post type in the admin area
	 * @param object	$post		Contains all the data of the current object
	 */
	public function add_buzzwords_metabox( $post_type, $post ) {

		if ( !empty( $post ) ) {

			$template	= get_post_meta( $post->ID, '_wp_page_template', true );

			if ( array_key_exists ( $template, $this->templates ) ) {
				add_meta_box(
					'wp-bingo-meta', // id
					'Bingo Buzzwords', // title
					array( $this, 'wp_bingo_meta_html' ), // callback
					'page', // object type
					'normal', // context
					'high' // priority
				 );
			}

		}

	}

	/**
	 * Callback function which generates the metabox's html
	 *
	 * @param object	$post_type	Contains all the data of the current object
	 */
	public function wp_bingo_meta_html( $post ) {

		$buzzwords	= get_post_meta( $post->ID, '_bingo_buzzwords', true );
		$i		= 0;
		?>

		<div class="wb-repeatable-fields" data-repeat-limit="24">

			<?php

			// if buzzwords are defined, print them all out
			if ( !empty( $buzzwords ) ) {

				foreach ( $buzzwords as $buzzword ) :

					$this->generate_buzzword_repeatable_field( ++$i, $buzzword );

				endforeach;

			} else {

				// if buzzwords are empty/undefined, print out one empty field to display
				$this->generate_buzzword_repeatable_field( ++$i );

			}

			// definitely print one empty hidden field so the JS has something to work with
			$this->generate_buzzword_repeatable_field( ++$i, '', true );

			?>

			<button class="button alignright add-field">Add Buzzword</button>

		</div>

		<div class="clear"></div>

		<?php

	}

	/**
	 * Set up and save the metadata or our custom metabox
	 *
	 * @param int	$post_ID	Post ID.
	 */
	public function save_buzzwords_data( $post_ID ) {

		if ( array_key_exists( 'bingo_buzzwords', $_POST ) ) {

			$buzzwords	= $_POST['bingo_buzzwords'];

			// make absolutely sure it's an array
			if ( !is_array( $buzzwords ) )
				return;

			// remove empty values
			$buzzwords	= array_filter( $_POST['bingo_buzzwords'] );

			// trim whitespace of values
			$buzzwords	= array_map( 'trim', $buzzwords );

			update_post_meta( $post_ID, '_bingo_buzzwords', $buzzwords );

		}

	}

	/**
	 * Helper function to generate the repeatable fields in our custom metabox
	 *
	 * @param integer	$iterator Number iterator for the field count
	 * @param string	$value    Value of the field
	 * @param boolean	$hidden   Whether or not this should be hidden via CSS
	 */
	private function generate_buzzword_repeatable_field( $iterator = 0, $value = '', $hidden = false ) {

		$hidden_class		= $hidden ? ' empty-field hidden' : '';
		$value_attribute	= $value != '' ? 'value="' . esc_attr( $value ) .'"' : ''; ?>

		<div class="row wb-repeatable-field<?php echo $hidden_class; ?>" data-iterator="<?php echo $iterator; ?>">
			<input type="text" name="bingo_buzzwords[]" class="large-text" placeholder="Bingo buzzword text" <?php echo $value_attribute; ?>>

			<button class="button remove-field">Remove</button>
		</div>

		<?php

	}

	/**
	 * Callback function to register our admin script file in the proper screens
	 */
	public function register_metadata_scripts_and_styles() {

		/**
		 * Check if we are in an object that is using our template
		 */
		global $post;

		if ( !empty( $post ) ) {

			$template	= get_post_meta( $post->ID, '_wp_page_template', true );

			if ( array_key_exists ( $template, $this->templates ) ) {

				wp_enqueue_script( 'wpbingo-admin-js', plugin_dir_url( dirname( __FILE__ ) ) .'js/admin.js', array( 'jquery' ), WP_BINGO_VERSION, true );

			}

		}

	}

}
