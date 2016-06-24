

//var headdump = require("heapdump");

var http = require('http');
var	app = require('./app')();


var server = http.createServer(app).listen(3000, function(){
  console.log('Fleek server started ');
});
var	deepstream = require('./realtime')(server);
//start realtime server
deepstream.start();