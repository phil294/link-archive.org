const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const utils = require('./utils');

const { error } = console;

const environment = [
	'API_ROOT',
	'FACEBOOK_APP_ID',
	'GOOGLE_CLIENT_ID',
].reduce((all, name) => {
	let e;
	if (!process.env[name]) {
		e = new Error(`environment variable ${name} is missing`);
	} else if (!process.env[name].match(/^(['"]).+\1$/)) {
		e = new Error(`environment variable ${name} needs to be quoted twice`);
	}
	if (e)
		error(e);
	return {
		...all,
		[name]: process.env[name],
	};
}, {});


const webpack_base_config = {
	output: {
		path: utils.resolve('dist'),
		filename: '[name].[chunkhash:6].js',
		publicPath: '/dist/',
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.coffee'],
		alias: {
			'@': utils.resolve('src'),
		},
	},
	module: {
		noParse: /es6-promise\.js$/, // "avoid webpack shimming process" todo ..?
		rules: [
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader',
						options: {
							// If you have problems debugging vue-files in devtools,
							// set this to false - it *may* help
							// https://vue-loader.vuejs.org/en/options.html#cachebusting
							// cacheBusting: true,
							// extractCSS: isProduction, // FIXME
							extractCSS: false,
						},
					},
					{
						loader: utils.resolve_custom_loader('vue-loader'),
					},
				],
			},
			{
				test: /\.coffee$/,
				use: [
					{
						loader: 'coffee-loader',
					},
					{
						loader: utils.resolve_custom_loader('coffee-loader'),
					},
				],
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.slm$/,
				loader: utils.resolve_custom_loader('slm-loader'),
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assets_path('img/[name].[hash:6].[ext]'),
				},
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assets_path('media/[name].[hash:6].[ext]'),
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assets_path('fonts/[name].[hash:6].[ext]'),
				},
			},
		],
	},
	node: {
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		// todo is this still relevant?
		setImmediate: false,
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			'process.env': environment,
		}),
	],
};

if (false) {
	webpack_base_config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpack_base_config;
