const path = require('path');

const APP_DIR = path.resolve(__dirname, 'src');

module.exports =  [
    {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        include: APP_DIR,
        loader: 'babel-loader'
    },
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
        ]
    },
    {
        test: /\.(jpe?g|gif|png|svg|woff|eot|ttf|wav|mp3)$/,
        use: [
            {loader: 'file-loader'}
        ]
    }
];