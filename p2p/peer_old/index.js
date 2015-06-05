var express = require('express');
var request = require('request');
var Kascade = require('./src/kascade');
var app = express();
var Client = require('./src/client');
var findPort = require('find-port');
var Q = require('q');

var client = new Client(process.env.HOME + '/desktop/kaskade');
process.env.PORT = 3000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(process.env.PORT, function () {
  console.log('running at localhost:' + process.env.PORT);
});

Q.fcall(client.loadKascadeFiles)
.then(client.updateTrackers)
.then(client.beginDownload)
.fail(function(err) {
  console.log(err);
}).done(function() {

});

// Client.Create(process.env.HOME + '/desktop/kaskade', function(err, client) {
//   if (!err) {
//     client.loadKascadeFiles();
//     client.updateTrackers();
//   }
//   for (var i = client.kascadeFiles.length - 1; i >= 0; i--) {
//     var kascadeFile = client.kascadeFiles[i];
//     var progress = kascadeFile.progress;
//     if (progress > 0.0) {
//       var trackerData = { "port": process.env.PORT, "progress": progress }
//       var data = { url: kascadeFile.tracker, formData: trackerData }
//       request.post(data, function(err, res, body) {
//         if (!err && res.statusCode == 200) {
//           console.log(body);
//         }
//       });
//     }
//   };
// });

