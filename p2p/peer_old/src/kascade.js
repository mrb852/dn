var fs = require('fs');

var supportedFileFormats = ['json'];
var kascadeProperties = [
  "blockhashes", "tracker", "filesize", "filehash", "filename"
];

function Kascade(file) {
  if (!(this instanceof Kascade)) {
    return new Kascade(file);
  }

  var self = this;
  self.progress = 0.0;
  self.peers = [];

  getFileExtension(file, function(err, ext) {
    if (!err) {
      readAsObject(file, ext, function(err, obj) {
        self.__valid = !err;
        if (!err) {
          self.blockhashes = obj.blockhashes;
          self.tracker = obj.tracker;
          self.filesize = obj.filesize;
          self.filehash = obj.filehash;
          self.filename = obj.filename;
          return self;
        }
      });
    }
  });
}

function getFileExtension(file, cb) {
  for (var i = supportedFileFormats.length - 1; i >= 0; i--) {
    var format = supportedFileFormats[i];
    if (file.indexOf('.' + format) !== -1) {
      return cb(null, format);
    }
  };
  return cb(new Error('file format not supported'), null);
}

function readAsObject(kascadeFile, extension, cb) {
  if (extension == 'json') {
    var obj = JSON.parse(fs.readFileSync(kascadeFile, 'utf8'));
    for (var i = kascadeProperties.length - 1; i >= 0; i--) {
      var property = kascadeProperties[i];
      if (!obj.hasOwnProperty(property)) {
        return cb(new Error('File is not a valid json kascade file'), null);
      }
    };
    return cb(null, obj);
  }

  return cb(new Error('File format cannot be read because the file format is not supported'), null);
}

module.exports = Kascade;

module.exports.Create = function(file) {
  var obj = new Kascade(file);
  if (obj.__valid) { return obj; }
  return null;
};

module.exports.loadFiles = function(files) {
  return files.map(function(f) {
    return new Kascade.Create(f);
  }).filter(function(k) {
    return k.__valid;
  }).map(function(k) {
    delete k.__valid;
    return k;
  });
}
