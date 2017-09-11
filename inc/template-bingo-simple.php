<?php
	/**
	 * Template Name: Bingo - Basic
	 * Template Post Type: page
	 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<link rel="stylesheet" href="<?php echo plugin_dir_url( dirname( __FILE__ ) ); ?>css/wp-bingo.min.css">
		<?php do_action('wb-simple-header') ?>
	</head>
	<body class="wp-bingo layout-simple">
		<div class="wrapper">

			<h1><?php the_title(); ?></h1>

			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<div class="description"><?php the_content(); ?></div>
			<?php endwhile; endif; ?>

			<?php echo do_shortcode('[wp_bingo]'); ?>

		</div>

		<script src="<?php echo plugin_dir_url( dirname( __FILE__ ) ); ?>js/wp-bingo.min.js"></script>
		<?php do_action('wb-simple-footer') ?>
	</body>
</html>
