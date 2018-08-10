/* eslint-env node */

"use strict";

const path = require("path");

const pkgDir = require("pkg-dir");

const pkgRoot = pkgDir.sync(__dirname);

module.exports = {
  entry: require.resolve("./src"),
  mode: "production",
  module: {
    rules: [
      {
        include: [
          path.dirname(
            require.resolve("@tibdex/shared-github-internals/src/git")
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
    // Keep the lib code readable.
    minimize: false,
  },
  output: {
    filename: "index.js",
    libraryTarget: "commonjs2",
    path: path.join(pkgRoot, "lib"),
  },
  target: "node",
};
