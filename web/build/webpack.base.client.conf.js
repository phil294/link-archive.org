const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const css_loader = {
	loader: 'css-loader',
	options: {
		source_map: true,
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
					css_loader,
					'stylus-loader',
				],
			},
			{
				test: /\.css$/,
				use: css_loader,
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
