const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { devDependencies } = require("./package.json");
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');

const isProd = process.env.NODE_ENV === "production";
console.log(path.resolve(__dirname, '..', 'node_modules', 'svelte'))
const config = {
    mode: isProd ? "production" : "development",
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    resolve: {
        alias: {
            svelte: path.resolve(__dirname, '..', '..', 'node_modules', 'svelte')
        },
        mainFields: ['svelte', 'browser', 'module', 'main'],
        extensions: [".js", ".ts", ".svelte"],
        conditionNames: ['svelte'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        preprocess: sveltePreprocess(),
                    },
                }
            },
            {
                // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
                test: /\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            filename: "index.html",
            inject: "body",
        }),
        new ModuleFederationPlugin({
            name: "shell",
            remotes: {
                header: "header@/header/remoteEntry.js",
            },
            shared: {
                ...devDependencies,
                svelte: {
                    singleton: true,
                    requiredVersion: devDependencies["svelte"],
                },
            },
        }),
    ],
};


if (isProd) {
    config.optimization = {
        minimizer: [new TerserWebpackPlugin()],
    };
} else {
    config.devServer = {
        port: 9000,
        hot: true,
        compress: true,
        proxy: {
            '/header': {
                target: 'http://localhost:9001',
                pathRewrite: { '^/header': '' },
            }
        }
    };
}

module.exports = config;