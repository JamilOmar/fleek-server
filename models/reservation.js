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
reservation.prototype = new base();
//********************************************************************************************
        module.exports = reservation;