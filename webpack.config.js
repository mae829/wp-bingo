import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader'
			}
		]
	},
	mode: 'production',
	devtool: 'source-map',
	output: {
		filename: '[name].min.js'
	},
	optimization: {
		minimizer: [ new UglifyJsPlugin( {
			sourceMap: true
		} ) ]
	},
	stats: {
		chunks: false,
		entrypoints: false
	}
};
