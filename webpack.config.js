const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 多页面配置···
const entry = require('./config-pages.js');


// 配置环境变量  开发者模式--生产模式：production   开发模式：development  
// process.env.NODE_ENV = "development";

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
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: () => [
                            require('postcss-preset-env')()
                        ]
                    }
                }]
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
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css'
        })
    ].concat(pluginList(entry)),
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        compress: true,
        port: 9898,
        open: true
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
    }
}


function pluginList(entry) {

    function plus(key) {
        return {
            template: `./src/${key}.html`,
            filename: `${key}.html`,
            favicon: './favicon.ico',
            chunks: [key]
        }
    }

    let arr = [];
    for (let key in entry) {
        arr.push(new HtmlWebpackPlugin(plus(key)));
    }
    return arr;
}