import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtraTextPlugin from 'extract-text-webpack-plugin';


export default {
    debug: true,
    devtool: 'source-map',
    noInfo: false,
    entry: {
        vender: path.resolve(__dirname, 'src/index'),
        main: path.resolve(__dirname, 'src/index')
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        //Generate an external css file with a hash in the filename
        new ExtraTextPlugin('[name].[contenthash].css'),

        // Hash the files using MD5 so that their names change when the content changes.
        new WebpackMd5Hash(),

        /*Use CommonChunkPlugin to create a seperate bundle
        of vender libraries so that they're cached separately.*/
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vender'
        }),
        // Create HTML file that includes reference to bundled js
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctypes: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true
                // Properties you define here are available in index.html
                //using HtmlWebpackPlugin.options.varName
                //Ie for track JS use => trackJSToken:'Include token here'
        }),
        // Eliminate duplicate packages when generating bundle
        new webpack.optimize.DedupePlugin(),
        //Minify js
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
            { test: /\.css$/, loader: ExtraTextPlugin.extract('css?sourceMap') }
        ]
    }
}