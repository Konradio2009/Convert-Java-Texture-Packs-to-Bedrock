const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PACKAGE = require("./package");
const TerserJSPlugin = require("terser-webpack-plugin");

const isDebug = "production";

module.exports = {
	devtool: false,
	stats: {
		children: false
	},
	entry: {
		index: "./src/js/index.mjs"
	},
	mode: (isDebug ? "development" : "production"),
	module: {
		rules: [{
			test: /\.less$/,
			use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
		},
						{
							test: /worker\.js$/,
							loader: "worker-loader",
							options: {
								name: "[name].[contenthash].js"
							}
						}, {
							test: /\.(jpe?g|png|gif|svg)$/i,
							loader: 'file-loader',
							options: {
								name: '[name].[ext]'
							}
						},
						]
	},
	optimization: {
		minimizer: (isDebug ? [] : [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin()]),
	},
	output: {
		filename: "[name].[contenthash].js",
		path: __dirname + "/build",
		libraryTarget: "umd",
		globalObject: "this"
	},
	resolve: {
		alias: {
			fs: __dirname + "/src/js/browserify/fs",
			jszip: __dirname + "/node_modules/jszip/lib/index.js",
			path: __dirname + "/src/js/browserify/path"
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			minify: (isDebug ? false : {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}),
			template: "./src/html/index.html"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
		}),
		new FaviconsWebpackPlugin({
			devMode: "webapp",
			logo: "./src/img/icon.svg",
			mode: "webapp",
			favicons: {
				appDescription: PACKAGE.description,
				appName: PACKAGE.productName,
				appShortName: PACKAGE.productName, 
				appleStatusBarStyle: "black",
				background: "#FFFFFF",
				developerNamw: PACKAGE.author,
				developerURL: null,
				dir: null,
				display: "standalone",
				icons: {
					android: true,
					appleIcon: true,
					favIcons: true,
					appleStartup: false,
					coast: false,
					firefox: false,
					windows: false,
					yandex: false
				},
				lang: null,
				manifesRelativePaths: true,
				orientation: "any",
				path: "./",
				start_url: "..",
				theme_color: "#795548",
				version: PACKAGE.version
			},
			prefix: "webapp",
			publicPath: "./"
		}),
		...(!isDebug ? [new OfflinePlugin({
			ServiceWorker: {
				events: true
			},
			version: PACKAGE.version
		})] : ())
		],
	target: "web"
};
