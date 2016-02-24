require('rootpath')();        
var base  = require('./base.js');   
var reservation = function()
        {
           this.id = null;
           this.customerId = null;
           this.providerId = null;
           this.providerScheduleId =null;
           this.latitude = null; 
           this.longitude = null;
           this.address = null;
           this.cancelationReason = null; 
           this.date = null;
           this.startTime = null;
           this.endTime = null;
           this.state = false;
           //only for this case, is requested for reservations Details
           this.reservationDetail = null;
           base.call(this);
        };
reservation.prototype.initializer = function (data)
{
        this.id = data.id;
        this.customerId = data.customerId;
        this.providerId = data.providerId;
        this.providerScheduleId =data.providerScheduleId;
        this.latitude =data.latitude; 
        this.longitude =data.longitude;
        this.address = data.address;
        this.cancelationReason = data.cancelationReason; 
        this.date = data.date;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.state = data.state;
  
      
}        
reservation.prototype = new base();
//********************************************************************************************
        module.exports = reservation;