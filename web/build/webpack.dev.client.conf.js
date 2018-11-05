const merge = require('webpack-merge');
const webpack = require('webpack');
const baseClientWebpackConfig = require('./webpack.base.client.conf');
const devBaseWebpackConfig = require('./webpack.dev.base.conf');

module.exports = merge.smartStrategy({
	'module.rules.use': 'prepend',
})(devBaseWebpackConfig, baseClientWebpackConfig, {
	entry: {
		app: [
			'webpack-hot-middleware/client',
		],
	},
	output: {
		filename: '[name].js',
	},
	module: {
		rules: [/\.css$/, /\.styl(us)?$/]
			.map(test => ({
				test,
				use: 'vue-style-loader',
			})),
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
});
