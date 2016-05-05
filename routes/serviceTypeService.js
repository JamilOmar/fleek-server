require('rootpath')();
var express = require('express');
var serviceTypeLogic = require('logic/serviceTypeLogic.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');

//Method to get the service types
//*******************************************************************************************
router.get('/getServiceType/:cultureCode', function(req, res) {
    var serviceTypeL = new serviceTypeLogic();
    var response = new responseWs();
    serviceTypeL.getServiceType(req.params.cultureCode,function(err,result){  
              serviceTypeL = null;
              if(err)
                {
                logger.log("error","getServiceType",err);
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
//get service type picture
//********************************************************************************************
router.get('/getServiceTypePicture/:key', function(req, res) {
    var serviceTypeL = new serviceTypeLogic();
    serviceTypeL.getImageAWS(req.params.key,function(err,result){  
        serviceTypeL = null;
        if(result)
        {
            res.set('Content-Type', result.ContentType);
            res.send(result.Body);
            //result.Body.pipe(res);
        }
        else
        {
            logger.log("error","getServiceTypePicture",err); 
            res.json(config.get('chameleon.responseWs.codeError'));
        }
        });
});
//********************************************************************************************
module.exports = router;