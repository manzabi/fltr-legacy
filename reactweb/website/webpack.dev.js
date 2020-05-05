const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

const commonRules = require('./webpack.common');


const APP_DIR = path.resolve(__dirname, 'src');
const entryJS = path.resolve(APP_DIR, 'index.jsx');
const entryCss = path.resolve(APP_DIR, 'sass/index.scss');
const publicEntry = path.resolve(__dirname, 'public');
const distFolder = path.resolve(__dirname, 'dist');

module.exports = {
    mode: 'development',
    entry: [entryJS, entryCss],
    output: {
        path: distFolder,
        filename: 'bundle.[hash].js',
        publicPath: '/'
    },
    module: {
        rules: [
            ...commonRules,
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            minimize: true
                        } // translates CSS into CommonJS
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ],
            }
        ]
    },
    resolve: {
        modules: [APP_DIR, 'node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
    },
    performance: {
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function(assetFilename) {
            // Function predicate that provides asset filenames
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    target: 'web',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8082,
        hot: true,
        historyApiFallback: true,
        disableHostCheck: true
    },
    plugins: [
        new CopyPlugin([
            { from: `${publicEntry}/*`, to: distFolder, flatten: true},
        ]),
        new HtmlWebpackPlugin({
            title: 'Fluttr home',
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html',
        }),
        new webpack.EnvironmentPlugin({
            ...require('./config/' + (process.env.ENV || 'development') + '.json' )
        })
    ]
};