const merge = require('webpack-merge');
const prod_base_webpack_config = require('./webpack.prod.base.conf');
const base_server_webpack_config = require('./webpack.base.server.conf');

module.exports = merge(prod_base_webpack_config, base_server_webpack_config);
