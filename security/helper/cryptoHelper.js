require('rootpath')();
var logger = require('utilities/logger');
var config = require('config');
var crypto = require('crypto');
var cryptoHelper =
{

//generate token
//*******************************************************************************************
encrypt : function(item) {
  
    if((!item || 0 === item.length))
    {
        throw {name: "Error at encryption", message:"Item is empty"};
    }
    else
    {
        return crypto.createHmac('sha256',"Fl33kk@pp2016P@$$w0rdG3n").update(item).digest("base64"); 
    }
},
//validate jwt token
//*******************************************************************************************
compare : function(item,hashed){  
    if((!item || 0 === item.length)) 
    {
          return false;
    }
    else
    {
        var  result =crypto.createHmac('sha256',"Fl33kk@pp2016P@$$w0rdG3n").update(item).digest("base64"); 
        return  hashed == result;
     }
}
}
module.exports = cryptoHelper;