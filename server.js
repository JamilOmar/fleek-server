

//var headdump = require("heapdump");
//Real time server
var Deepstream = require( 'deepstream.io' );
var http = require('http');
var	app = require('./app')();
//headdump.writeSnapshot('information_'+ Date.now() + ".heapsnapshot");
var deepstream = new Deepstream();

var server = http.createServer(app).listen(3000, function(){
  console.log('Fleek server started ');
});
//start of the real time server
deepstream.set( 'urlPath', '/realtime' );
deepstream.set( 'httpServer', server );
deepstream.start();