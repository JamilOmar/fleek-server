module.exports = function(server) {
//Real time server
var Deepstream = require( 'deepstream.io' );
//headdump.writeSnapshot('information_'+ Date.now() + ".heapsnapshot");
var deepstream = new Deepstream();
//start of the real time server
deepstream.set( 'urlPath', '/deepstream' );
deepstream.set( 'httpServer', server );
deepstream.set( 'permissionHandler', {
    isValidUser: function( connectionData, authData, callback ) {
        callback( null, authData.username || 'open' );
    },

    canPerformAction: function( username, message, callback ) {
        callback( null, true );
    },
    onClientDisconnect: function( username ){
console.log(username);

    } // this one is optional
});
return deepstream;
}
