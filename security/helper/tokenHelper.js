require('rootpath')();
var logger = require('utilities/logger');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('config');
var tokenHelper =
{

//generate token
//*******************************************************************************************
generateToken : function(item){  
    var expires = moment().add('days', 15).valueOf();
    var token = jwt.encode({
        id: item,
        exp: expires
    }, "Fl33kk@pp2016P@$$w0rdG3n");
  
    return token;
},
//validate jwt token
//*******************************************************************************************
checkToken : function(token){  
    
    try
    {
       var decoded = jwt.decode(token, "Fl33kk@pp2016P@$$w0rdG3n");
       return decoded;
    }
    catch(err)
    {
         logger.log("error","checkToken" , err);
         return null;
    }
}
}
module.exports = tokenHelper;