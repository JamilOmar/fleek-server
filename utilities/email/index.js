require('rootpath')();
//var config = require('config');     
var mandrill =require('mandrill-api/mandrill');
//method to connect to server 
//*******************************************************************************************
function EmailAgent(configurationPath)
{
   this.mandrill_client = new mandrill.Mandrill('3_oNA5hR5LL5hBl7BcH9KA');
   this.async = true;
   EmailAgent.prototype.self = this;

};
//*******************************************************************************************
EmailAgent.prototype.sendEmail= function(template, message,callback)
{
      
   EmailAgent.prototype.self.mandrill_client.messages.sendTemplate({"template_name": template.name, "template_content":  template.content, "message":  message, "async":  EmailAgent.prototype.self.async}, function(result) {
 
  return callback(null,result);
}, function(e) {
      return callback(e);
});   
}
//*******************************************************************************************
module.exports = EmailAgent;

