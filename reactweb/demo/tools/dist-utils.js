var fs = require('fs');
var ncp = require('ncp');
var pug = require('pug');
var path = require('path');
var rimraf = require('rimraf');

var publicPath = path.join(process.cwd(), 'public');
var distPath = path.join(process.cwd(), 'dist');
var indexPath = path.join(process.cwd(), 'views', 'index.pug');
var destIndexPath = path.join(distPath, 'index.html');
var destIndexRTLPath = path.join(distPath, 'index-rtl.html');

module.exports = function(callback) {
  rimraf(distPath, function() {
    fs.mkdirSync(distPath);

    ncp(publicPath, distPath, function(err) {
      if (err) {
        return console.error(err);
      }

      var fn = pug.compileFile(indexPath, {
        pretty: true
      });

      var timestamp = Math.floor(Date.now() / 1000);

      // create html for the index page (page where we inject everything
      var html = fn({
        app_scripts: "\n    <script src='/js/plugins.js?v="+ timestamp + "'></script>\n    <script src='/js/app.js?v="+ timestamp + "'></script>",
        app_stylesheets: "\n    <link rel='stylesheet' href='/css/main.css?v=" + timestamp + "' />"
      });

      var htmlRTL = fn({
        app_scripts: "\n    <script src='/js/plugins.js?v=\"+ timestamp + \"'></script>\n    <script src='/js/app.js?v="+ timestamp + "'></script>",
        app_stylesheets: "\n    <link rel='stylesheet' href='/css/main-rtl.css?v="+ timestamp + "' />"
      });

      fs.writeFileSync(destIndexPath, html + '\n');
      fs.writeFileSync(destIndexRTLPath, htmlRTL + '\n');

      console.log('Done!');

      if (callback) callback();
    })
  });
};
