const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');

const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonRules = require('./webpack.common');

const APP_DIR = path.resolve(__dirname, 'src');
const entryJS = path.resolve(APP_DIR, 'index.jsx');
const entryCss = path.resolve(APP_DIR, 'sass/index.scss');
const publicEntry = path.resolve(__dirname, 'public');
const distFolder = path.resolve(__dirname, 'build');


const isProduction = false; //process.env.ENV === 'production';

const ENV = {...require(`./config/${process.env.ENV}.json`), VERSION: process.env.VERSION};


console.log(ENV);

module.exports = {
    entry: [entryJS, entryCss],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            ...commonRules,
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
        ]
    },
    resolve: {
        modules: [APP_DIR, 'node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
    },
    performance: {
        hints: 'warning', // enum    maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function(assetFilename) {
            // Function predicate that provides asset filenames
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    target: 'web',
    plugins: [
        new CopyPlugin([
            { from: `${publicEntry}/*`, to: distFolder, flatten: true},
        ]),
        new webpack.EnvironmentPlugin(ENV),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
        new HtmlWebpackPlugin({
            title: 'Fluttr home',
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html'
        }),
        new GenerateJsonPlugin('version.json', {
            test: 'true',
            version: process.env.VERSION || 'DEVELOPMENT_VERSION',
            environment: process.env.ENV
        })
    ]
};

if (isProduction) {
    module.exports.plugins.push(new UglifyJsPlugin({}));
}