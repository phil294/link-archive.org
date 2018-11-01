const path = require('path');

exports.resolve = dir => path.join(__dirname, '..', dir);

exports.assetsPath = _path => path.posix.join('static', _path);
