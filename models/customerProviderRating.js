require('rootpath')();        
var base  = require('./base.js');   
var customerProviderRating = function()
        {
           this.id = null;
           this.customerId = null;
           this.providerId = null;
           this.ReservationId = null; 
           this.description = null;
           this.rating = null;
           this.date = null; 
           base.call(this);
        };
customerProviderRating.prototype = new base();
customerProviderRating.prototype.initializer = function (data)
{
           this.id = data.id;
           this.customerId = data.customerId;
           this.providerId = data.providerId;
           this.ReservationId = data.ReservationId; 
           this.description = data.description;
           this.rating = data.rating;
           this.date = data.date; 
}
//********************************************************************************************
        module.exports =customerProviderRating;