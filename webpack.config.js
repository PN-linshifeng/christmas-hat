var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = function(env) {
	return {
		entry: './src/js/index.js',
		output: {
			filename: 'js/bundle.js',
			path: path.resolve(__dirname, 'dist'),
			// publicPath:"/assets",
		},
		module: {
			rules: [
				//样式
				{
					test: /\.(css|sass|scss)$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							'css-loader',
							'postcss-loader',
							'sass-loader',
						]
					})
				},
				//图片
				{
					test: /\.(jpg|png|gif|svg)$/,
					use: [{
						loader: 'url-loader',
						options: {
							name: "img/[name].[ext]",
							limit: 8192,
						}
					}]
				},
				//字体
				{
					test: /\.(woff|woff2|eot|otf|ttf)/,
					use: [{
						loader: 'url-loader',
						options: {
							name: "font/[name].[ext]",
							limit: 8192,
						}
					}]
				},
				//js
				{
					test: /\.(js|jsx)$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['es2015']
						}
					}
				}
			]
		},

		devServer: {
			publicPath: '/',
			port: 8080,
			contentBase: "./public", //本地服务器所加载的页面所在的目录
			historyApiFallback: true, //不跳转
			inline: true, //实时刷新
			hot: true // 使用热加载插件 HotModuleReplacementPlugin
		},
		resolve: {
			extensions: ['.js', '.jsx'],
			modules: ["node_modules", "spritesmith-generated"],
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: "src/index.html",
			}),
			new webpack.HotModuleReplacementPlugin(), // 启用 HMR
			// new webpack.optimize.UglifyJsPlugin({
			// 	__DEV2__: JSON.stringify(process.env.NODE_ENV) === 'production'
			// }),
			new webpack.DefinePlugin({
				__DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false')),
				__DEV2__: JSON.stringify(process.env.NODE_ENV) === 'production',
			}),

			//提取css样式插件
			new ExtractTextPlugin({
				filename: '[name].[chunkhash:8].css',
				disable: true,
			}),

			// 定义为生产环境，编译 React 时压缩到最小
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
				}
			}),
			//雪碧图
			new SpritesmithPlugin({
				src: {
					cwd: path.resolve(__dirname, 'app/images/icon'),
					glob: '*.png'
				},
				target: {
					image: path.resolve(__dirname, 'app/sprite/sprite.png'),
					css: path.resolve(__dirname, 'app/sprite/sprite.css')
				},
				apiOptions: {
					cssImageRef: "sprite.png"
				}
			}),
		]
	}
}