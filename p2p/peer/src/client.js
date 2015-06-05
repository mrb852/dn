var KascadeLoader = require('./kascade-loader.js');
var Kascade = require('./kascade.js');
var request = require('request');
var Peer = require('./peer.js');
var fs = require('fs');
var crypto = require('crypto');

var Client = module.exports = function(path) {
  var self = this;
  self.path = path;
  self.loader = new KascadeLoader(path);

  this.refreshData = function(cb) {
    self.loader.loadFiles(function(err, files) {
      self.files = files;
      return cb(err);
    });
  };

  this.updatePeers = function(onlyFeeders, tracker, progress, cb) {
    var trackerData = { "port": process.env.PORT, "progress": progress }
    var data = { url: tracker, formData: trackerData }

    request.post(data, function(err, res, body) {
      if(res.statusCode == 200) {
        var peerJSON = JSON.parse(body);
        var peers = peerJSON.map(function(p) {
          return new Peer(p);
        }).filter(function(p) {
          if (onlyFeeders) {
            if (p.isFeeder) { return p; }
          } else {
            return p;
          }
        });

        return cb(err, peers);
      }
    });
  }

  function checkBlock(file, block_index, block_size, hash, cb) {

    var buffer = '';
    var rs = fs.createReadStream(file, {
      start: block_index * block_size,
      end: block_index * block_size + block_size - 1
    });

    rs.on('error', cb);

    rs.on('readable', function() {
      console.log('reading');
      while ((chunk = rs.read()) != null) {
        buffer += chunk;
      }
      console.log('done reading');
    });

    rs.on('end', function() {
      h = crypto.createHash('md5').update(buffer).digest('hex');
      console.log(h);
      return cb(h === hash);
    });
  }

  this.checkBlocks = function(k, cb) {
    var file = self.path + '/' + k.model.filename;

    var buffs = null;
    blocks = k.model.blockhashes['4096'];
    var fileblocks = [];

    for (var i = 0; i < blocks.length; i++) {
      var hash = blocks[i];
      console.log('-- ', i)
      checkBlock(file, i, 4096, hash, function(hasBlock) {
        if (!hasBlock) {
          fileblocks.push(hash);
        }
      });
    };


  }

  this.downloadBlocks = function(kascade, blocks, cb) {
    return cb();
  };
}
