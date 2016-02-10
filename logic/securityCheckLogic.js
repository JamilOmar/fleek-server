require('rootpath')();
var config = require('config');
var responseWs = require('models/response.js');
var userLogic = require('logic/userLogic.js');

//Create the object
//*******************************************************************************************
function securityCheckLogic()
{
   this.accessKeyId     = config.get('chameleon.amazonS3.accessKeyId');
   this.secretAccessKey = config.get('chameleon.amazonS3.secretAccessKey');
   securityCheckLogic.prototype.self = this;
}

//check the client
//*******************************************************************************************
securityCheckLogic.prototype.checkClient = function(req, res, next) {
//for app purpose
   if(req.headers.secretaccesskey == "hola"
   && req.headers.accesskeyid == "h")
   {
        next()
   }
   else
   {
        var response = new responseWs();
        response.createResponse("not authorize", config.get('chameleon.responseWs.codeError'));
        res.json(response);
        response = null;
   }
};
//check the user token
//*******************************************************************************************
securityCheckLogic.prototype.checkUserToken = function(req, res, next) {
   var userL = new userLogic();
   //check the token 
   
   var decoded = userL.checkToken( req.headers.token);
   if(decoded != null && decoded.exp > Date.now())
   {
        userL = null;
        req.currentUser = decoded.id;
        next()
   }
   else
   {
        userL = null;
        var response = new responseWs();
        response.createResponse("not authorize", config.get('chameleon.responseWs.codeError'));
        res.json(response);
        response = null;
   }
};

//********************************************************************************************
    module.exports =  securityCheckLogic;
