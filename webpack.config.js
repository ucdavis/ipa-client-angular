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
    // Copy json status to output path (dist)
    new CopyWebpackPlugin([
      { from: 'app/**/*.json', to: '', flatten: true }
    ]),
    // Copy css to output /css inside output path (dist)
    new CopyWebpackPlugin([
      { from: 'app/**/*.css', to: 'css', flatten: true },
      { from: 'vendor/css/**/*.css', to: 'css', flatten: true },
      { from: 'node_modules/bootstrap/dist/css/**/*.css', to: 'css', flatten: true }
    ]),
    // Concat lib CSS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'css/lib.css',
      filesToConcat: [
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/fullcalendar/dist/fullcalendar.css',
        './node_modules/ng-notify/dist/ng-notify.min.css',
        './node_modules/ui-select/dist/select.css',
        './node_modules/selectize/dist/css/selectize.default.css'
      ],
    }),
    // Concat shared CSS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'css/shared.css',
      filesToConcat: [
        './app/shared/**/*.css',
        './app/shared/directives/**/*.css'
      ],
    }),
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
    // Copy vendor JS
    new CopyWebpackPlugin([
      { from: 'clientConfig.js', to: 'js', flatten: true },
      { from: 'node_modules/bootstrap/dist/js/*', to: 'js', flatten: true },
      { from: 'node_modules/fuse.js/dist/fuse.min.js', to: 'js', flatten: true },
      { from: 'vendor/js/*', to: 'js', flatten: true },
    ]),
    // Concat lib JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/lib.js',
      filesToConcat: [
        './node_modules/angular/angular.js',
        './vendor/js/jquery-1.11.3.min.js',
        './vendor/js/jquery-ui.min.js',
        './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        './node_modules/ng-idle/angular-idle.min.js',
        './node_modules/angular-route/angular-route.min.js',
        './node_modules/toastr/build/toastr.min.js',
        './node_modules/angular-sanitize/angular-sanitize.min.js',
        './node_modules/microplugin/src/microplugin.js',
        './node_modules/selectize/dist/js/selectize.js',
        './node_modules/ui-select/dist/select.js'
      ],
    }),
    // Concat shared JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/sharedApp.js',
      filesToConcat: [
        './app/shared/sharedApp.js',
        './app/shared/helpers/**/*.js',
        './app/shared/entities/**/*.js',
        './app/shared/sharedReducers.js',
        './app/shared/controllers/**/*.js',
        './app/shared/directives/**/*.js',
        './app/shared/filters/**/*.js',
        './app/shared/services/**/*.js'
      ],
    }),
    // Configuration files, separated so that they can be excluded in JS testing
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/sharedConfig.js',
      filesToConcat: [
        './app/shared/exceptionHandler.js',
        './app/shared/sharedInterceptors.js'
      ],
    }),
    // Production Snippets from various 3rd party services
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/snippets.js',
      filesToConcat: [
        './vendor/js/userEcho.js',
        './vendor/js/googleAnalytics.js'
      ],
    }),
    // Concat admin JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/adminApp.js',
      filesToConcat: ['./app/admin/**/*.js'],
    }),
    // Concat workgroup JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/workgroupApp.js',
      filesToConcat: ['./app/workgroup/**/*.js'],
    }),
    // Concat summary JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/summaryApp.js',
      filesToConcat: [
        './app/summary/summaryApp.js',
        './app/summary/**/*.js'
      ],
    }),
    // Concat assignment JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/assignmentApp.js',
      filesToConcat: [
        './app/assignment/assignmentApp.js',
        './app/assignment/**/*.js'
      ],
    }),
    // Concat teachingCall JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/teachingCallApp.js',
      filesToConcat: [
        './app/teachingCall/teachingCallApp.js',
        './app/teachingCall/**/*.js'
      ],
    }),
    // Concat supportCall JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/supportCallApp.js',
      filesToConcat: [
        './app/supportCall/supportCallApp.js',
        './app/supportCall/**/*.js'
      ],
    }),
    // Concat scheduling JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/schedulingApp.js',
      filesToConcat: [
        './app/scheduling/schedulingApp.js',
        './app/scheduling/**/*.js'
      ],
    }),
    // Concat registrarReconciliationReport JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/registrarReconciliationReportApp.js',
      filesToConcat: [
        './app/registrarReconciliationReport/registrarReconciliationReportApp.js',
        './app/registrarReconciliationReport/**/*.js'
      ],
    }),
    // Concat scheduleSummaryReport JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/scheduleSummaryReportApp.js',
      filesToConcat: [
        './app/scheduleSummaryReport/scheduleSummaryReportApp.js',
        './app/scheduleSummaryReport/**/*.js'
      ],
    }),
    // Concat teachingCallResponseReport JS
    new ConcatPlugin({
      uglify: false,
      sourceMap: false,
      fileName: 'js/teachingCallResponseReportApp.js',
      filesToConcat: [
        './app/teachingCallResponseReport/teachingCallResponseReportApp.js',
        './app/teachingCallResponseReport/**/*.js'
      ],
    })
  ],
  /*
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          { loader:'ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, './app/**')) },
          { loader: 'html-loader' }
        ]
      }
    ]
  },
  */
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
