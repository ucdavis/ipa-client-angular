const fs = require('fs');
const path = require('path');
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// Concatenates files into one asset (webpack-concat-plugin doesn't support webpack 5)
class ConcatPlugin {
  constructor ({ fileName, filesToConcat }) {
    this.fileName = fileName;
    this.filesToConcat = filesToConcat;
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('ConcatPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'ConcatPlugin', stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        () => {
          var files = this.filesToConcat
            .flatMap((pattern) => pattern.includes('*') ? fs.globSync(pattern, { cwd: __dirname }).sort() : [pattern])
            .map((file) => path.resolve(__dirname, file));
          files = [...new Set(files)];
          files.forEach((file) => compilation.fileDependencies.add(file));
          var content = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
          compilation.emitAsset(this.fileName, new webpack.sources.RawSource(content));
        }
      );
    });
  }
}

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
    supportCallResponseReportApp: './app/supportCallResponseReport/supportCallResponseReportApp.js',
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
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            }
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        type: 'asset/source'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Copy html to output path (dist)
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'app/**/*.html',
          to: '[name][ext]',
          transform: function (content, path) { return injectHashesInLinks(content, path); }
        }
      ]
    }),
    // Copy json status to output path (dist)
    new CopyWebpackPlugin({
      patterns: [
        { from: 'app/**/*.json', to: '[name][ext]' }
      ]
    }),
    // Copy css to output /css inside output path (dist)
    new CopyWebpackPlugin({
      patterns: [
        { from: 'vendor/css/**/*.css', to: 'css/[name][ext]' },
        { from: 'node_modules/bootstrap/dist/css/**/*.css', to: 'css/[name][ext]' }
      ]
    }),
    // Concat lib CSS
    new ConcatPlugin({
      fileName: 'css/lib.css',
      filesToConcat: [
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/fullcalendar/dist/fullcalendar.css',
        './node_modules/ng-notify/dist/ng-notify.min.css',
        './node_modules/ui-select/dist/select.css',
        './node_modules/@selectize/selectize/dist/css/selectize.default.css',
        './node_modules/jquery-typeahead/dist/jquery.typeahead.min.css'
      ],
    }),
    // Concat shared CSS
    new ConcatPlugin({
      fileName: 'css/shared.css',
      filesToConcat: [
        './app/shared/**/*.css',
        './app/shared/directives/**/*.css'
      ],
    }),
    // Copy fonts to output /fonts inside output path (dist)
    new CopyWebpackPlugin({
      patterns: [
        { from: 'vendor/fonts/**/*', to: 'fonts/[name][ext]' },
        { from: 'node_modules/bootstrap/dist/fonts/**/*', to: 'fonts/[name][ext]' },
        { from: 'vendor/font/**/*', to: 'font/[name][ext]' }
      ]
    }),
    // Copy assets to output /fonts inside output path (dist)
    new CopyWebpackPlugin({
      patterns: [
        { from: 'app/assets/images/*', to: 'images/[name][ext]' },
        { from: 'app/assets/images/colorpicker/*', to: 'images/colorpicker/[name][ext]' }
      ]
    }),
    // Copy vendor JS
    new CopyWebpackPlugin({
      patterns: [
        { from: 'clientConfig.js', to: 'js/[name][ext]' },
        { from: 'node_modules/bootstrap/dist/js/*', to: 'js/[name][ext]' },
        { from: 'node_modules/fuse.js/dist/fuse.min.js', to: 'js/[name][ext]' },
        { from: 'node_modules/jquery-typeahead/dist/jquery.typeahead.min.js', to: 'js/[name][ext]' },
        { from: 'vendor/js/*', to: 'js/[name][ext]' },
      ]
    }),
    // Concat lib JS
    new ConcatPlugin({
      fileName: 'js/lib.js',
      filesToConcat: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/jquery-typeahead/dist/jquery.typeahead.min.js',
        './node_modules/underscore/underscore-min.js',
        './node_modules/moment/min/moment.min.js',
        './app/shared/helpers/string_prototypes.js',
        './node_modules/fullcalendar/dist/fullcalendar.js',
        './node_modules/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
        './node_modules/@selectize/selectize/dist/js/selectize.js'
      ],
    }),
    // Production Snippets from various 3rd party services
    new ConcatPlugin({
      fileName: 'js/snippets.js',
      filesToConcat: ['./vendor/js/googleAnalytics.js'],
    }),
    new ESLintPlugin()
  ],
  devServer: {
    host: 'localhost',
    client: {
      overlay: false,
      progress: true
    },
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
    historyApiFallback: {
      rewrites: [
        { from: /^\/reports(\/|$)/, to: '/reports.html' },
        { from: /^\/summary(\/|$)/, to: '/summary.html' },
        { from: /^\/admin(\/|$)/, to: '/admin.html' },
        { from: /^\/budget(\/|$)/, to: '/budget.html' },
        { from: /^\/workgroups(\/|$)/, to: '/workgroup.html' },
        { from: /^\/courses(\/|$)/, to: '/course.html' },
        { from: /^\/assignments(\/|$)/, to: '/assignment.html' },
        { from: /^\/instructionalSupport(\/|$)/, to: '/instructionalSupport.html' },
        { from: /^\/teachingCalls(\/|$)/, to: '/teachingCall.html' },
        { from: /^\/supportCalls(\/|$)/, to: '/supportCall.html' },
        { from: /^\/supportAssignments(\/|$)/, to: '/supportAssignment.html' },
        { from: /^\/scheduling(\/|$)/, to: '/scheduling.html' },
        { from: /^\/registrarReconciliationReport(\/|$)/, to: '/registrarReconciliationReport.html' },
        { from: /^\/teachingCallResponseReport(\/|$)/, to: '/teachingCallResponseReport.html' },
        { from: /^\/scheduleSummaryReport(\/|$)/, to: '/scheduleSummaryReport.html' },
        { from: /^\/supportCallResponseReport(\/|$)/, to: '/supportCallResponseReport.html' },
        { from: /^\/workloadSummaryReport(\/|$)/, to: '/workloadSummaryReport.html' },
        // Leave other paths unchanged so unknown routes still 404 instead of falling back to index.html
        { from: /./, to: (context) => context.parsedUrl.pathname }
      ]
    }
  }
};
