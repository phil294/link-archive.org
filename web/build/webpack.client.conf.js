const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = merge(baseWebpackConfig, {
	entry: {
		app: [
			'./src/vue-entry-client.js',
			!isProduction ? 'webpack-hot-middleware/client' : null,
		].filter(_ => _),
	},
	output: {
		filename: isProduction ? baseWebpackConfig.output.filename : '[name].js',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		minimizer: isProduction ? [
			new UglifyJsPlugin({
				uglifyOptions: {
					warnings: false, // verbose/true/false(default) // todo
					mangle: {
						toplevel: true,
					},
					toplevel: true, // drops unused ariables and functions? todo
					// more: todo
				},
				sourceMap: true,
				parallel: true,
				cache: true,
				// extractComments: 'all', // todo
			}),
			new OptimizeCSSAssetsPlugin(),
		] : [],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new ManifestPlugin(),
		new VueSSRClientPlugin(),
		new webpack.DefinePlugin({
			'process.env.VUE_ENV': '"client"',
		}),
		// extract css into its own file
		isProduction ? new MiniCssExtractPlugin({
			// increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
			filename: 'common.[chunkhash].css',
		}) : null,
		!isProduction ? new webpack.HotModuleReplacementPlugin() : null,
		/* isProduction ? new HtmlWebpackPlugin({ // todo
			filename: utils.resolve('dist/index.html'),
			template: 'index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
		}) : null, */
		/* isProduction ? new CopyWebpackPlugin([ // todo ?
			{
				from: utils.resolve('static'),
				to: 'static',
				ignore: ['.*'],
			},
		]), */
	].filter(_ => _),
});

if (false) {
	webpackConfig.plugins.push(new BundleAnalyzerPlugin()); // todo
}

// service worker if prod swprecacheplugin todo

module.exports = webpackConfig;
