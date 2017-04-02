var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "app");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");
//Template的文件夹路径
var TEM_PATH = path.resolve(ROOT_PATH, 'templates');

module.exports = {
    entry: {
        mobile: path.resolve(APP_PATH, 'mobile.js'),
        app: path.resolve(APP_PATH, 'index.js')
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].[hash].js'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost:5000',
                secure: false
            }
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: "pre",
            loader: "jshint-loader"
        }, {
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
    devtool: 'eval-source-map',
    plugins: [
        //创建了两个HtmlWebpackPlugin的实例，生成两个页面
        new htmlWebpackPlugin({
            title: 'Hello World app',
            template: path.resolve(TEM_PATH, 'index.html'),
            filename: 'index.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks: ['app'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new htmlWebpackPlugin({
            title: 'Hello Mobile app',
            template: path.resolve(TEM_PATH, 'mobile.html'),
            filename: 'mobile.html',
            chunks: ['mobile'],
            inject: 'body'
        })
    ]
}
