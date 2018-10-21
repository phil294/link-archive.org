const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

const webpackConfig = merge(baseWebpackConfig, {
	entry: './src/vue-entry-server.js',
	target: 'node',
	devtool: 'source-map',
	output: {
		libraryTarget: 'commonjs2',
		filename: 'server-bundle.js',
	},
	externals: {
		whitelist: /\.css$/,
		// objekc.keys(require(..../package.json(.dependencies))) <- todo?
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: 'css-loader/locals',
			},
		],
	},
	plugins: [
		new VueSSRServerPlugin(),
		new webpack.DefinePlugin({
			'process.env.VUE_ENV': '"server"',
			window: undefined, // todo
		}),
	],
});

module.exports = webpackConfig;
