require('rootpath')();      
var config = require('config');
var logger = require('utilities/logger');
var plivo = require('plivo');
//method to connect to server 
//*******************************************************************************************
function SMSAgent(configurationPath)
{
  
    this.p = plivo.RestAPI(configurationPath);
    SMSAgent.prototype.self = this;
};
//method to send notifications
//*******************************************************************************************
SMSAgent.prototype.sendSMS= function(src,dst,text)
{
    try{
        var params = {
        'src': src, // Caller Id
        'dst' : dst, // User Number to Call
        'text' : text,
        'type' : "sms",
         };

        SMSAgent.prototype.self.p.send_message(params, function (status, response) {
    }); 
   
    }catch(err)
    {
          logger.log("error","sendSMS" ,err);
    }

};
//constructor
//********************************************************************************************
//    module.exports = function() {
//       var instance = new SMSAgent(config.get('chameleon.sms'));
//        return instance;
 //   };
 module.exports =  SMSAgent;