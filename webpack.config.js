const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ConcatPlugin = require('webpack-concat-plugin');

module.exports = {
  entry: {
    app: './app/admin/adminApp.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // Purge contents of dist first
    new CleanWebpackPlugin(['dist']),
    // Copy html to output path (dist)
    new CopyWebpackPlugin([
      { from: 'app/**/*.html', to: '', flatten: true }
    ]),
    // Copy css to output /css inside output path (dist)
    new CopyWebpackPlugin([
      { from: 'app/**/*.css', to: 'css', flatten: true },
      { from: 'vendor/css/**/*.css', to: 'css', flatten: true },
      { from: 'node_modules/bootstrap/dist/css/**/*.css', to: 'css', flatten: true }
    ]),
    // Copy fonts to output /fonts inside output path (dist)
    new CopyWebpackPlugin([
      { from: 'vendor/fonts/**/*', to: 'fonts', flatten: true },
      { from: 'node_modules/bootstrap/dist/fonts/**/*', to: 'fonts', flatten: true },
      { from: 'vendor/font/**/*', to: 'font', flatten: true }
    ]),
    // Copy assets to output /fonts inside output path (dist)
    new CopyWebpackPlugin([
    { from: 'app/assets/images/*', to: 'images', flatten: true },
    { from: 'app/assets/images/colorpicker/*', to: 'images/colorpicker', flatten: true }
  ]),
    // Concat admin JS
    new ConcatPlugin({
      uglify: true,
      sourceMap: false,
      fileName: 'admin.[hash:8].js',
      filesToConcat: ['./app/admin/**/*.js'],
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
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
