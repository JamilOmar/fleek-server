//*******************************************************************************************
//Name: User DAl
//Description: Base class for connectivity with the MySql Database
//Target : User Creation , Administration of users
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var userModel  = require('models/user');
var logger = require('utilities/logger');

//*******************************************************************************************
var userMapper = function()
{
   userMapper.prototype.self = this;
};
//Map Users
//*******************************************************************************************
userMapper.prototype.mapperReqBodyToModel = function(body)
{
    try
    {
    var user  =new userModel();
    if(body.hasOwnProperty("id"))
    user.id  = body.id;
    if(body.hasOwnProperty("name"))
    user.name = body.name;    
    if(body.hasOwnProperty("lastname"))
    user.lastname = body.lastname;
    if(body.hasOwnProperty("age"))
    user.age = body.age;
    if(body.hasOwnProperty("username"))
    user.username = body.username;
    if(body.hasOwnProperty("password"))
    user.password = body.password;
    if(body.hasOwnProperty("email"))
    user.email = body.email;
    if(body.hasOwnProperty("facebookId"))
    user.facebookId = body.facebookId;
    if(body.hasOwnProperty("pictureUrl"))
    user.picture = body.pictureUrl;
    if(body.hasOwnProperty("isBlocked"))
    user.isBlocked = body.isBlocked;
    if(body.hasOwnProperty("isCustomer"))
    user.isCustomer = body.isCustomer;
    if(body.hasOwnProperty("isProvider"))
    user.isProvider = body.isProvider;
    if(body.hasOwnProperty("countryId"))
    user.countryId = body.countryId;
    if(body.hasOwnProperty("latitude"))
    user.latitude = body.latitude;
    if(body.hasOwnProperty("longitude"))
    user.longitude = body.longitude;
    return user;    
    }
    catch (err)
    {
         logger.log("error","mapperReqBodyToModel",err);
        return null;
    }
  
}
//********************************************************************************************
module.exports =userMapper;