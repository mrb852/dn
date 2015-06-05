var net = require('net');
var url = require('./url');
var extend = require('util-extend');

var HttpClient = module.exports = {
  _httpProtocol: 'HTTP/1.1',
  _CRLF: "\r\n\r\n",
  _newLine: "\r\n",

  METHOD: {
    GET: 'GET'
  },

  request: function(method, urlString, options, cb) {
    var data = url.parse(urlString)
    var response = "";

    options.userAgent = options.userAgent || 'simple-get';
    options.headers = extend({
      Host: data.host,
      Agent: options.userAgent
    }, options.headers);

    var request = {
      method: 'GET',
      headers: options.headers
    };

    request = extend(data, request);

    var req = [
      method + ' ' + data.path + ' ' + HttpClient._httpProtocol,
      'User-agent: ' + options.userAgent
    ];

    var keys = Object.keys(request.headers);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = request.headers[key];
      if (key === 'Agent') {
        continue;
      }
      req.push(key + ': ' + val);
    };


    req = req.join(HttpClient._newLine) + HttpClient._CRLF;

    console.log(req);
    data.port = data.port || 80;

    client = new net.createConnection(data.port, data.host);

    client.on('data', function(data) {
      response += data;
    });

    client.on('connect', function() {
       client.end(req);
    });

    client.on('end', function() {
      result = response.split(HttpClient._CRLF);

      cb(null, request, {
        headers: result.shift(),
        body: result
      });
    });
  },

  get: function(url, options, cb) {
    return HttpClient.request(HttpClient.METHOD.GET, url, options, cb);
  }
};
