const merge = require('webpack-merge');
const dev_base_webpack_config = require('./webpack.dev.base.conf');
const base_server_webpack_config = require('./webpack.base.server.conf');

module.exports = merge(dev_base_webpack_config, base_server_webpack_config);
