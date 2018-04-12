const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
    new CopyWebpackPlugin([
      { from: 'app/**/*.html', to: '', flatten: true },
      { from: 'app/**/*.css', to: '', flatten: true }
    ])
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
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /^\/admin/, to: 'admin.html' },
          { from: /^\/budget/, to: 'budget.html' },
          { from: /^\/workgroups/, to: 'workgroups.html' },
          { from: /^\/summary/, to: 'summary.html' },
          { from: /^\/courses/, to: 'courses.html' },
          { from: /^\/assignments/, to: 'assignments.html' },
          { from: /^\/instructionalSupport/, to: 'instructionalSupport.html' },
          { from: /^\/teachingCalls/, to: 'teachingCalls.html' },
          { from: /^\/supportCalls/, to: 'supportCalls.html' },
          { from: /^\/supportAssignments/, to: 'supportAssignments.html' },
          { from: /^\/scheduling/, to: 'scheduling.html' },
          { from: /^\/registrarReconciliationReport/, to: 'registrarReconciliationReport.html' },
          { from: /^\/scheduleSummaryReport/, to: 'scheduleSummaryReport.html' },
          { from: /^\/teachingCallResponseReport/, to: 'teachingCallResponseReport.html' }
        ]
      }
    }
  }
};
