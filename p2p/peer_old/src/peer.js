var Q = require('q');
var request = require('request');

var Peer = module.exports = function(data) {
  var self = this;
  self.ip = data.ip;
  self.isFeeder = data.feeder;
  self.port = data.port;
  self.progress = data.progress;
  self.updated = data.updated;

  this.get = function(filehash, range) {
    var options = {
      url: self.ip + ':' + self.port + '/' + filehash,
      headers: {
        'Range': range.begin + '-' + range.end
      }
    }

    Q.fcall(function() {
      request(options, function(err, res, body) {
        if (res.statusCode == 206 && !err) {
          return body;
        }
        return Error('error downloading chunk')
      });
    })
  }
}
