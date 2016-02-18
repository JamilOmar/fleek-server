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
       console.log(JSON.stringify( template));
    console.log(JSON.stringify( message));
   EmailAgent.prototype.self.mandrill_client.messages.sendTemplate({"template_name": template.name, "template_content":  template.content, "message":  message, "async":  EmailAgent.prototype.self.async}, function(err,result) {
   return callback(err,result);
});   
}

module.exports = EmailAgent;
/*
var template_name = "example template_name";
var template_content = [{
        "name": "example name",
        "content": "example content"
    }];
var message = {
    "subject": "example subject",
    "from_email": "message.from_email@example.com",
    "from_name": "Example Name",
    "to": [{
            "email": "recipient.email@example.com",
            "name": "Recipient Name",
            "type": "to"
        }],
    "recipient_metadata": [{
            "values": {
                "user_id": 123456
            }
        }],
   
};
*/

