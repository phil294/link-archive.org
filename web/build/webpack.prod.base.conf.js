const merge = require('webpack-merge');
const base_webpack_config = require('./webpack.base.conf');

module.exports = merge(base_webpack_config, {
	mode: 'production',
	devtool: 'source-map', // todo possible bundle size effect?
});
