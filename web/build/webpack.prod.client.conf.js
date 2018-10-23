const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseClientWebpackConfig = require('./webpack.base.client.conf');
const prodBaseWebpackConfig = require('./webpack.prod.base.conf');

module.exports = merge.smartStrategy({
	'module.rules.use': 'prepend',
})(prodBaseWebpackConfig, baseClientWebpackConfig, {
	optimization: {
		minimizer: [
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
		],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: MiniCssExtractPlugin.loader,
			},
		],
	},
	plugins: [
		// extract css into its own file
		new MiniCssExtractPlugin({
			// increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
			filename: 'common.[chunkhash].css',
		}),
		/* new HtmlWebpackPlugin({ // todo
			filename: utils.resolve('dist/index.html'),
			template: 'index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
		}), */
		/* new CopyWebpackPlugin([ // todo ?
			{
				from: utils.resolve('static'),
				to: 'static',
				ignore: ['.*'],
			},
		]), */
		// service worker swprecacheplugin todo
	],
});
