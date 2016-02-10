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
//********************************************************************************************
        module.exports = userDevice;