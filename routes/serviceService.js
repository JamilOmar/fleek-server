require('rootpath')();
var express = require('express');
var serviceLogic = require('logic/serviceLogic.js');
var config = require('config');
var logger = require('utilities/logger');
var router = express.Router();
var responseWs = require('models/response.js');

//Method to get the service types
//*******************************************************************************************
router.get('/getServiceByTypeId/:key/:cultureCode', function(req, res) {
    var serviceTypeL = new serviceLogic();
    var response = new responseWs();
    serviceTypeL.getServiceByTypeId(req.params.key,req.params.cultureCode,function(err,result){  
              serviceTypeL = null;
              if(err)
                {
                logger.log("error","getServiceByTypeId",err);
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