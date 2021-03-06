var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var reqUrl = req.url;
  var requestingIndex = false;

  if (req.method === "GET") {
    
    if (req.url === "/" || req.url === "/styles.css" || req.url === "/ajaxRequest.js" || req.url === "/loading.html"){
      httpHelp.serveAssets(res, req, archive.paths.siteAssets);
    } else {
      httpHelp.serveAssets(res, req, archive.paths.archivedSites); 
    }


  } else if (req.method === "POST") {

    var body = "";
    req.on("data", function(buffer){
      body += buffer;
    })

    req.on("end", function(){

      var statusCode = 200;

      try {
        body = JSON.parse(body);
      } catch(err) { 
        statusCode = 500;
      }

      archive.isUrlArchived(body["url"], function(isInArchive) {

        archive.isUrlInList(body["url"], function(UrlExists){
          if (!UrlExists && !isInArchive){
            statusCode = 302;
          }

          if (statusCode === 302) {
            res.writeHead(statusCode);

            archive.addUrlToList(body["url"], function(){
            });

            res.end();

            // archive.downloadUrls([body['url']]);

          } else {
            res.writeHead(statusCode);
            res.end();
          } 
        });
      });
    });
  }
};
