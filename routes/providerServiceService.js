require('rootpath')();
var express = require('express');
var providerServiceLogic = require('logic/providerServiceLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var providerServiceModel = require('models/providerService');

//Method to create the provider service
//*******************************************************************************************
router.post('/addProviderService', function(req, res) {
    var providerServiceL = new providerServiceLogic();
    var response = new responseWs();
    var providerService = new providerServiceModel();
    providerService.initializer(req.body);
    providerServiceL.createProviderService(providerService,function(err,result){
            providerServiceL = null;
            providerService = null;
              if(err)
                {
                logger.log("error","addProviderService",err); 
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
//Method to update the provider service
//*******************************************************************************************
router.put('/updateProviderService', function(req, res) {
    var providerServiceL = new providerServiceLogic();
    var response = new responseWs();
    var providerService = new providerServiceModel();
    providerService.initializer(req.body);
    providerServiceL.updateProviderService(providerService,function(err,result){
         providerServiceL = null;
         providerService = null;
              if(err)
                {
                logger.log("error","updateProviderService",err); 
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
//Method to deactivate the provider service
//*******************************************************************************************
router.put('/deactivateProviderService', function(req, res) {
    var providerServiceL = new providerServiceLogic();
    var response = new responseWs();
    var providerService = new providerServiceModel();
    providerService.initializer(req.body);
    providerServiceL.deactivateProviderService(providerService,function(err,result){
            providerServiceL = null;
              if(err)
                {
                logger.log("error","deactivateProviderService",err); 
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
//Method to get the provider Service by Id
//*******************************************************************************************
router.get('/getProviderServiceByProviderId/:key', function(req, res) {
    var providerServiceL = new providerServiceLogic();
    var response = new responseWs();
    providerServiceL.getProviderServiceByProviderId(req.params.key,function(err,result){  
             providerServiceL = null;
              if(err)
                {
                logger.log("error","getproviderServiceByProviderId",err);
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
//Method to get the provider Service by Provider Id
//*******************************************************************************************
router.get('/getProviderServiceByProviderIdServiceId/:key/:service', function(req, res) {
    var providerServiceL = new providerServiceLogic();
    var response = new responseWs();
    providerServiceL.getProviderServiceByProviderIdServiceId(req.params.key,req.params.service,function(err,result){  
              providerServiceL = null;
              if(err)
                {
                logger.log("error","getProviderServiceByProviderIdServiceId",err);
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

//Method to get the providerServiceService by provider Id, Service Type and Culture
//*******************************************************************************************
router.get('/getProviderServiceByProviderIdTypeId/:key/:service/:cultureCode', function(req, res) {
    var providerServiceL = new providerServiceLogic();
    var response = new responseWs();
    providerServiceL.getProviderServiceByProviderIdTypeId(req.params.key,req.params.service,req.params.cultureCode,function(err,result){  
              providerServiceL = null;
              if(err)
                {
                logger.log("error","getProviderServiceByProviderIdTypeId",err);
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