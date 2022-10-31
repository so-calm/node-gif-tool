const BundleDeclarationsWebpackPlugin = require("bundle-declarations-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./lib/index.ts",
  target: "node",
  mode: "production",
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }]
  },
  plugins: [
    new BundleDeclarationsWebpackPlugin({
      entry: "./lib/index.ts",
      outFile: "index.d.ts"
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "target/release/gif_ffi.dll", to: "." }]
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // fallback: {
    //   os: false,
    //   path: false,
    //   buffer: false,
    //   util: false,
    //   assert: false
    // }
  },
  output: {
    filename: "index.js",
    libraryTarget: "umd",
    path: __dirname.concat("/bundle")
  },
  externals: [nodeExternals()]
};
