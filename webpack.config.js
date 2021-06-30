const path = require('path');

module.exports = {
	entry: {
		'iframe_bridge':'./index.js',
		'host_bridge': './host.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd', // Flexible attach point - module.exports or var
		library: 'IFrameBridge' // Name of the exported var
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}
		]
	}
};