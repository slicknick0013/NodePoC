//var http = require('http'),
//    express = require('express'),
//    bodyParser = require('body-parser');
//http.createServer(function (req, res) {
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.send('Nicks Node server\n' +
//        'Matt likes it up the butt');
//
//}).listen(1337, '192.168.1.26');
  //.listen(1337, '127.0.0.1');


var http = require('http'),
    static = require('node-static');

var folder = new(static.Server)('./public');

http.createServer(function (req, res) {
    req.addListener('end', function () {
        folder.serve(req, res);
    }).resume();
}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');