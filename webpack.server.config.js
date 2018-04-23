const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ConcatPlugin = require('webpack-concat-plugin');
const write = require('write');
const WebpackShellPlugin = require('webpack-shell-plugin');

function generateTemplateCache (content, templatePath, appName) {
  var explodedPath = templatePath.split('/');
  var templateName = explodedPath ? explodedPath[explodedPath.length -1] : null;
  templateName = templateName.split('.')[0];

  if (templateName == null) { return content; }

  var template = content.toString('utf8');
  var explodedTemplate = template.split(/\r?\n/);
  var stringifiedTemplate = "";

  for (var i = 0; i < explodedTemplate.length; i++) {
    stringifiedTemplate += explodedTemplate[i];
  }
  stringifiedTemplate = "'" + stringifiedTemplate.replace(/'/g, "\\'") + "'";

  var templateCache = appName + "App.run(function($templateCache) { $templateCache.put('" + templateName + ".html', " + stringifiedTemplate + ");});";

  writePath = __dirname + "/dist/" + "templates/" + appName + "/";
  write.sync(writePath + templateName + ".js", templateCache);

  return templateCache;
}

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
    // Create course templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/course/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "course"); }
      }
    ]),
    // Create assignment templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/assignment/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "assignment"); }
      }
    ]),
    // Create admin templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/admin/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "admin"); }
      }
    ]),
    // Create budget templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/budget/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "budget"); }
      }
    ]),
    // Create workgroup templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/workgroup/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "workgroup"); }
      }
    ]),
    // Create summary templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/summary/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "summary"); }
      }
    ]),
    // Create instructionalSupport templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/instructionalSupport/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "instructionalSupport"); }
      }
    ]),
    // Create teachingCall templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/teachingCall/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "teachingCall"); }
      }
    ]),
    // Create supportCall templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/supportCall/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "supportCall"); }
      }
    ]),
    // Create supportAssignment templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/supportAssignment/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "supportAssignment"); }
      }
    ]),
    // Create scheduling templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/scheduling/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "scheduling"); }
      }
    ]),
    // Create registrarReconciliationReport templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/registrarReconciliationReport/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "registrarReconciliationReport"); }
      }
    ]),
    // Create scheduleSummaryReport templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/scheduleSummaryReport/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "scheduleSummaryReport"); }
      }
    ]),
    // Create teachingCallResponseReport templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/teachingCallResponseReport/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "teachingCallResponseReport"); }
      }
    ]),
    // Create shared templateCaches
    new CopyWebpackPlugin([
      {
        from: 'app/shared/**/*.html',
        to: 'temp',
        flatten: true,
        transform: function (content, path) { return generateTemplateCache(content, path, "shared"); }
      }
    ]),
   // Create angular-ui templateCaches
   new CopyWebpackPlugin([
    {
      from: 'node_modules/angular-ui-bootstrap/template/**/*.html',
      to: 'temp',
      flatten: true,
      transform: function (content, path) { return generateTemplateCache(content, path, "angular-ui"); }
    }
  ]),
    new WebpackShellPlugin({onBuildExit:['webpack-dev-server --inline --progress --mode=development --config webpack.config.js']}),
  ]
};
