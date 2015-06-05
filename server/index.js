var net = require('net');
var fs = require('fs');
var path = require('path');

var CRLF = '\r\n';
var buffer = '';

function endsWith(str, end) {
  return str.indexOf(end, str.length - end.length) !== -1
}

function parseData(data) {
  var str = data.toString();
  buffer += str;
  var requestEnd = CRLF + CRLF;

  if (buffer.indexOf(requestEnd, buffer.length - requestEnd.length) !== -1) {
    var requestLine = buffer.split(CRLF).shift();
    var comps = requestLine.split(' ');
    var method = comps[0];
    var resource = comps[1];
    var protocol = comps[2];

    var req = {
      'method': method,
      'resource': resource,
      'protocol': protocol
    };

    buffer = '';
    return req;
  }

  return null;
}

function listFiles(socket, req, filePath, cb) {
  fs.readdir(filePath, function(err, files) {
    var str = '';
    for(var i = 0; i < files.length; i++) {
      var file = files[i];
      str += '<a href="' + req.resource + '/' + file + '">' + file + '</a></br>';
    }
    return cb(err, str);
  });
}

function writeFile(socket, req, filePath, cb) {
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
    return cb(err, data);
  });
}

function socketOnData(socket, data) {
  var req = parseData(data);
  if (req) {
    var filePath = path.join(__dirname + req.resource);
    fs.stat(filePath, function(err, stats) {
      if (!err) {
        if (stats.isDirectory()) {
          writeFile(socket, req, filePath + '/index.html', function(err, data) {
            if (!err) {
              socket.end(data);
            } else {
              listFiles(socket, req, filePath, function(err, files) {
                socket.end(files);
              });
            }
          });

        } else if(stats.isFile()) {
          writeFile(socket, req, filePath, function(err, data) {
            if (!err) {
              socket.end(data);
            }
          });
        }
      } else {
        socket.end('error');
      }
    });

  }
}

function connection(socket) {
  socket.on('data', function(data) {
    socketOnData(socket, data);
  });
}

var server = net.createServer(connection).listen(8080, function() {
  console.log('Server listening on localhost:8080');
});
