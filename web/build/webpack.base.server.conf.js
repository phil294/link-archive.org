const webpack = require('webpack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = {
	entry: './src/vue-entry-server.coffee',
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
				test: /\.(css|styl(us)?)$/,
				loader: 'null-loader',
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
};
