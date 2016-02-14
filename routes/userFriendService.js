require('rootpath')();
var express = require('express');
var userFriendLogic = require('logic/userFriendLogic.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');

//Method to get the user  by friend id
//*******************************************************************************************
  router.get('/getUserFriendByUserId/:key', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
        userFriendL.getUserFriendByUserId(req.params.key,function(err,result){  
             userFriendL = null;
              if(err)
                {
                logger.log("error","getUserFriendByUserId",err);
        res.json(config.get('chameleon.errorMessage'));response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);              }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            response = null;
        });
    });
    //Method to get the user's approved friends
//*******************************************************************************************
  router.get('/getUserFriendApprovedByUserId/:key', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
        userFriendL.getUserFriendApprovedByUserId(req.params.key,function(err,result){  
             userFriendL = null;
              if(err)
                {
                logger.log("error","getUserFriendApprovedByUserId",err);
        res.json(config.get('chameleon.errorMessage'));response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);              }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            response = null;
        });
    });
    //Method to get the in process user's friends 
//*******************************************************************************************
  router.get('/getUserFriendInProcessByUserId/:key', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
        userFriendL.getUserFriendInProcessByUserId(req.params.key,function(err,result){  
             userFriendL = null;
              if(err)
                {
                logger.log("error","getUserFriendInProcessByUserId",err);
        res.json(config.get('chameleon.errorMessage'));response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);              }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            response = null;
        });
    });        
     //Method to get the userfriend by id
//*******************************************************************************************
  router.get('/getUserFriendById/:key', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
        userFriendL.getUserFriendById(req.params.key,function(err,result){  
             userFriendL = null;
              if(err)
                {
                logger.log("error","getUserFriendById",err);
        res.json(config.get('chameleon.errorMessage'));response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);              }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            response = null;
        });
    });
//********************************************************************************************
//Method to add a friend to the user
//*******************************************************************************************
    router.post('/addUserFriend', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
    userFriendL.addUserFriend(req.body ,function(err,result){  
              userFriendL = null;
              if(err)
                {
                logger.log("error","addUserFriend",err); 
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
//Method accept friend request
//*******************************************************************************************
    router.put('/approvalUserFriend', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
        userFriendL.approvalUserFriend(req.body ,function(err,result){  
              userFriendL = null;
              if(err)
                {
                logger.log("error","approvalUserFriend",err); 

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
  
//Method to remove a friend from the user
//*******************************************************************************************
    router.put('/removeUserFriend', function(req, res) {

        var userFriendL = new userFriendLogic();
        var response = new responseWs();
        userFriendL.removeUserFriend(req.body ,function(err,result){  
              userFriendL = null;
              if(err)
                {
                logger.log("error","removeUserFriend",err); 

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
//********************************************************************************************
module.exports = router;
