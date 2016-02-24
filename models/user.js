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
           this.isProvider = undefined;
           this.countryId = undefined;
           this.latitude = undefined;
           this.longitude = undefined;
           this.gender = undefined;
           this.appointments = undefined;
           this.rating = undefined;
           this.isOpenForFriendship = undefined;
           base.call(this);
        };
user.prototype = new base(); 
user.prototype.initializer = function (data)
{
           this.id = data.id;
           this.name = data.name;
           this.lastname = data.lastname;
           this.age = data.age; 
           if(data.username != undefined)
           this.username =  String(data.username).toLowerCase();
           this.password = data.password;
           this.email = data.email;
           this.facebookId = data.facebook;
           this.pictureUrl = data.pictureUrl; 
           this.isBlocked = data.isBlocked;
           this.isProvider = data.isProvider;
           this.countryId = data.countryId;
           this.latitude = data.latitude;
           this.longitude = data.longitude;
           this.gender = data.gender;
           this.appointments = data.appointments;
           this.rating = data.rating;
           this.isOpenForFriendship = data.isOpenForFriendship;
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