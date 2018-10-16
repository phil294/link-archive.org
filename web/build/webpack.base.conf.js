const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const utils = require('./utils');

const environment = [
    'API_ROOT',
    'FACEBOOK_APP_ID',
    'GOOGLE_CLIENT_ID',
].reduce((all, name) => {
    if (false) {}
    /*
    if (!process.env[name]) {
        throw new Error(`environment variable ${name} is missing`);
    }
    if (!process.env[name].match(/^(['"]).+\1$/)) {
        throw new Error(`environment variable ${name} needs to be quoted twice`);
    }
    */
    return {
        ...all,
        [name]: process.env[name],
    };
}, {});

module.exports = {
    context: utils.resolve('/'),
    entry: {
        app: './src/vue-main.js',
    },
    output: {
        path: utils.resolve('dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': utils.resolve('src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // If you have problems debugging vue-files in devtools,
                    // set this to false - it *may* help
                    // https://vue-loader.vuejs.org/en/options.html#cachebusting
                    cacheBusting: true,
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [utils.resolve('src'), utils.resolve('node_modules/webpack-dev-server/client')],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
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
        new CleanWebpackPlugin([utils.resolve('dist'), 'static']),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env': environment,
        }),
    ],
};
