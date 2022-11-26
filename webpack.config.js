const NpmDtsWebpackPlugin = require("npm-dts-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

/** @type {import("webpack").Configuration} */
module.exports = {
  entry: "./lib/index.ts",
  target: "node",
  mode: "production",
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }]
  },
  plugins: [new NpmDtsWebpackPlugin({ output: "./bundle/index.d.ts" })],
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  output: {
    filename: "index.js",
    libraryTarget: "umd",
    path: __dirname.concat("/bundle")
  },
  externals: [nodeExternals()]
};
