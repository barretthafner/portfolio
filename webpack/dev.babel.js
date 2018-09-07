/**
 * 	Webpack dev build configuration
 */


/**
 * 	Imports
 */
import webpack from 'webpack';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

import compiler, { config, styleLoader, bundledStyles } from './config';



// Creates source maps
// compiler.devtool = 'eval';
compiler.devtool = 'inline-source-map';

// Watch
compiler.watch = true;

// put hot loader and webpack-dev-server on entry before everything
compiler.entry.unshift(
	// activate HMR for React for react-hot-loader v3.0.0-beta.6
	'react-hot-loader/patch',
	// bundle the client for webpack-dev-server
	// and connect to the provided endpoint
	'webpack-dev-server/client?http://' + config.domain + ':3100',
	// bundle the client for hot reloading
	// only- means to only hot reload for successful updates
	'webpack/hot/only-dev-server'
);



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

// Add style loader
compiler.module.rules.push({ ...styleLoader, use: bundledStyles });



/**
 * 	Plugins
 */

// Lint styles
compiler.plugins.push(new StyleLintPlugin());

// Adds hot module relacement
compiler.plugins.push(new webpack.HotModuleReplacementPlugin());

// Shows a progress bar when building
compiler.plugins.push(new ProgressBarPlugin());

// Add named modules plugin
compiler.plugins.push(new webpack.NamedModulesPlugin());

// Add browser sync plugin
compiler.plugins.push(new BrowserSyncPlugin(
	{
		// browse to http://localhost:3100/ during development
		host: config.domain,
		port: 3000,
		// proxy the Webpack Dev Server endpoint
		// through BrowserSync
		proxy: 'http://' + config.domain + ':3100',
		// Don't minify the client-side JS
		minify: false
	},
	// plugin options
	{
		// prevent BrowserSync from reloading the page
		// and let Webpack Dev Server take care of this
		reload: false
	}
));




/**
 * Dev server config
 */

// configure webpack-dev-server
compiler.devServer = {
	hot: true,
	inline: true,
	// clientLogLevel: "none",
	contentBase: config.build,
	port: 3100,
	disableHostCheck: true,
	stats: {
		// Add asset Information
		assets: false,
		// Sort assets by a field
		assetsSort: 'field',
		// Add information about cached (not built) modules
		cached: false,
		// Add children information
		children: false,
		// Add chunk information (setting this to `false` allows for a less verbose output)
		chunks: false,
		// Add built modules information to chunk information
		chunkModules: false,
		// Add the origins of chunks and chunk merging info
		chunkOrigins: false,
		// Sort the chunks by a field
		chunksSort: 'field',
		// Context directory for request shortening
		context: config.src,
		// `webpack --colors` equivalent
		colors: true,
		// Add errors
		errors: true,
		// Add details to errors (like resolving log)
		errorDetails: true,
		// Add the hash of the compilation
		hash: false,
		// Add built modules information
		modules: false,
		// Sort the modules by a field
		modulesSort: 'field',
		// Add public path information
		publicPath: false,
		// Add information about the reasons why modules are included
		reasons: false,
		// Add the source code of modules
		source: false,
		// Add timing information
		timings: true,
		// Add webpack version information
		version: false,
		// Add warnings
		warnings: true
	}
};



export default compiler;
