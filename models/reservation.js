require('rootpath')();        
var base  = require('./base.js');
var reservationDetailModel = require('./reservationDetail.js');
var userRatingModel =  require('./userRating.js');
var reservation = function()
        {
           this.id = null;
           this.customerId = null;
           this.providerId = null;
           this.customer = null;
           this.provider = null;
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
           //only for this case, are rates from the users
            this.reservationRate = null;
           base.call(this);
        };
reservation.prototype = new base();        
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
        this.reservationDetail = [];
     
        if( data.reservationDetail != undefined)
        {
            data.reservationDetail.forEach(function(element) {
            var reservationD = new  reservationDetailModel();
            reservationD.initializer(element);
            this.reservationDetail.push(reservationD);
            }, this);
        }
        if( data.reservationRate != undefined)
        {
            this.reservationRate = new  userRatingModel();
            this.reservationRate.initializer(data.reservationRate);
           
        }
}        

//********************************************************************************************
module.exports = Object.freeze(reservation);