var Peer = module.exports = function(data) {
  var self = this;
  self.ip = data.ip;
  self.isFeeder = data.feeder;
  self.port = data.port;
  self.progress = data.progress;
  self.updated = data.updated;
}
