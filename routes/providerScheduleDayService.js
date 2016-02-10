require('rootpath')();
var express = require('express');
var providerScheduleDayLogic = require('logic/providerScheduleDayLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');


//Method to create the provider schedule Day
//*******************************************************************************************
router.post('/addProviderScheduleDay', function(req, res) {
    var providerScheduleDayL = new providerScheduleDayLogic();
    var response = new responseWs();
    providerScheduleDayL.createProviderScheduleDay(req.body,function(err,result){
         providerScheduleDayL = null;
              if(err)
                {
                logger.log("error","addProviderScheduleDay",err); 
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
//Method to update the provider schedule Day
//*******************************************************************************************
router.put('/updateProviderScheduleDay', function(req, res) {
    var providerScheduleDayL = new providerScheduleDayLogic();
    var response = new responseWs();
    providerScheduleDayL.updateProviderScheduleDay(req.body,function(err,result){
        providerScheduleDayL = null;
              if(err)
                {
                logger.log("error","updateProviderScheduleDay",err); 
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
//Method to deactivate the provider schedule Day
//*******************************************************************************************
router.put('/deactivateProviderScheduleDay', function(req, res) {
    var providerScheduleDayL = new providerScheduleDayLogic();
    var response = new responseWs();
    providerScheduleDayL.deactivateProviderScheduleDay(req.body,function(err,result){
          providerScheduleDayL = null;
              if(err)
                {
                logger.log("error","deactivateProviderScheduleDay",err); 
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
//Method to get the provider Schedule Day by Id
//*******************************************************************************************
router.get('/getProviderScheduleDayById/:key', function(req, res) {
    var providerScheduleDayL = new providerScheduleDayLogic();
    var response = new responseWs();
    providerScheduleDayL.getProviderScheduleDayById(req.params.key,function(err,result){  
              providerScheduleL = null;
              if(err)
                {
                logger.log("error","getProviderScheduleDayById",err);
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
//Method to get the provider Schedule Day by Schedule Id
//*******************************************************************************************
router.get('/getProviderScheduleDayByProviderScheduleId/:key', function(req, res) {
    var providerScheduleDayL = new providerScheduleDayLogic();
    var response = new responseWs();
    providerScheduleDayL.getProviderScheduleDayByProviderScheduleId(req.params.key,function(err,result){  
              providerScheduleL = null;
              if(err)
                {
                logger.log("error","getProviderScheduleDayByProviderScheduleId",err);
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