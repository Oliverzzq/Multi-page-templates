const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// css style 压缩
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');


// 多页面配置···
const entry = require('./config-pages.js');

// 复用css loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader', {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: () => [require('postcss-preset-env')()]
        }
    }
]

// 配置环境变量  开发者模式--生产模式：production   开发模式：development  
process.env.NODE_ENV = "production";

module.exports = {
    entry,
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash:6].js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [...commonCssLoader, 'less-loader']
            },
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.(png|jpg|jpeg|gif)/,
                loader: 'url-loader',
                options: {
                    name: 'imgs/[hash:8].[ext]',
                    limit: 8 * 1024,
                    esModule: false
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: 3,
                                targets: {
                                    chrome: "58",
                                    ie: "9"
                                }
                            }
                        ]
                    ]
                }
            },
            {
                exclude: /\.(js|css|less|html|jpg|png|gif)/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new OptimizeCssAssetsWebpackPlugin()
    ].concat(pluginList(entry)),
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        watchOptions: {
            // 忽略文件
            ignored: /node_modules/
        },
        compress: true,
        port: 9898,
        open: true,
        hot: true,
        // 不要显示启动服务器日志信息
        clientLogLevel: 'none',
        // 除了一些基本启动信息以外，其他内容都不要显示
        quiet: true,
        // 服务器代理 
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    // 错误提示 
    devtool: "source-map",
    // 配置路径
    resolve: {
        extensions: ['.json', '.less', '.js', '.css'],
        alias: {
            vue: 'vue/dist/vue.js',
            "@": resolve('src'),
            "~": resolve('src/api'),
            "@img": resolve('src/imgs')
        }
    },
    stats: {
        all: undefined,
        assets: false
    }
}


function pluginList(entry) {

    function plus(key) {
        return {
            template: `./src/${key}.html`,
            filename: `${key}.html`,
            favicon: './favicon.ico',
            chunks: [key],
            // 压缩html代码
            //minify: {
            // 移除空格
            //    collapseWhitespace: true,
            // 移除注释
            //    removeComments: true
            //}
        }
    }

    let arr = [];
    for (let key in entry) {
        arr.push(new HtmlWebpackPlugin(plus(key)));
    }
    return arr;
}