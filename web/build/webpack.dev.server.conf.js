const merge = require('webpack-merge');
const devBaseWebpackConfig = require('./webpack.dev.base.conf');
const baseServerWebpackConfig = require('./webpack.base.server.conf');

module.exports = merge(devBaseWebpackConfig, baseServerWebpackConfig);
