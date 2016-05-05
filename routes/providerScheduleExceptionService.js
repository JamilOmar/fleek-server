require('rootpath')();
var express = require('express');
var providerScheduleExceptionLogic = require('logic/providerScheduleExceptionLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var providerScheduleExceptionModel = require('models/providerScheduleException');

//Method to create the provider schedule Exception
//*******************************************************************************************
router.post('/addProviderScheduleException', function(req, res) {
    var providerScheduleExceptionL = new providerScheduleExceptionLogic();
    var response = new responseWs();
    var providerScheduleException = new providerScheduleExceptionModel();
    providerScheduleException.initializer(req.body);
    providerScheduleExceptionL.createProviderScheduleException(providerScheduleException,function(err,result){
        providerScheduleExceptionL = null;
        providerScheduleException = null;
              if(err)
                {
                logger.log("error","addProviderScheduleException",err); 
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
//Method to update the provider schedule Exception
//*******************************************************************************************
router.put('/updateProviderScheduleException', function(req, res) {
    var providerScheduleExceptionL = new providerScheduleExceptionLogic();
    var response = new responseWs();
    var providerScheduleException = new providerScheduleExceptionModel();
    providerScheduleException.initializer(req.body);
    providerScheduleExceptionL.updateProviderScheduleException(req.body,function(err,result){
        providerScheduleExceptionL = null;
        providerScheduleException = null;
              if(err)
                {
                logger.log("error","updateProviderScheduleException",err); 
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
//Method to deactivate the provider schedule Exception
//*******************************************************************************************
router.put('/deactivateProviderScheduleException', function(req, res) {
    var providerScheduleExceptionL = new providerScheduleExceptionLogic();
    var response = new responseWs();
    var providerScheduleException = new providerScheduleExceptionModel();
    providerScheduleException.initializer(req.body);
    providerScheduleExceptionL.deactivateProviderScheduleException(req.body,function(err,result){
        providerScheduleExceptionL = null;
        providerScheduleException = null;
              if(err)
                {
                logger.log("error","deactivateProviderScheduleException",err); 
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
//Method to get the provider Schedule Exception by Id
//*******************************************************************************************
router.get('/getProviderScheduleExceptionyById/:key', function(req, res) {
    var providerScheduleExceptionL = new providerScheduleExceptionLogic();
    var response = new responseWs();
    providerScheduleExceptionL.getProviderScheduleExceptionById(req.params.key,function(err,result){  
              providerScheduleExceptionL = null;
              if(err)
                {
                logger.log("error","getProviderScheduleExceptionyById",err);
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
//Method to get the provider Schedule Exception by Schedule Id
//*******************************************************************************************
router.get('/getProviderScheduleExceptionByProviderScheduleId/:key', function(req, res) {
    var providerScheduleExceptionL = new providerScheduleExceptionLogic();
    var response = new responseWs();
    providerScheduleExceptionL.getProviderScheduleExceptionByProviderScheduleId(req.params.key,function(err,result){  
              providerScheduleExceptionL = null;
              if(err)
                {
                logger.log("error","getProviderScheduleExceptionByProviderScheduleId",err);
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