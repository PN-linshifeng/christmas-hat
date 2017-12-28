var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env) {
	return {
		entry: ['./src/js/index.js'], //babel-polyfill', 
		output: {
			filename: 'js/bundle.js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: "/static/html/hat/",
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
							name: "images/[name].[ext]",
							limit: 8192,
							// publicPath: '../'
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
		resolve: {
			extensions: ['.js', '.jsx'],
			modules: ["node_modules", "spritesmith-generated"],
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: "src/index.html",
			}),
			// new webpack.LoaderOptionsPlugin({
			// 	minimize: true,
			// 	debug: false,
			// }),
			new webpack.DefinePlugin({
				__DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false')),
				__DEV2__: JSON.stringify(process.env.NODE_ENV) === 'production',
			}),
			//压缩混淆
			new UglifyJSPlugin({
				uglifyOptions: {
					ie8: true,
					ecma: 5,
					mangle: {
						eval: true,
					}
				}
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					// drop_console: false,
				}
			}),

			//提取css样式插件
			new ExtractTextPlugin({
				filename: 'css/style.css',
				disable: false,
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
					cwd: path.resolve(__dirname, 'src/images/icon'),
					glob: '*.png'
				},
				target: {
					image: path.resolve(__dirname, 'dist/sprite/sprite.png'),
					css: path.resolve(__dirname, 'dist/sprite/sprite.css')
				},
				apiOptions: {
					cssImageRef: "sprite.png"
				}
			}),
		]
	}
}