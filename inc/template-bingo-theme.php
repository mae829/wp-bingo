<?php
	/**
	 * Template Name: Bingo - Theme
	 * Template Post Type: page
	 */
	get_header();
?>
		<div class="wrapper">

			<h1><?php the_title(); ?></h1>

			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<div class="description"><?php the_content(); ?></div>
			<?php endwhile; endif; ?>

			<?php echo do_shortcode('[wp_bingo]'); ?>

		</div>

<?php get_footer(); ?>
