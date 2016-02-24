require('rootpath')();
var express = require('express');
var userLogic = require('logic/userLogic.js');
var userModel = require('models/user.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var authenticationController = require('security/authentication');
var tokenHelper = require('security/helper/tokenHelper');
//*******************************************************************************************
//login
//*******************************************************************************************
router.post('/login', function(req, res,next) {
    var response =  new responseWs();
    authenticationController.authenticate('basic', function(err, user, info){
              if(err || user==false)
                {
                logger.log("error","login",err);
                response.createResponse({authenticated :false, token : null , user: null }, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                try
                {
                    var token = tokenHelper.generateToken(user.id);
                    response.createResponse( {authenticated :true, token : token , user: user }, config.get('chameleon.responseWs.codeSuccess'));    
                    res.json(response);
                }
                catch(err)
                {
                     logger.log("error","login",err);
                    response.createResponse({authenticated :false, token : null , user: null }, config.get('chameleon.responseWs.codeError'));
                    res.json(response);
                }
                }
             response = null;
        })(req, res, next);
    }); 
//sign up 
//*******************************************************************************************
router.post('/signup', function(req, res) {
    var userL = new userLogic();
    var response = new responseWs();
    var usr = new userModel()
    usr.initializer(req.body);
    userL.createUser(usr,function(err,result){
        userL = null;
              if(err)
                {
                logger.log("error","signup",err); 
                response.createResponse({authenticated :false, token : null , user: null }, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                try
                {
                    var token = tokenHelper.generateToken(result);
                    response.createResponse( { token : token , user: result }, config.get('chameleon.responseWs.codeSuccess'));    
                    res.json(response);
                }
                catch(err)
                {
                    logger.log("error","signup",err);
                    response.createResponse({authenticated :false, token : null , user: null }, config.get('chameleon.responseWs.codeError'));
                    res.json(response);
                }
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
