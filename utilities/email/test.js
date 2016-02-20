var emailT = require("./index.js");

var email = new emailT();
var messageHelper = require("./models/message");
var templateHelper = require("./models/template");


var m = new messageHelper();
var t = new templateHelper();

m.to.push({email:"seerch@gmailcom"});
m.recipient_metadata.push({userId: 1});
m.from_email="no-reply@fleekapp.co";
m.subject = "test";
t.name="SERVER_REGISTRATION";
t.content.push({name :"username" , content : "perrito"});
t.content.push({name: "body" , content: "Esta es una prueba desde fleekapp"});


email.sendEmail(t,m, function(err,result)
{
    console.log(err);    
    console.log(result);
});