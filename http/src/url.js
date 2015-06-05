var url = module.exports = {

  parse: function(url, cb) {
    var href = url;
    var matchProtocol = url.match(/(.*)\:\/\//);
    var protocol = matchProtocol ? matchProtocol[1] : null;

    if (protocol) {
      url = url.split(matchProtocol.shift()).pop();
    }

    var host = url.split('/').shift();
    var hostName = host.split(':');
    hostName = hostName.length > 1 ? hostName.shift() : host;
    var port = host.split(':');
    port = port.length > 1 ? port.pop() : null;
    url = url.split(host).pop();

    var path = url;
    var pathName = url.split('?').shift();
    var query = url.split('?');
    query = query.length > 1 ? query.pop() : '';
    url = url.split(path).pop();

    return {
      protocol: protocol,
      host: host,
      port: port,
      hostName: hostName,
      path: path.length == 0 ? '/' : path,
      pathName: pathName,
      query: query,
      href: href
    };
  }
}
