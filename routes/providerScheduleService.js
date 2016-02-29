require('rootpath')();
var express = require('express');
var providerScheduleLogic = require('logic/providerScheduleLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var providerScheduleModel = require('models/providerSchedule');

//Method to create the provider schedule
//*******************************************************************************************
router.post('/addProviderSchedule', function(req, res) {
    var providerScheduleL = new providerScheduleLogic();
    var response = new responseWs();
    var providerSchedule = new providerScheduleModel();
    providerSchedule.initializer(req.body);
    providerScheduleL.createProviderSchedule(providerSchedule,function(err,result){
            providerScheduleL = null;
            providerSchedule = null;
              if(err)
                {
                logger.log("error","addProviderSchedule",err); 
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
//Method to update the provider schedule
//*******************************************************************************************
router.put('/updateProviderSchedule', function(req, res) {
    var providerScheduleL = new providerScheduleLogic();
    var response = new responseWs();
    var providerSchedule = new providerScheduleModel();
    providerSchedule.initializer(req.body);
    providerScheduleL.updateProviderSchedule(providerSchedule,function(err,result){
         providerScheduleL = null;
         providerSchedule = null;
              if(err)
                {
                logger.log("error","updateProviderSchedule",err); 
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
//Method to deactivate the provider schedule
//*******************************************************************************************
router.put('/deactivateProviderSchedule', function(req, res) {
    var providerScheduleL = new providerScheduleLogic();
    var response = new responseWs();
    var providerSchedule = new providerScheduleModel();
    providerSchedule.initializer(req.body);
    providerScheduleL.deactivateProviderSchedule(providerSchedule,function(err,result){
            providerScheduleL = null;
              if(err)
                {
                logger.log("error","deactivateProviderSchedule",err); 
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
//Method to get the provider Schedule by Id
//*******************************************************************************************
router.get('/getProviderScheduleById/:key', function(req, res) {
    var providerScheduleL = new providerScheduleLogic();
    var response = new responseWs();
    providerScheduleL.getProviderScheduleById(req.params.key,function(err,result){  
             providerScheduleL = null;
              if(err)
                {
                logger.log("error","getProviderScheduleById",err);
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
//Method to get the provider Schedule by Provider Id
//*******************************************************************************************
router.get('/getProviderScheduleByProviderId/:key', function(req, res) {
    var providerScheduleL = new providerScheduleLogic();
    var response = new responseWs();
    providerScheduleL.getProviderScheduleByProviderId(req.params.key,function(err,result){  
              providerScheduleL = null;
              if(err)
                {
                logger.log("error","getProviderScheduleByProviderId",err);
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