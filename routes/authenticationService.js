require('rootpath')();
var express = require('express');
var userLogic = require('logic/userLogic.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
//*******************************************************************************************
//login
//*******************************************************************************************
router.post('/login', function(req, res) {
    var userL =  new userLogic();
    var response =  new responseWs();
    userL.loginUser(req.body,function(err,result){
        userL=null;
              if(err)
                {
                logger.log("error","login",err); 
                response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
             response = null;
        });
    }); 
//sign up 
//*******************************************************************************************
router.post('/signup', function(req, res) {
    var userL = new userLogic();
    var response = new responseWs();
    userL.signup(req.body,function(err,result){
        userL = null;
              if(err)
                {
                logger.log("error","signup",err); 
                response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
          response = null;
        });
    });
//get user by username
//*******************************************************************************************
    router.get('/getUserByUserName/:username', function(req, res) {
    var userL = new userLogic();
    var response = new responseWs();
    userL.getUserByUsername(req.params.username,function(err,result){  
              userL = null;
              if(err)
                {
                logger.log("error","getUserByUserName",err);
                    response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            response = null;
        });
    });

module.exports = router;
