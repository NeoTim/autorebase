/* eslint-env node */

"use strict";

const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const pkgDir = require("pkg-dir");
const ZipPlugin = require("zip-webpack-plugin");

const pkgRoot = pkgDir.sync(__dirname);

module.exports = {
  entry: require.resolve("./src"),
  mode: "production",
  module: {
    rules: [
      {
        include: [
          path.dirname(
            require.resolve("@tibdex/shared-github-internals/src/app")
          ),
          path.join(pkgRoot, "src"),
        ],
        test: /\.js$/u,
        use: {
          loader: require.resolve("babel-loader"),
        },
      },
    ],
  },
  optimization: {
    // Keep the app code readable.
    minimize: false,
  },
  output: {
    filename: "GitHubWebhook/index.js",
    libraryTarget: "commonjs2",
    path: path.join(pkgRoot, "app"),
  },
  plugins: [
    new CopyWebpackPlugin(["src/wwwroot"]),
    new ZipPlugin({
      filename: path.format({ base: "autorebase", ext: ".zip" }),
    }),
  ],
  target: "node",
};
