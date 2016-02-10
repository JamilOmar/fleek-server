

//var headdump = require("heapdump");
var http = require('http');
var	app = require('./app')();
//headdump.writeSnapshot('information_'+ Date.now() + ".heapsnapshot");


http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ');
});