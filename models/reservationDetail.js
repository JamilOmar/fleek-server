require('rootpath')();        
var base  = require('./base.js');   
var reservationDetail = function()
        {
           this.id = null;
           this.reservationId = null;
           this.serviceId = null;
           this.requestInfo = null; 
           this.duration = null;
           base.call(this);
         
        };
reservationDetail.prototype = new base();
reservationDetail.prototype.initializer = function (data)
{
    this.id = data.id;
    this.reservationId = data.reservation;
    this.serviceId = data.serviceId;
    this.requestInfo = data.serviceId;
    this.duration = data.duration;
 
}
//********************************************************************************************
module.exports =reservationDetail;