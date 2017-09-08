<?php
	/**
	 * Template Name: Bingo - Theme
	 * Template Post Type: page
	 */
	$post_id		= get_the_ID();
	$buzzwords		= get_post_meta( $post_id, '_bingo_buzzwords', true );

	get_header();
?>
		<div class="wrapper">

			<h1><?php the_title(); ?></h1>

			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<div class="description"><?php the_content(); ?></div>
			<?php endwhile; endif; ?>

			<div class="wp-bingo__wrapper">

				<?php

					if ( !empty( $buzzwords ) ) {

						$count_words    = count( $buzzwords );

						for ( $i = 0; $i < $count_words; $i++ ) {

							// FREE TILE
							if ( $i == 12 ) {
								echo '<div class="wp-bingo__item active">FREE</div>'."\n\t\t\t\t";
							}

							$word   = array_rand( $buzzwords );

							echo '<div class="wp-bingo__item">'. $buzzwords[$word] .'</div>'."\n\t\t\t\t";

							unset( $buzzwords[$word] );

						}

					} else {
						echo 'NEED BUZZWORDS TO BE POPULATED';
					}

				?>

			</div>

		</div>

<?php get_footer(); ?>
