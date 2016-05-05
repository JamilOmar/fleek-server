require('rootpath')();        
var base  = require('./base.js');   
var userDevice = function()
        {
            this.id =null;
            this.userId = null;
            this.appName =null;
            this.appVersion = null;
            this.deviceToken =null;
            this.deviceFriendlyName = null;
            this.deviceModel =null;
            this.deviceVersion = null;
            base.call(this);
            
        };
userDevice.prototype = new base();
userDevice.prototype.initializer = function (data)
{
            this.id =data.id;
            this.userId = data.userId;
            this.appName =data.appName;
            this.appVersion = data.appVersion;
            this.deviceToken =data.deviceToken;
            this.deviceFriendlyName = data.deviceFriendlyName;
            this.deviceModel =data.deviceModel;
            this.deviceVersion = data.deviceVersion;
}
//********************************************************************************************
        module.exports = userDevice;