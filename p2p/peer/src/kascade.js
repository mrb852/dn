var fs = require('fs');

var kascadeProperties = ["blockhashes", "tracker", "filesize", "filehash", "filename"];

function loadFileAsObject(file) {
  if (file.indexOf('.json') !== -1) {

    var obj = JSON.parse(fs.readFileSync(file, 'utf8'));

    kascadeProperties.forEach(function(property) {
      if (!obj.hasOwnProperty(property))
        return null;
    });
    return obj;
  }
  return null;
}

function Kascade(file) {
  this.model = loadFileAsObject(file);
  this.name = 'kascade';
  this.progress = 0.0;
}

module.exports = Kascade;
