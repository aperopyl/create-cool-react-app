const path = require("path");
const webpack = require("webpack");

const autoprefixer = require("autoprefixer");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");

const __DEV__ = process.env.NODE_ENV !== "production";

const USE_BUNDLE_ANALYZER = process.env.ANALYZE_BUNDLE === "1";

module.exports = {
    mode: __DEV__
        ? "development"
        : "production",
    devtool: __DEV__
        ? "inline-source-map"
        : undefined,
    entry: "./src/index.js",
    output: {
        publicPath: "/",
        filename: path.join("public", "build.js")
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            },
            {
                test: /\.(c|sc)ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: __DEV__
                            ? "style-loader"
                            : MiniCSSExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: !__DEV__
                                ? "[sha256:hash:base64:6]"
                                : "[local]__[name]-[sha256:hash:base64:8]"
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HTMLWebpackPlugin({
            inject: true,
            template: path.join(__dirname, "assets", "index.html")
        }),
        new MiniCSSExtractPlugin({
            filename: __DEV__
                ? "[name].css"
                : "[hash].css"
        }),
        USE_BUNDLE_ANALYZER ? new BundleAnalyzerPlugin() : () => {}
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    devServer: {
        hot: true,
        compress: true,
        contentBase: path.join(__dirname, "public"),
        historyApiFallback: true
    }
};
