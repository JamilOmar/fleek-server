require('rootpath')();
var express = require('express');
var userRatingLogic = require('logic/userRatingLogic.js');
var userRatingModel = require('models/userRating.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');


//create
//*******************************************************************************************
router.post('/addUserRating', function(req, res) {
    var userRatingL = new userRatingLogic();
    var userRating = new userRatingModel();
    var response = new responseWs();
    userRating.initializer(req.body);
    userRatingL.createUserRating(userRating,function(err,result){
        userRatingL = null;
        userRating = null;
              if(err)
                {
                logger.log("error","addUserRating",err); 
                response.createResponse(null, config.get('chameleon.responseWs.codeError'));
                res.json(response);
                }
            else
                {
                 response.createResponse(result, config.get('chameleon.responseWs.codeSuccess'));    
                res.json(response);
                }
            response = null
        });
    });



module.exports = router;
