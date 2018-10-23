const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
	mode: 'production',
	devtool: 'source-map', // todo possible bundle size effect?
});
