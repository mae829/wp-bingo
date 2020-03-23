<?php
/**
 * Plugin Name: WP Bingo
 * Plugin URI:  https://miguelestrada.dev/
 * Description: Fun plugin to play bingo
 * Version:     1.0.0
 * Author:      Mike Estrada
 * Author URI:  https://miguelestrada.dev/
 * Text Domain: wp-bingo
 */

if ( ! defined( 'WPINC' ) ) {
	die( 'YOU SHALL NOT PASS!' );
}

define( 'WP_BINGO_VERSION', '1.0' );

/**
 * The core plugin class file.
 */
require plugin_dir_path( __FILE__ ) . 'inc/class-wp-bingo.php';

WP_Bingo::singleton();
