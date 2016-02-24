require('rootpath')();        
var base  = require('./base.js');   
var userDevice = function()
        {
            this.id =null;
            this.userId = null;
            this.deviceSerialNumber =null;
            this.deviceFriendlyName = null;
            this.isBlocked =null;
            base.call(this);
            
        };
userDevice.prototype = new base();
userDevice.prototype.initializer = function (data)
{
            this.id =data.id;
            this.userId = data.userId;
            this.deviceSerialNumber =data.deviceSerialNumber;
            this.deviceFriendlyName = data.deviceFriendlyName;
            this.isBlocked =data.isBlocked;
}
//********************************************************************************************
        module.exports = userDevice;