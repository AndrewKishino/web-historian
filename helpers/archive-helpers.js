var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback, customFilePath){
  if (!customFilePath){
    customFilePath = this.paths.list;
  }

  fs.readFile(this.paths.list, 'utf8', function(err, data){
    if (err) {
      throw err;
    }
    callback(data.split('\n'));
  }.bind(this));
};

exports.isUrlInList = function(url, callback, customFilePath){

  var doesURLExist = false;
  var data = [];

  this.readListOfUrls(function(urls){
    data = urls;

    for (var i = 0; i < data.length; i++){
      if (data[i] === url) {
        doesURLExist = true;
      }
    }

    callback(doesURLExist);
  }, customFilePath);



  // console.log(doesURLExist + ": what appears in isUrlInList");

  

};

exports.addUrlToList = function(url, callback){


  fs.appendFile(this.paths.list, url + '\n', function(err){
    if (err) {
      throw err;
    }
    callback();
  });


  
};

exports.isUrlArchived = function(url, callback){
  var hasArchive = false;
  fs.exists(exports.paths.archivedSites + '/' + url, function(exists){
    if (exists) {
      hasArchive = true;
    }
    callback(hasArchive);
  })

  
};

exports.downloadUrls = function(arrayLink, callback){

  _.each(arrayLink, function(url){
    console.log(url);
    if (url !== ''){

      fs.open(this.paths.archivedSites + '/' + url, 'w+', function(err){
        if (err) {
          console.log(url);
          throw err;
        }
      });

      http.get('http://' + url, function (err, res) {
        if (err) {
          console.error(err);
          return;
        }

        fs.writeFile(this.paths.archivedSites + '/' + url, res.body, function(){
          if (err) {
            throw err;
          }
        });
      }.bind(this));


    }

  }.bind(this));

  callback();

};
