require('rootpath')();        
var base  = require('./base.js');   
var user = function()
        {
           this.id = null;
           this.name = null;
           this.lastname = null;
           this.age = null; 
           this.username = null;
           this.password = null;
           this.email = null;
           this.facebookId = null;
           this.pictureUrl = null; 
           this.isBlocked = false;
           this.isCustomer = false;
           this.isProvider = false;
           this.countryId = false;
           this.latitude = false;
           this.longitude = false;
           base.call(this);
        };
user.prototype =    new base(); 
//method to fill basic information
user.prototype.basicInformation = function(id, name ,lastname, username, pictureUrl)
{
           this.id = id;
           this.name = name;
           this.lastname = lastname;
           this.username = username;
           this.pictureUrl = pictureUrl; 
}; 
//********************************************************************************************
module.exports = user;