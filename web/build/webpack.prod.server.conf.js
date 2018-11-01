const merge = require('webpack-merge');
const prodBaseWebpackConfig = require('./webpack.prod.base.conf');
const baseServerWebpackConfig = require('./webpack.base.server.conf');

module.exports = merge(prodBaseWebpackConfig, baseServerWebpackConfig);
