require('rootpath')();        
var base  = require('./base.js');   
var reservationDetail = function()
        {
           this.id = null;
           this.reservationId = null;
           this.serviceId = null;
           this.requestInfo = null; 
           this.startTime = null;
           this.endTime = null;
           base.call(this);
         
        };
reservationDetail.prototype = new base();
//********************************************************************************************
module.exports =reservationDetail;