/**
 * Gulp Configuration File
 *
 * 1. Edit the variables as per project requirements.
 * 2. Everything else is in the gulp file to keep it consistent across projects.
 */

// Define the default project configuration.
let projectConfig = {
	// Local project URL of your already running WordPress site. Could be something like wpgulp.local or localhost:3000 depending upon your local WordPress setup.
	serverConfig: {
		proxy: 'wpbingo.loc'
	}
};

/**
 * Check for local project config and overwrite it
 *
 * Create a file that exports your local configuration as an object to use a custom projectUrl and/or browsers list (if you really must).
 */
import fs from 'fs';

if ( fs.existsSync( './gulp.config.local.js' ) ) {
	const localConfig = require( './gulp.config.local.js' );

	projectConfig = { ...projectConfig, ...localConfig };
}

module.exports = projectConfig;
