var express = require('express');
var app = express();

process.env.PORT = 3000;

app.get('/', function (req, res) {

});

var server = app.listen(process.env.PORT, function () {
  console.log('running at localhost:' + process.env.PORT);
});

module.exports = server;
