/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Watches files for changes in CSS or JS.
 *      5. Watches files for changes in PHP.
 *      6. Corrects the line endings.
 *      7. InjectCSS instead of browser page reload.
 *
 * Modded from https://github.com/ahmadawais/WPGulp
 */

/**
 * Load WPGulp Configuration.
 */
import config from './gulp.config.js';

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
import { dest, parallel, src, series, watch } from 'gulp';

// CSS related plugins.
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import sass from 'gulp-sass';
import styleLint from 'gulp-stylelint';

// JS related plugins.
import eslint from 'gulp-eslint';
import named from 'vinyl-named';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.js';

// Utility related plugins.
import browserSync from 'browser-sync';
import del from 'del';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';

const server = browserSync.create();

/**
 * Custom Error Handler.
 *
 * @param Mixed error
 */
const errorHandler = error => {
	notify.onError( {
		title: 'Gulp error in ' + error.plugin,
		message: error.toString(),
		sound: false
	} )( error );
};

/**
 * Task: `browsersync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 * @link http://www.browsersync.io/docs/options/
 *
 * BrowserSync options can be overwritten by gulp.config.local.js file.
 *
 * @param {Mixed} done Done.
 */
const browsersync = done => {
	const baseServerConfig = {
		open: false,
		injectChanges: true,
		watchEvents: [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ]
	};

	const serverConfig = { ...baseServerConfig, ...config.serverConfig };

	server.init( serverConfig );
	done();
};
browsersync.description = 'Load browser sync for local development.';

// Helper function to allow browser reload with Gulp 4.
const reload = done => {
	server.reload();
	done();
};

/**
 * Task: `sassLinter`.
 * This task does the following:
 *    1. Gets all our scss files
 *    2. Lints theme files to keep code up to standards and consistent
 */
export const sassLinter = () => {
	return src( 'src/scss/**/*.scss' )
		.pipe( plumber( errorHandler ) )
		.pipe( styleLint( {
			syntax: 'scss',
			reporters: [ {
				formatter: 'string',
				console: true
			} ]
		} ) );
};
sassLinter.description = 'Lint through all our SCSS files so our code is consistent across files.';

/**
 * Task: `css`.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates *.min.css
 *    7. Injects CSS or reloads the browser via server
 */
export const css = ( done ) => {
	del( './assets/css/*' );

	src( 'src/scss/*.scss', { sourcemaps: true } )
		.pipe( plumber( errorHandler ) )
		.pipe( sass( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( autoprefixer( {
			cascade: false
		} ) )
		.pipe( cleanCSS( {
			level: {
				2: {
					all: false,
					mergeIntoShorthands: true,
					mergeMedia: true
				}
			}
		} ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( dest( './assets/css', { sourcemaps: '.' } ) )
		.pipe( server.stream( {
			match: '**/*.css' // Sourcemap is in stream so match for actual CSS files
		} ) );

	done();
};
css.description = 'Compress, clean, etc our theme CSS files.';

/**
 * Task: `jsLinter`.
 * This task does the following:
 *    1. Gets all our theme files
 *    2. Lints theme files to keep code up to standards and consistent
 */
export const jsLinter = () => {
	return src( [
		'./src/js/**/*.js',
		'!src/js/vendor/**'
	] )
		.pipe( eslint() )
		.pipe( eslint.format() );
};
jsLinter.description = 'Linter for JavaScript';

/**
 * Task: `js`.
 *
 * This task does the following:
 *     1. Gets the source folder for JS files
 *     2. Concatenates all the files and generates *.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates *.min.js
 */
export const js = () => {
	// Clean up old files.
	del( './assets/js/*' );

	return src( './src/js/*.js' )
		.pipe( plumber( errorHandler ) )
		.pipe( named() )
		.pipe( webpack( webpackConfig ) )
		.pipe( dest( './assets/js/' ) )
		.pipe( server.reload( {
			match: '**/*.js', // Sourcemap is in stream so match for actual JS files
			stream: true
		} ) );
};
js.description = 'Run all JS compression and sourcemap work.';

export const styles  = series( sassLinter, css );
export const scripts = series( jsLinter, js );
export const build   = parallel( styles, scripts );

/**
 * Watch Tasks.
 */
export const dev = series( build, browsersync, () => {
	watch( './**/*.php', reload ); // Reload on PHP file changes.
	watch( './src/scss/**/*.scss', styles ); // Reload on SCSS file changes.
	watch( './src/js/**/*.js', scripts ); // Reload on JS file changes.
} );
dev.description = 'Start up our full dev workflow.';

export default dev;
