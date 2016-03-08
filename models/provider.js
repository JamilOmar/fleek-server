require('rootpath')();        
var base  = require('./base.js');   
var providerService = function()
        {
           this.id = null;
           this.latitude = null;
           this.longitude = null;
           this.telephone = null;
           this.rating = null;
           this.allowsKids = null;
           this.appointments = null; 
           this.isForMale = null;
           this.isForFemale = null;
           this.state = null;
           base.call(this);
          
        };
providerService.prototype = new base();
providerService.prototype.initializer = function (data)
{
           this.id = data.id;
           this.latitude = data.latitude;
           this.longitude = data.longitude;
           this.telephone = data.telephone;
           this.rating = data.rating;
           this.allowsKids = data.allowsKids;
           this.appointments = data.appointments; 
           this.isForMale = data.isForMale;
           this.isForFemale = data.isForFemale;
           this.state = data.state;
      
}
//********************************************************************************************
 module.exports =  providerService;
 
