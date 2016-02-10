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
//********************************************************************************************
        module.exports =customerProviderRating;