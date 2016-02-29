require('rootpath')();
const redis = require("redis");
var config = require('config');
//********************************************************************************************
function Cache()
{
    
    this.client = redis.createClient(config.get('chameleon.redis'));
    Cache.prototype.self = this;
    
    
}
//********************************************************************************************
Cache.prototype.saveCache = function(key,data, callback) {
	try {

		this.client.hmset(key, data, function(err) {
			 callback(err,data);
		});
	} catch(err) {

		callback(err,null);
	}
};
//********************************************************************************************
Cache.prototype.getCache = function(key, callback) {
	try {
		this.client.hgetall(key, function(err, reply) {
				callback(err,reply);
		});
	} catch(err) {

		callback(err,null);
	}
};
//********************************************************************************************
Cache.prototype.deleteCache = function(key, callback) {
	try {
		this.client.del(key, function(err, reply) {
				callback(err,reply);
		});
	} catch(err) {

		callback(err,null);
	}
};
//********************************************************************************************
Cache.prototype.addSetCache = function(key,data, callback) {
	try {
		this.client.sadd(key, data, function(err) {
			 callback(err,data);
		});
	} catch(err) {

		callback(err,null);
	}
};
//********************************************************************************************
Cache.prototype.getSetCache = function(key, callback) {
	try {
		this.client.smembers(key, function(err, reply) {
				callback(err,reply);
		});
	} catch(err) {

		callback(err,null);
	}
};
//********************************************************************************************
    module.exports =  Cache;
     
