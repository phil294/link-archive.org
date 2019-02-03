const merge = require('webpack-merge');
const base_webpack_config = require('./webpack.base.conf');

module.exports = merge(base_webpack_config, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	performance: {
		hints: false,
	},
});
