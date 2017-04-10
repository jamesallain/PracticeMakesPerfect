var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
    entry: {
        app: path.resolve(APP_PATH, 'index.js')
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    //enable dev source map
    devtool: 'eval-source-map',
    //enable dev server
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true
    },
    //babel重要的loader在这里
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: APP_PATH
        }, {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'react router'
        })
    ]
}
