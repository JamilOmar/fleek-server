require('rootpath')();
const logger = require('utilities/logger'),
moment = require('moment'),
jwt = require('jwt-simple'),
config = require('config');
//*******************************************************************************************
//
//token helper
//
//*******************************************************************************************
class tokenHelper 
{

//generate token
//*******************************************************************************************
generateToken(item){  
    let expires = moment().add('days', 15).valueOf();
    let token = jwt.encode({
        id: item,
        exp: expires
    }, "Fl33kk@pp2016P@$$w0rdG3n");
  
    return token;
};
//validate jwt token
//*******************************************************************************************
checkToken(token){  
    
    try
    {
       let decoded = jwt.decode(token, "Fl33kk@pp2016P@$$w0rdG3n");
       return decoded;
    }
    catch(err)
    {
         logger.log("error","checkToken" , err);
         return null;
    }
};
}
//*******************************************************************************************
module.exports = tokenHelper;