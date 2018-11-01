const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
	entry: {
		app: [
			'./src/vue-entry-client.js',
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
				test: /\.css$/,
				use: [
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
	],
};
