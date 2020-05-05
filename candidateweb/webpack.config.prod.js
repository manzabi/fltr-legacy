const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ]
    },

    entry: [
        path.join(__dirname, 'src', 'index.jsx'),
        path.join(__dirname, 'src', 'sass', 'index.scss')
    ],
    
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.(woff|woff2)$/,
                use: 'file-loader'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                use: [
                    {loader: 'file-loader'}
                ]
            },
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader']),
            },
        ]
    },
    
    plugins: [
        new webpack.EnvironmentPlugin({
            ...require('./config/' + (process.env.ENV) + '.json')
        }),
        new ExtractTextPlugin({
            filename: 'bundle.min.css',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            title: 'Fluttr candidate site',
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                // remove warnings
                warnings: false,
                // Drop console statements
                drop_console: true
            },
            mangle: { except: ['$super', '$', 'exports', 'require'] }
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
    ],

    target: 'web'
};
