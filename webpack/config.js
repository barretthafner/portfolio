/**
 * 	Webpack base config file, settings used across all build environments
 */

/**
 * 	Imports
 */
import webpack from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { env, domain, name, siteTitle, NODE_ENV_DEVELOPMENT } from '../config';

console.log('Webpack starting in environment:', env);

/**
 * 	Webpack configurations
 */
export const config = {
	build: path.resolve(__dirname, '../build'),
	domain,
	entry: path.resolve(__dirname, '../src/client'),
	name,
	root: path.resolve(__dirname, '../'),
	src: path.resolve(__dirname, '../src'),
	utils: path.resolve(__dirname, '../utils'),
};

/**
 * 	Default compiler
 */
export default {
	mode: (env === NODE_ENV_DEVELOPMENT ? 'development' : 'production'),
	context: config.root,
	entry: [ config.entry ], // need an array to use unshift in dev config
	output: {
		filename: config.name + '.[hash].js',
		path: config.build,
		publicPath: '/'
	},

	// Resolve specific paths for imports
	resolve: {
		alias: {
			'configure-store$': path.resolve(config.entry, 'state/store/configure-store.' + (env === NODE_ENV_DEVELOPMENT ? 'dev' : 'prod')),
			'utils': config.utils
		}
	},

	// No scss loader here, because we are using ExtractTextPlugin to output a static css file in 'stage' and 'production'
	module: {
		rules: [
			// loads client javascript & jsx
			{
				test: /\.jsx?$/,
				include: [
					config.src,
					config.utils,
					path.resolve(__dirname, '../config.js')
				],
				use: {
					loader: 'babel-loader'
				}
			},
			// Loads html
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader'
				}
			},
			// copies client cursors, icons, images, and fonts
			{
				test: /\.(cur|ico|png|jpe?g|gif|woff2?|otf|ttf|eot|mp3)$/,
				include: [ config.src ],
				use: {
					loader: 'file-loader',
					options: {
						name: 'static/[name].[sha512:hash:base64:8].[ext]'
					}
				}
			},
			// load svgs inline as react components, optimizes with svgo
			{
				test: /\.svg$/,
				include: [ config.src ],
				use: [
					'babel-loader',
					{
						loader: 'react-svg-loader',
						query: {
							svgo: {
								pretty: true,
								plugins: [
									{ cleanupAttrs: true },
									{ cleanUpEnableBackground: true },
									{ cleanupIDs: false },
									{ cleanupNumericValues: true },
									{ collapseGroups: true },
									{ convertColors: true },
									{ convertPathData: false },
									{ convertShapeToPath: true },
									{ convertStyleToAttrs: true },
									{ convertTransform: true },
									{ mergePaths: true },
									{ moveElemsAttrsToGroup: true },
									{ moveGroupAttrsToElems: true },
									// { removeAttrs: { attrs: '(stroke|fill)' } },
									{ removeComments: true },
									{ removeDesc: true },
									{ removeDimensions: true },
									{ removeDoctype: true },
									{ removeEditorsNSData: true },
									{ removeEmptyAttrs: true },
									{ removeEmptyContainers: true },
									{ removeEmptyText: true },
									{ removeHiddenElems: true },
									{ removeMetadata: true },
									{ removeNonInheritableGroupAttrs: true },
									{ removeRasterImages: false },
									{ removeStyleElement: true },
									{ removeTitle: true },
									{ removeUnknownsAndDefaults: true },
									{ removeUnusedNS: true },
									{ removeUselessDefs: true },
									{ removeUselessStrokeAndFill: true },
									{ removeViewBox: false },
									{ removeXMLProcInst: true },
									{ sortAttrs: true },
									{ transformsWithOnePath: false },
								]
							}
						}
					}
				]
			}
		]
	},

	plugins: [
		// Copies everything in the static directory to one directory up from publicPath directory
		new CopyWebpackPlugin([{
			context: config.src,
			from: './static/**/*',
			to: config.build
		}]),

		// Takes our HTML file and sticks things in it, like the bundle
		new HtmlWebpackPlugin({
			content: {
				domain,
				siteTitle,
				name
			},
			inject: 'head',
			template: path.resolve(config.src, 'index.ejs')
		}),

		// set environment
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(env)
			}
		})
	]
};




/**
 * 	Add scss and css loader to module.rules
 * 	We do this later to use ExtractTextPlugin
 * 		- Loads css and scss
 * 		- Loads normalize.css
 * 		- Autoprefixes
 * 		- Packages the styles into the javascript bundle
 */

// Add styles in with javascript
export const bundledStyles = [
	{
		loader: 'style-loader'
	},
	{
		loader: 'css-loader',
		options: {
			importLoaders: 2,
			minimize: true
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			plugins: () => [
				require('postcss-import')(),
				require('postcss-cssnext')(), // autoprefixer is included in cssnext
			]
		}
	},
	{
		loader: 'sass-loader'
	}
];

// Create an seperate file for styles
export const extractedStyles = ExtractTextPlugin.extract({
	use: [
		{
			loader: 'css-loader',
			options: {
				importLoaders: 2,
				minimize: true
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: () => [
					require('postcss-import')(),
					require('postcss-cssnext')() // autoprefixer is included in cssnext
				]
			}
		},
		{
			loader: 'sass-loader'
		}
	]
});

// Generic style loader
export const styleLoader = {
	test: /\.s?css$/,
	include: [
		config.src,
		path.resolve(__dirname, '../node_modules/normalize.css')
	],
	use: bundledStyles
};
