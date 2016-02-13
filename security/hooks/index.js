require('rootpath')();
var config = require('config');
var logger = require('utilities/logger');
var responseWs = require('models/response.js');
var passport = require('security/authentication');
var context = require('security/context');
//*******************************************************************************************
//
//hooks for authentication
//
//*******************************************************************************************
var hooks ={
    
   tokenValidation : function(req, res, next) {
    passport.authenticate('bearer', { session : false }, function(err, user, info){
    if(err)
    {
        var response = new responseWs();
        logger.log("error","login",err);
        response.createResponse("not authorize", config.get('chameleon.responseWs.codeError'));
        res.json(response);
        response = null;
    }
    else
    {
        context.set (user , next());
    }
    });
    }

}
module.exports = hooks;