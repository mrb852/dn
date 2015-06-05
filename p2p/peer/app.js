'use strict';

var fs = require('fs');
var server = require('./src/server.js')
var Client = require('./src/client.js');

var client = new Client(process.env.HOME + '/desktop/kascade');

client.refreshData(function(err) {
  client.files.forEach(function(k) {
    client.updatePeers(true, k.model.tracker, k.progress, function(err, peers) {
      if (!err) {
        k.peers = peers;
        client.checkBlocks(k, function(err, blocks) {
          if (err) return console.log(err);
          return console.log(blocks);
        });
      } else {
        console.log(err);
      }
    });
  });
});
