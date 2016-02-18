require('rootpath')();        
var base  = require('./base.js');   
var user = function()
        {
           this.id = undefined;
           this.name = undefined;
           this.lastname = undefined;
           this.age = undefined; 
           this.username = undefined;
           this.password = undefined;
           this.email = undefined;
           this.facebookId = undefined;
           this.pictureUrl = undefined; 
           this.isBlocked = undefined;
           this.isCustomer = undefined;
           this.isProvider = undefined;
           this.countryId = undefined;
           this.latitude = undefined;
           this.longitude = undefined;
           base.call(this);
        };
user.prototype =    new base(); 
user.prototype.initializer = function (usr)
{
           this.id = usr.id;
           this.name = usr.name;
           this.lastname = usr.lastname;
           this.age = usr.age; 
           this.username = usr.username;
           this.password = usr.password;
           this.email = usr.email;
           this.facebookId = usr.facebook;
           this.pictureUrl = usr.pictureUrl; 
           this.isBlocked = usr.isBlocked;
           this.isCustomer = usr.isCustomer;
           this.isProvider = usr.isProvider;
           this.countryId = usr.countryId;
           this.latitude = usr.latitude;
           this.longitude = usr.longitude;
}


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