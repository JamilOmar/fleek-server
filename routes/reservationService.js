require('rootpath')();
var express = require('express');
var reservationLogic = require('logic/reservationLogic');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');


//Method to create the reservation
//*******************************************************************************************
router.post('/addReservation', function(req, res) {
    var reservationL = new reservationLogic();
    var response = new responseWs();
    reservationL.createReservation(req.body,function(err,result){
            reservationL = null;
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

module.exports = router;