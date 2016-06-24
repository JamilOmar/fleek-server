module.exports = function(server) {
//Real time server
var Deepstream = require( 'deepstream.io' );
//headdump.writeSnapshot('information_'+ Date.now() + ".heapsnapshot");
var deepstream = new Deepstream();
//start of the real time server
deepstream.set( 'urlPath', '/realtime' );
deepstream.set( 'httpServer', server );
return deepstream;
}
