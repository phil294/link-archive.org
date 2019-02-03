const merge = require('webpack-merge');
const webpack = require('webpack');
const base_client_webpack_config = require('./webpack.base.client.conf');
const dev_base_webpack_config = require('./webpack.dev.base.conf');

module.exports = merge.smartStrategy({
	'module.rules.use': 'prepend',
})(dev_base_webpack_config, base_client_webpack_config, {
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
