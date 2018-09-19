const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const safeParser = require('postcss-safe-parser');
const baseWebpackConfig = require('./webpack.base.conf');
const utils = require('./utils');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader', // should be depending on the bundle
                ],
            },
        ],
    },
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    output: {
        path: utils.resolve('dist'),
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            parallel: true, // needed?
            cache: true, // ?
        }),
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: 'stylelelelel.css', // in extracttextplugin, it was utils.assetsPath('css/[name].[md5:contenthash:hex:20].css'),
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: { parser: safeParser, map: { inline: false } },
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: utils.resolve('dist/index.html'), // Template for index.html
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                // more options: https://github.com/kangax/html-minifier#options-quick-reference todo
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: utils.resolve('static'),
                to: 'static',
                ignore: ['.*'], // todo ??
            },
        ]),
    ],
});

if (false) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
