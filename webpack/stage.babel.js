/**
 * 	Webpack production build configuration (minification, no watch)
 */

/**
 * 	Imports
 */
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

import compiler, { config, styleLoader, extractedStyles } from './config';




// Watch
compiler.watch = true;

// Creates source maps
// compiler.devtool = 'eval';
compiler.devtool = 'inline-source-map';

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

// Eslint loader
compiler.module.rules.push({
	enforce: 'pre',
	test: /\.jsx?$/,
	include: config.src,
	use: {
		loader: 'eslint-loader'
	}
});

// Style loader
compiler.module.rules.push({ ...styleLoader, use: extractedStyles });



/**
 * 	Plugins
 */

// Include ExtractTextPlugin and set output filename
compiler.plugins.push(new ExtractTextPlugin({
	filename: config.name + '.[hash].css',
}));

// Add named modules plugin
compiler.plugins.push(new webpack.NamedModulesPlugin());

// Lint styles
compiler.plugins.push(new StyleLintPlugin());

// Clean build folder
compiler.plugins.push(new CleanWebpackPlugin('build', { root: config.root }));

export default compiler;
