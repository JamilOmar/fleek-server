require('rootpath')();
var express = require('express');
var customerProviderRatingLogic = require('logic/customerProviderRatingLogic.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var securityCheckLogic = require('logic/securityCheckLogic.js');

//create
//*******************************************************************************************
router.post('/newCustomerProviderRating', function(req, res) {
    var customerProviderL = new customerProviderRatingLogic();
    var response = new responseWs();
    customerProviderL.createCustomerProviderRating(req.body,function(err,result){
        delete customerProviderL;
              if(err)
                {
                logger.log("error","newCustomerProviderRating",err); 
                response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            delete response;
        });
    });
//deactivate
//*******************************************************************************************
router.post('/deactivateCustomerProviderRating', function(req, res) {
    var customerProviderL = new customerProviderRatingLogic();
    var response = new responseWs();
    customerProviderL.deactivateCustomerProviderRating(req.body,function(err,result){
        delete customerProviderL;
              if(err)
                {
                logger.log("error","deactivateCustomerProviderRating",err); 
                response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            delete response;
        });
    });

//getCustomerProviderRatingById
//*******************************************************************************************
    router.get('/getCustomerProviderRatingById/:key', function(req, res) {

    var customerProviderL = new customerProviderRatingLogic();
    var response = new responseWs();
    customerProviderL.getCustomerProviderRatingById(req.params.key,function(err,result){  
              delete userL;
              if(err)
                {
                logger.log("error","getCustomerProviderRatingById",err);
                    response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            delete response;
        });
    });
//getCustomerProviderRatingByProviderAndCustomerId
//*******************************************************************************************
    router.get('/getCustomerProviderRatingByProviderAndCustomerId/:provider/:customer', function(req, res) {

    var customerProviderL = new customerProviderRatingLogic();
    var response = new responseWs();
    customerProviderL.getCustomerProviderRatingByProviderAndCustomerId(req.params.provider,req.params.customer ,function(err,result){  
              delete userL;
              if(err)
                {
                logger.log("error","getCustomerProviderRatingByProviderAndCustomerId",err);
                    response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            delete response;
        });
    });

//getCustomerProviderRatingByCustomerReservationId
//*******************************************************************************************
    router.get('/getCustomerProviderRatingByCustomerReservationId/:key', function(req, res) {

    var customerProviderL = new customerProviderRatingLogic();
    var response = new responseWs();
    customerProviderL.getCustomerProviderRatingByCustomerReservationId(req.params.key,function(err,result){  
              delete userL;
              if(err)
                {
                logger.log("error","getCustomerProviderRatingByCustomerReservationId",err);
                    response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            delete response;
        });
    });
//getCustomerProviderRatingByProviderId
//*******************************************************************************************
    router.get('/getCustomerProviderRatingByProviderId/:key', function(req, res) {

    var customerProviderL = new customerProviderRatingLogic();
    var response = new responseWs();
    customerProviderL.getCustomerProviderRatingByProviderId(req.params.key,function(err,result){  
              delete userL;
              if(err)
                {
                logger.log("error","getCustomerProviderRatingByProviderId",err);
                    response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            delete response;
        });
    });    


module.exports = router;
