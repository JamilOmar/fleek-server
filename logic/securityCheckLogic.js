require('rootpath')();
var config = require('config');
var responseWs = require('models/response');
var userLogic = require('logic/userLogic');



var passport = require('passport');
//var BasicStrategy = require('passport-http').BasicStrategy;
/*
passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));


*/


//Create the object
//*******************************************************************************************
function securityCheckLogic()
{

   securityCheckLogic.prototype.self = this;
}


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
