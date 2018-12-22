const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');

function injectHashesInLinks (content, path) {
  var template = content.toString('utf8');
  var now = Date.now();
  var cssInjected = "";

  var explodedTemplate = template.split('.css');

  for (var i = 0; i < explodedTemplate.length; i++) {
    cssInjected += explodedTemplate[i];

    // If this is the last chunk, then we are at the end of file and should not append
    if (explodedTemplate.length - i > 1) {
      cssInjected += ".css?v=" + now;
    }
  }

  var explodedTemplate = cssInjected.split('.js');
  var jsAndCssInjected = "";

  for (var i = 0; i < explodedTemplate.length; i++) {
    jsAndCssInjected += explodedTemplate[i];

    // If this is the last chunk, then we are at the end of file and should not append
    if (explodedTemplate.length - i > 1) {
      jsAndCssInjected += ".js?v=" + now;
    }
  }

  return jsAndCssInjected;
}

module.exports = {
  entry: {
    scheduleSummaryReportApp: './app/scheduleSummaryReport/scheduleSummaryReportApp.js',
    registrarReconciliationReportApp: './app/registrarReconciliationReport/registrarReconciliationReportApp.js',
    teachingCallResponseReportApp: './app/teachingCallResponseReport/teachingCallResponseReportApp.js',
    assignmentApp: './app/assignment/assignmentApp.js',
    adminApp: './app/admin/adminApp.js',
    budgetApp: './app/budget/budgetApp.js',
    courseApp: './app/course/courseApp.js',
    instructionalSupportApp: './app/instructionalSupport/instructionalSupportApp.js',
    summaryApp: './app/summary/summaryApp.js',
    schedulingApp: './app/scheduling/schedulingApp.js',
    supportCallApp: './app/supportCall/supportCallApp.js',
    supportAssignmentApp: './app/supportAssignment/supportAssignmentApp.js',
    sharedApp: './app/shared/sharedApp.js',
    teachingCallApp: './app/teachingCall/teachingCallApp.js',
    workgroupApp: './app/workgroup/workgroupApp.js',
    workloadSummaryReportApp: './app/workloadSummaryReport/workloadSummaryReportApp.js',
    reportsApp: './app/reports/reportsApp.js'
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [
      path.resolve(__dirname, "app"),
      "node_modules"
    ],
    alias: {
      Workgroup: path.resolve(__dirname, 'app/workgroup/'),
      TeachingCall: path.resolve(__dirname, 'app/teachingCall/')
    }
    
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
            }
          },
          "eslint-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'raw-loader' 
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // Copy html to output path (dist)
    new CopyWebpackPlugin([
      {
        from: 'app/**/*.html',
        to: '',
        flatten: true,
        transform: function (content, path) { return injectHashesInLinks(content, path); }
      }
    ]),
    // Copy json status to output path (dist)
    new CopyWebpackPlugin([
      { from: 'app/**/*.json', to: '', flatten: true }
    ]),
    // Copy css to output /css inside output path (dist)
    new CopyWebpackPlugin([
      { from: 'vendor/css/**/*.css', to: 'css', flatten: true },
      { from: 'node_modules/bootstrap/dist/css/**/*.css', to: 'css', flatten: true }
    ]),
    // Concat lib CSS
    new ConcatPlugin({
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
        './node_modules/jquery/dist/jquery.js',
        './node_modules/underscore/underscore-min.js',
        './node_modules/moment/min/moment.min.js',
        './app/shared/helpers/dates.js',
        './app/shared/helpers/object.js',
        './app/shared/helpers/sections.js',
        './app/shared/helpers/string.js',
        'course/constants.js',
        './node_modules/fullcalendar/dist/fullcalendar.js',
        './node_modules/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
        'selectize/dist/js/standalone/selectize.js'
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
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    inline: true,
    proxy: {
      "/*": {
        target: "http://localhost:9000",
        bypass: function(req, res, proxyOptions) {
          if ((req.url.indexOf("/reports") > -1 ) && (req.url != "/reports.html")) { return "/reports.html"; }
          if ((req.url.indexOf("/summary") > -1 ) && (req.url != "/summary.html")) { return "/summary.html"; }
          if ((req.url.indexOf("/admin") > -1 ) && (req.url != "/admin.html")) { return "/admin.html"; }
          if ((req.url.indexOf("/budget") > -1 ) && (req.url != "/budget.html")) { return "/budget.html"; }
          if ((req.url.indexOf("/workgroups") > -1 ) && (req.url != "/workgroup.html")) { return "/workgroup.html"; }
          if ((req.url.indexOf("/courses") > -1 ) && (req.url != "/course.html")) { return "/course.html"; }
          if ((req.url.indexOf("/assignments") > -1 ) && (req.url != "/assignment.html")) { return "/assignment.html"; }
          if ((req.url.indexOf("/instructionalSupport") > -1 ) && (req.url != "/instructionalSupport.html")) { return "/instructionalSupport.html"; }
          if ((req.url.indexOf("/teachingCalls") > -1 ) && (req.url != "/teachingCall.html")) { return "/teachingCall.html"; }
          if ((req.url.indexOf("/supportCalls") > -1 ) && (req.url != "/supportCall.html")) { return "/supportCall.html"; }
          if ((req.url.indexOf("/supportAssignments") > -1 ) && (req.url != "/supportAssignment.html")) { return "/supportAssignment.html"; }
          if ((req.url.indexOf("/scheduling") > -1 ) && (req.url != "/scheduling.html")) { return "/scheduling.html"; }
          if ((req.url.indexOf("/registrarReconciliationReport") > -1 ) && (req.url != "/registrarReconciliationReport.html")) { return "/registrarReconciliationReport.html"; }
          if ((req.url.indexOf("/teachingCallResponseReport") > -1 ) && (req.url != "/teachingCallResponseReport.html")) { return "/teachingCallResponseReport.html"; }
          if ((req.url.indexOf("/scheduleSummaryReport") > -1 ) && (req.url != "/scheduleSummaryReport.html")) { return "/scheduleSummaryReport.html"; }
          if ((req.url.indexOf("/workloadSummaryReport") > -1 ) && (req.url != "/workloadSummaryReport.html")) { return "/workloadSummaryReport.html"; }

          return req.url;
        }
      }
    }
  }
};
