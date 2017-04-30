var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "app");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");
var jquery = path.resolve(APP_PATH, 'jquery.js');
var moment = path.resolve(APP_PATH, 'comment.js');


module.exports = {
    entry: {
        app: path.resolve(APP_PATH, 'index.js'),
        //添加要打包在vendors里面的库
        vendors: [jquery, moment]
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            include: APP_PATH
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=1000000000000'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: APP_PATH,
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        //这个使用uglifyJs压缩你的js代码
        new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        //把入口文件里面的数组打包成verdors.js
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new htmlWebpackPlugin({
            title: 'Hello World app'
        })
    ]
}
