require('rootpath')();
var express = require('express');
var providerLogic = require('logic/providerLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var providerModel = require('models/provider');

//Method to create the provider 
//*******************************************************************************************
router.post('/addProvider', function(req, res) {
    var providerL = new providerLogic();
    var response = new responseWs();
    var provider = new providerModel();
    provider.initializer(req.body);
    providerL.createProvider(provider,function(err,result){
            providerL = null;
            provider = null;
              if(err)
                {
                logger.log("error","addProvider",err); 
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
//Method to update the provider 
//*******************************************************************************************
router.put('/updateProvider', function(req, res) {
    var providerL = new providerLogic();
    var response = new responseWs();
    var provider = new providerModel();
    provider.initializer(req.body);
    providerL.updateProvider(provider,function(err,result){
         providerL = null;
         provider = null;
              if(err)
                {
                logger.log("error","updateProvider",err); 
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

//Method to get the provider  by Id
//*******************************************************************************************
router.get('/getProviderById/:key', function(req, res) {
    var providerL = new providerLogic();
    var response = new responseWs();
    providerL.getProviderById(req.params.key,function(err,result){  
             providerL = null;
              if(err)
                {
                logger.log("error","getProviderById",err);
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
//Method for get providers by coordinates and service id
//*******************************************************************************************
router.get('/getProviderByLocationForSearch', function(req, res) {
    var providerL = new providerLogic();
    var response = new responseWs();
    providerL.getProviderByLocationForSearch(req.query.query,req.query.latitude,req.query.longitude,req.query.serviceId,req.query.offset,req.query.limit,function(err,result){  
             providerL = null;
              if(err)
                {
                logger.log("error","getProviderByLocationForSearch",err);
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
//Method for get providers by coordinates and service id
//*******************************************************************************************
router.get('/getProviderInformationWithServices/:id/', function(req, res) {
    var providerL = new providerLogic();
    var response = new responseWs();
    providerL.getProviderInformationWithServices(req.params.id,function(err,result){  
             providerL = null;
              if(err)
                {
                logger.log("error","getProviderInformationWithServices",err);
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