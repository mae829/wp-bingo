<?php
/**
 * The plugin class to set up metadata needed for our Bingo cards.
 */

/**
 * WP_Bingo_Metadata
 */
class WP_Bingo_Metadata {

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
		// Retrieve the templates from our template setup class.
		$this->templates = WP_Bingo_Template::singleton()->get_templates();

		add_action( 'add_meta_boxes', array( $this, 'add_buzzwords_metabox' ), 10, 2 );
		add_action( 'save_post', array( $this, 'save_data' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_metadata_scripts_and_styles' ) );
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
	 * Checks if we are in an object that is using our templates
	 *
	 * @param string $post_type Post type in the admin area.
	 * @param object $post      Contains all the data of the current object.
	 */
	public function add_buzzwords_metabox( $post_type, $post ) {
		if ( ! empty( $post ) ) {

			$template = get_post_meta( $post->ID, '_wp_page_template', true );

			if ( array_key_exists( $template, $this->templates ) || has_shortcode( $post->post_content, 'wp_bingo' ) ) {
				add_meta_box(
					'wp-bingo-meta', // ID.
					'Bingo Options', // title.
					array( $this, 'wp_bingo_meta_html' ), // callback.
					$post_type, // object type.
					'normal', // context.
					'high' // priority.
				);
			}
		}
	}

	/**
	 * Callback function which generates the metabox's html
	 *
	 * @param object $post Contains all the data of the current object.
	 */
	public function wp_bingo_meta_html( $post ) {
		$numbers        = get_post_meta( $post->ID, '_bingo_numbers', true );
		$buzzwords      = get_post_meta( $post->ID, '_bingo_buzzwords', true );
		$words_iterator = 0;

		// Add an nonce field so we can check for it later.
		wp_nonce_field( 'wp_bingo_box', 'wp_bingo_box_nonce' );
		?>

		<div class="wb-numbers">
			<label for="bingo_numbers">Use Numbers</label>
			<input type="checkbox" name="bingo_numbers" id="bingo_numbers" value="1" <?php checked( $numbers, '1', true ); ?> />
			<p class="description">Numbers will be generated instead of buzzwords. If selected, buzzwords will be ignored.</p>
		</div>

		<div class="wb-repeatable-fields" data-repeat-limit="24">
			<h3>Buzzwords</h3>
			<?php
			// If buzzwords are defined, print them all out.
			if ( ! empty( $buzzwords ) ) {
				foreach ( $buzzwords as $buzzword ) :
					$this->generate_buzzword_repeatable_field( ++$words_iterator, $buzzword );
				endforeach;
			} else {
				// If buzzwords are empty/undefined, print out one empty field to display.
				$this->generate_buzzword_repeatable_field( ++$words_iterator );
			}

			// Definitely print one empty hidden field so the JS has something to work with.
			$this->generate_buzzword_repeatable_field( ++$words_iterator, '', true );
			?>

			<button class="button alignright add-field">Add Buzzword</button>

		</div>

		<div class="clear"></div>

		<?php
	}

	/**
	 * Set up and save the metadata or our custom metabox
	 *
	 * @param int $post_ID Post ID.
	 */
	public function save_data( $post_ID ) {
		// If this is an autosave, our form has not been submitted, so we don't want to do anything.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Verify this came from where the screen is supposed to be.
		if ( empty( $_POST['wp_bingo_box_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['wp_bingo_box_nonce'] ), 'wp_bingo_box' ) ) {
			return;
		}

		if (
			isset( $_POST['bingo_numbers'] )
		) {
			$numbers_option = sanitize_text_field( wp_unslash( $_POST['bingo_numbers'] ) );
			update_post_meta( $post_ID, '_bingo_numbers', $numbers_option );
		} elseif ( metadata_exists( 'post', $post_ID, '_bingo_numbers' ) ) {
			delete_post_meta( $post_ID, '_bingo_numbers' );
		}

		// Make absolutely sure buzzwords value exists and it's an array.
		if (
			isset( $_POST['bingo_buzzwords'] )
			&& is_array( $_POST['bingo_buzzwords'] )
		) {
			$buzzwords = array_map( 'sanitize_text_field', wp_unslash( $_POST['bingo_buzzwords'] ) );

			// Trim whitespace of values.
			$buzzwords = array_map( 'trim', $buzzwords );

			// Remove empty values.
			$buzzwords = array_filter( $buzzwords );

			update_post_meta( $post_ID, '_bingo_buzzwords', $buzzwords );
		}
	}

	/**
	 * Helper function to generate the repeatable fields in our custom metabox
	 *
	 * @param integer $iterator Number iterator for the field count.
	 * @param string  $value    Value of the field.
	 * @param boolean $hidden   Whether or not this should be hidden via CSS.
	 */
	private function generate_buzzword_repeatable_field( $iterator = 0, $value = '', $hidden = false ) {
		$hidden_class = $hidden ? ' empty-field hidden' : '';
		?>

		<div class="row wb-repeatable-field<?php echo esc_attr( $hidden_class ); ?>" data-iterator="<?php echo esc_attr( $iterator ); ?>">
			<input type="text" name="bingo_buzzwords[]" class="large-text" placeholder="Bingo buzzword text" value="<?php echo esc_attr( $value ); ?>">

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

		if ( ! empty( $post ) ) {

			$template = get_post_meta( $post->ID, '_wp_page_template', true );

			if ( array_key_exists( $template, $this->templates ) ) {
				wp_enqueue_script( 'wpbingo-admin-js', plugin_dir_url( dirname( __FILE__ ) ) . 'assets/js/admin.min.js', array( 'jquery' ), WP_BINGO_VERSION, true );
			}
		}
	}
}
