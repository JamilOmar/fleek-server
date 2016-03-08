require('rootpath')();        
var base  = require('./base.js');   
var userRating = function()
        {
           this.id = null;
           this.fromUserId = null;
           this.toUserId = null;
           this.reservationId = null; 
           this.description = null;
           this.rating = null;
           this.isForProvider = null; 
           base.call(this);
        };
userRating.prototype = new base();
userRating.prototype.initializer = function (data)
{
           this.id = data.id;
           this.fromUserId = data.fromUserId;
           this.toUserId = data.toUserId;
           this.reservationId = data.reservationId; 
           this.description = data.description;
           this.rating = data.rating;
           this.isForProvider = data.isForProvider; 
}
//********************************************************************************************
 module.exports =userRating;