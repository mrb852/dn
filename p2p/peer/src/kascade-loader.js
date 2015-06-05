'use strict';

var fs = require('fs');
var Kascade = require('./kascade.js');

var KascadeLoader = module.exports = function(path) {
  var self = this;
  this.path = path;

  this.loadFiles = function(cb) {
    return fs.readdir(self.path, function(err, files) {
      if (!err) {
        files = files.map(function(file) {
          return self.path + '/' + file
        })
        .filter(function(f) {return f.indexOf('.json') !== -1})
        .map(function(filename) {
          var kascade = new Kascade(filename);

          if (kascade.model !== null) {
            return kascade;
          }
        });

        return cb(null, files);
      }

      return cb(err, null);
    });
  };
}
