require('rootpath')();
var express = require('express');
var userLogic = require('logic/userLogic.js');
var userModel = require('models/user');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var Busboy = require('busboy');
//Method to update the user
//*******************************************************************************************
router.put('/updateUser', function(req, res) {
    var user =new userModel();
    var userL = new userLogic();
    var response = new responseWs();
    user.initializer( req.body)
    userL.updateUser(user,function(err,result){
        user = null;
        userL = null;
              if(err)
                {
                
                logger.log("error","updateUser",err); 
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
//Method to update the user's password 
//*******************************************************************************************
router.put('/updatePassword', function(req, res) {
    var userL = new userLogic();
    var response = new responseWs();
    userL.updatePassword(req.body.id, req.body.password, req.body.newPassword,function(err,result){
         userL = null;
              if(err)
                {
                logger.log("error","updatePassword",err); 
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
//Method to block the user
//*******************************************************************************************
    router.put('/blockUser', function(req, res) {
        var user =new userModel();
        user.initializer( req.body)
        var userL = new userLogic();
        var response = new responseWs();
        userL.blockUser(user,function(err,result){  
             userL = null;
              if(err)
                {
                logger.log("error","blockUser",err); 
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
//Method to unblock the user
//*******************************************************************************************
    router.put('/unblockUser', function(req, res) {
        var user =new userModel();
        user.initializer( req.body)
        var userL = new userLogic();
        var response = new responseWs();
        userL.unblockUser(user,function(err,result){  
             userL = null;
              if(err)
                {
                logger.log("error","unblockUser",err); 
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
//Method to deactivate the user
//*******************************************************************************************
    router.put('/deactivateUser', function(req, res) {
        var user =new userModel();
        user.initializer( req.body)
        var userL = new userLogic();
        var response = new responseWs();
        userL.deactivateUser(user,function(err,result){  
              userL = null;
              if(err)
                {
                logger.log("error","deactivateUser",err); 
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
//Method to get the user by Id
//*******************************************************************************************
    router.get('/getUserById/:key', function(req, res) {

        var userL = new userLogic();
        var response = new responseWs();
        userL.checkUser(req.params.key,function(err,result){  
              userL = null;
              if(err)
                {
                logger.log("error","getUserById",err);
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
//Method to get the user by facebook Id
//*******************************************************************************************
    router.get('/getUserByFacebookId/:key', function(req, res) {

        var userL = new userLogic();
        var response = new responseWs(); userL.getUserByFacebookId(req.params.key,function(err,result){  
              userL = null;
              if(err)
                {
                logger.log("error","getUserByFacebookId",err); 
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
 //Method to get the actual user
//*******************************************************************************************
    router.get('/me', function(req, res) {
        var userL = new userLogic();
        var response = new responseWs(); userL.getCurrentUser(function(err,result){  
              userL = null;
              if(err)
                {
                logger.log("error","me",err); 
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
//Method to get the user by username
//*******************************************************************************************
    router.get('/getUserByUsername/:username', function(req, res) {

        var userL = new userLogic();
        var response = new responseWs();
    userL.getUserByUsername(req.params.username,function(err,result){  
              userL = null;
              if(err)
                {
                logger.log("error","getUserByUsername",err); 
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

//upload profile picture
//********************************************************************************************
    router.post('/addprofilepicture/:key', function(req, res) {
        var userL = new userLogic();
        var response = new responseWs();
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('error', function(err) {
            busboy = null;
             if(err)
                {
                logger.log("error","addprofilepicture",err); 
                response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                }
        });

        var fileData = null;
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            file.fileRead = [];
            file.on('data', function (data) {
                this.fileRead.push(data);
                });
            file.on('end', function () {
                fileData = Buffer.concat(this.fileRead);
            });
        });
        busboy.on('finish', function() {
            if(fileData != null)
            {
            userL.uploadProfilePicture(fileData,req.params.key,function(err,result){  
                busboy = null;
                userL = null;
                if(err)
                {
                    logger.log("error","addprofilepicture",err); 
                    return response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                }
                else
                {
                    response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                    return res.json(response);
                }
            });
            }
            else
            {
                busboy = null;
                res.json(config.get('chameleon.responseWs.codeError'));
            }
              
        });
        req.on("close", function(err) {
           if(err)
                {
                busboy = null;
                userL = null;
                response = null;
                logger.log("error","addprofilepicture",err); 
                res.json(config.get('chameleon.responseWs.codeCancel'));
                }
        });
        return req.pipe(busboy);
    });

//get profile picture
//********************************************************************************************
router.get('/getProfilePicture/:key', function(req, res) {
    var userL = new userLogic();
    userL.getImageAWS(req.params.key,function(err,result){  
        userL = null;
        if(result)
        {
            res.set('Content-Type', result.ContentType);
            //res.send(result.Body);
            result.Body .pipe(res);
        }
        else
        {
            logger.log("error","getProfilePicture",err); 
            res.json(config.get('chameleon.responseWs.codeError'));
        }
        });
});
//********************************************************************************************
module.exports = router;
