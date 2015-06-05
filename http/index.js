var fs = require('fs');
var client = require('./src/http-client');
var Measure = require('./src/measure');

var measure = new Measure();

var argc = process.argv.length;
if (argc < 3) {
  console.log('usage: get <url> [file]');
  process.exit(0);
}

var args = process.argv;
var file = argc == 4 ? args[3] : null;
var url = args[2];
console.log(url);

function writeFile(file, data) {
  fs.writeFile(file, data, function(err) {
    if (err) { return console.log(err); }
  });
}

var options = {
  headers: { Connection: 'close' }
}

measure.begin();

client.get(url, options, function(err, req, res) {
  measure.end();
  var data = res.headers + "\r\n\r\n" + res.body;
  if (file) {
    writeFile(file, res.body);
    console.log(res.headers + "\r\n");
  } else {
    console.log(data);
  }

  console.log('Downloaded ' + req.href + ' in ' +
    measure.elapsed.seconds + ' seconds and ' + measure.elapsed.ms + ' ms');
});




