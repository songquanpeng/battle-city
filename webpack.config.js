const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    library: "Game",
  },
  plugins: [
    new HTMLPlugin({
      title: "Battle City",
      template: "./src/index.html",
    }),
    new CopyPlugin([
      { from: "./src/static", to: "./static" },
      {
        from: "./src/favicon.ico",
        to: "./",
      },
    ]),
  ],
};
