var fs = require('fs');
var Kascade = require('./kascade.js');
var Peer = require('./peer.js');
var Q = require('q');
var request = require('request');

var Client = module.exports = function(path) {
  var self = this;
  this.path = path;

  this.loadKascadeFiles = function() {
    return Q.nfcall(fs.readdir, path)
    .then(function(files) {
      files = files.map(function(f) { return path + '/' + f; });
      return self.kascadeFiles = Kascade.loadFiles(files);
    });
  };

  this.loadPeers = function(data) {
    var json = JSON.parse(data);
    return json.map(function(jsonPeer) {
      return new Peer(jsonPeer);
    });
  };

  this.updateTracker = function(k) {
    var trackerData = { "port": process.env.PORT, "progress": k.progress }
    var data = { url: k.tracker, formData: trackerData }

    request(data, function(err, res, body) {
      if (res.statusCode == 200) {
        console.log('updated k.peer');
        k.peers = self.loadPeers(body);
      }
      return k;
    });
  }

  this.updateTrackers = function() {
    return self.kascadeFiles.filter(function(k) {
      k = self.updateTracker(k);
    });
  };

  this.beginDownload = function() {
    return Q.fcall(function() {
      console.log('begin download');
      self.kascadeFiles.forEach(function(k) {
        k.peers.forEach(function(p) {
          console.log('peer ' + p);
          if (p.isFeeder) {
            console.log(p.get({begin: 0, end: 1024}, k.filehash));
            return;
          }
        });
      });
    });
  }
}
