const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_ROOT: '"http://localhost:7070"',
    GOOGLE_CLIENT_ID: '"299730229518-qa5kouesun90urfmuuguf7p89rs38a39.apps.googleusercontent.com"',
    FACEBOOK_APP_ID: '"231287710788406"',
});
