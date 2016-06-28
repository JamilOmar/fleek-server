require('rootpath')();
const redis = require("redis");
var config = require('config');
var deepstream = require( 'deepstream.io-client-js' );
   
//********************************************************************************************
function NotificationsEngine()
{
    
    this.subscriber = redis.createClient(config.get('chameleon.redis'));
    this.ds = deepstream( 'localhost:6021' ).login({username:"fleekServer"});
   
    NotificationsEngine.prototype.self = this;
    
    
    
}
//********************************************************************************************
NotificationsEngine.prototype.start = function() {
	try {

		NotificationsEngine.prototype.self.subscriber.on("subscribe", NotificationsEngine.prototype.self.notificationsSubscribers);
        NotificationsEngine.prototype.self.subscriber.on("message", NotificationsEngine.prototype.self.notificationsMessage);
        NotificationsEngine.prototype.self.subscriber.subscribe("notification");
		}
	 catch(err) {
 console.log(err);
	
	}
};
//********************************************************************************************
NotificationsEngine.prototype.notificationsSubscribers = function(channel,count) {

console.log(count);

};
//********************************************************************************************
NotificationsEngine.prototype.notificationsMessage = function(channel,message) {
try
{
var record = NotificationsEngine.prototype.self.ds.record.getRecord( 'user/'+message );
record.set( 'notifications', Date.now() );
console.log(message);
}catch(err){}

};
//********************************************************************************************
    module.exports =  NotificationsEngine;
     
