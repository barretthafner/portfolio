/**
 * 	Webpack production build configuration (minification, no watch)
 */

/**
 * 	Imports
 */
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import compiler, { config, styleLoader, extractedStyles } from './config';


// set compiler output stats
compiler.stats = {
	children: false,
	modules: false,
	version: false,
	excludeAssets: name => !name.match(/(js|css)$/)
};


/**
 * Loaders
 */

// StyleLoader
compiler.module.rules.push({ ...styleLoader, use: extractedStyles });


/**
 * 	Plugins
 */

// Include ExtractTextPlugin and set output filename
compiler.plugins.push(new ExtractTextPlugin({
	filename: config.name + '.[hash].css',
}));

// Uglify javascript code and don't export source maps
compiler.plugins.push(new UglifyJsPlugin({
	sourceMap: false,
	uglifyOptions: {
		comments: false,
		// ie8: true,
	}
}));

// Clean build folder
compiler.plugins.push(new CleanWebpackPlugin('build', { root: config.root }));

export default compiler;
