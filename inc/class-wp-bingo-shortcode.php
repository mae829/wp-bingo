<?php
/**
 * The plugin class to add our custom shortcode.
 */

/**
 * WP_Bingo_Shortcode
 */
class WP_Bingo_Shortcode {

	/**
	 * Instance of this class
	 *
	 * @var boolean
	 */
	private static $instance = false;

	/**
	 * Constructor
	 *
	 * - Used in the standard way and to defines all the WordPress actions and filters used by this theme
	 */
	public function __construct() {
		// Register the wp_bingo shortcode.
		add_shortcode( 'wp_bingo', array( $this, 'bingo_shortcode' ) );
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
	 * Shortcode building function
	 *
	 * @return  string  Contains the markup for the bingo table
	 */
	public function bingo_shortcode() {
		// Get required metadata.
		$post_ID   = get_the_ID();
		$buzzwords = get_post_meta( $post_ID, '_bingo_buzzwords', true );

		// Header Word.
		$header_word = 'BINGO';
		$header_word = apply_filters( 'wp_bingo_header_word', $header_word );

		$header_word_array = str_split( $header_word, 1 );

		// Call up the needed style/script files.
		wp_enqueue_style( 'wp-bingo' );
		wp_enqueue_script( 'wp-bingo' );

		// Start getting content of shortcode ready.
		ob_start();
		?>

		<div class="wp-bingo__header">
			<?php
			foreach ( $header_word_array as $letter ) {
				echo '<div>' . esc_html( $letter ) . '</div>';
			}
			?>
		</div>

		<div class="wp-bingo__wrapper">
			<?php
			if ( ! empty( $buzzwords ) ) {

				$count_words = count( $buzzwords );

				for ( $i = 0; $i < $count_words; $i++ ) {

					// FREE TILE.
					if ( 12 === $i ) {
						echo '<div class="wp-bingo__item active">FREE</div>' . "\n\t\t\t\t";
					}

					$word = array_rand( $buzzwords );

					echo '<div class="wp-bingo__item">' . esc_html( $buzzwords[ $word ] ) . '</div>' . "\n\t\t\t\t";

					unset( $buzzwords[ $word ] );

				}
			} else {
				echo 'NEED BUZZWORDS TO BE POPULATED';
			}
			?>
		</div>
		<?php
		return ob_get_clean();
	}
}
