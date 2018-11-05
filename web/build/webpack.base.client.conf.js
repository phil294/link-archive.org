const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const cssLoader = {
	loader: 'css-loader',
	options: {
		sourceMap: true,
	},
};

module.exports = {
	entry: {
		app: [
			'./src/vue-entry-client.coffee',
		],
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	module: {
		rules: [
			{
				test: /\.styl(us)?$/,
				use: [
					cssLoader,
					'stylus-loader',
				],
			},
			{
				test: /\.css$/,
				use: [ // todo loader
					cssLoader,
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
	],
};
