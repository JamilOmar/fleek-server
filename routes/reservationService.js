require('rootpath')();
var express = require('express');
var reservationLogic = require('logic/reservationLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');
var reservationModel = require('models/reservation.js');
var reservationRequestModel = require('models/reservationRequest.js');

//Method to create the reservation
//*******************************************************************************************
router.post('/addReservation', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    var reservation =new reservationModel();
    reservation.initializer(req.body);
    reservationL.createReservation(reservation,function(err,result){
            reservationL = null;
            reservation =null;
              if(err)
                {
                logger.log("error","createReservation",err); 
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
//Method to create the reservation
//*******************************************************************************************
router.put('/approvalReservation', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    var reservation =new reservationModel();
    reservation.initializer(req.body);
    reservationL.approvalReservation(reservation,function(err,result){
            reservationL = null;
            reservation =null;
              if(err)
                {
                logger.log("error","approvalReservation",err); 
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

//Method to get the Reservation by Id
//*******************************************************************************************
router.get('/getReservationById/:key', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    reservationL.getReservationById(req.params.key,function(err,result){  
              reservationL = null;
              if(err)
                {
                logger.log("error","getReservationById",err);
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
//Method to get the reservation by customer Id
//*******************************************************************************************
router.get('/getReservationByCustomerId/', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    reservationL.getReservationByCustomerId(req.params.key,function(err,result){  
              reservationL = null;
              if(err)
                {
                logger.log("error","getReservationByCustomerId",err);
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
//Method to retreive the available times
//*******************************************************************************************
router.post('/generateAvailableTimes/', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    var reservationRequest =new reservationRequestModel();
    reservationRequest.initializer(req.body);
    reservationL.generateAvailableTimes(reservationRequest,function(err,result){
            reservationL = null;
            reservation =null;
              if(err)
                {
                logger.log("error","generateAvailableTimes",err); 
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
//Method to get the reservation by provider Id
//*******************************************************************************************
router.get('/getReservationByProviderId/', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    reservationL.getReservationByProviderId(req.params.key,function(err,result){  
              reservationL = null;
              if(err)
                {
                logger.log("error","getReservationByProviderId",err);
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
//Method to get the reservation by provider Id, State and Paged
//*******************************************************************************************
router.get('/getReservationByProviderIdStatePaged/', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    reservationL.getReservationByProviderIdStatePaged(req.query.id,req.query.state,req.query.offset,req.query.limit,function(err,result){  
              reservationL = null;
              if(err)
                {
                logger.log("error","getReservationByProviderIdStatePaged",err);
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

//Method to get the reservation by customer Id , State and Paged
//*******************************************************************************************
router.get('/getReservationByCustomerIdStatePaged/', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    reservationL.getReservationByCustomerIdStatePaged(req.query.id,req.query.state,req.query.offset,req.query.limit,function(err,result){  
              reservationL = null;
              if(err)
                {
                logger.log("error","getReservationByCustomerIdStatePaged",err);
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