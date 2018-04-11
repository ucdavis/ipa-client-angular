const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    vendor: [
      './src/index.js',
      './src/print.js'
    ],
    app: './src/index.js',
    print: './src/print.js',
    main: './src/index.js',
    walrus: './src/walrus.js',

  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/public/index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: 'walrus.html',
      template: 'src/public/walrus.html',
      chunks: ['walrus']
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9002,
    inline: true,
    historyApiFallback: {
      index: 'index.html',
      rewrites: [
        { from: /^\/walrus\/.*$/, to: 'walrus.html'},
        { from: /^.*$/, to: '/views/404.html' }
      ]
    }
  }
};
