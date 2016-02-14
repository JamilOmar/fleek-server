require('rootpath')();
var express = require('express');
var config = require('config');
var logger = require('utilities/logger');
var responseWs = require('models/response.js');
var authenticationController = require('security/authentication');

//*******************************************************************************************
//
//hooks for authentication
//
//*******************************************************************************************
var hooks ={
    
   tokenValidation : function(req, res, next) {
    authenticationController.authenticate('bearer', { session : false }, function(err, user, info){
    if(err || user==false)
    {
        var response = new responseWs();
        logger.log("error","login",err);
        response.createResponse("not authorize", config.get('chameleon.responseWs.codeError'));
        res.json(response);
        response = null;
    }
    else
    {
       next();
    }
    })(req, res, next);
    }

}
//*******************************************************************************************
module.exports = hooks;

