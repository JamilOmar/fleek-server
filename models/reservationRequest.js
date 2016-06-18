require('rootpath')();        
var base  = require('./base.js');
var reservationRequest = function()
        {
           this.serviceId = null;
           this.providerId = null;
           this.averageTimePerSession = null; 
           this.date = null;
           base.call(this);
        };
reservationRequest.prototype = new base();        
reservationRequest.prototype.initializer = function (data)
{
         this.serviceId = data.serviceId;
         this.providerId = data.providerId;
 
         this.averageTimePerSession = data.averageTimePerSession; 
         this.date = data.date;
}        

//********************************************************************************************
module.exports = reservationRequest;