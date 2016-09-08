require('rootpath')();
var config = require('config');
var watson = require('watson-developer-cloud');
   
//********************************************************************************************
function PersonalityEngine()
{
  this.insights = watson.personality_insights({
  username:config.get('chameleon.watson.username'),
  password: config.get('chameleon.watson.password'),
  version: config.get('chameleon.watson.version')
 });
     
    PersonalityEngine.prototype.self = this;
    
    
    
}
//********************************************************************************************
PersonalityEngine.prototype.analyze = function(data,language,callback) {
	try {
         PersonalityEngine.prototype.self.insights.profile({
        text: data,
        language: language },
        function (err, response) {
          return callback(err,response);
        
});
		}
	 catch(err) {
       return  callback(err,null);
	
	}
};

//********************************************************************************************
    module.exports =  PersonalityEngine;
     
