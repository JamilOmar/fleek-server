require('rootpath')();
var userLogic = require('logic/userLogic');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var mod_vasync  = require("vasync");


//*******************************************************************************************
//login with username and password
//*******************************************************************************************
passport.use(new BasicStrategy(
  function(username, password, resultMethod) {
    var userL = new userLogic();
    mod_vasync.waterfall([
     function validateUser(callback)
     {
        userL.loginUser(username, password, function (err, user)
        {
            return callback(err,user);
        });
     },
    function storeContext(user,callback)
    {
        return callback(null,user)
    }
    ],
    function(err,result){
        userL = null;
        if(err)
        {
            return  resultMethod(err,false);
        }
        else
        {
            return  resultMethod(err,result);
        }
    });
    
  }
));
//*******************************************************************************************
//login with token
//*******************************************************************************************
passport.use(new BearerStrategy(
  function(token, resultMethod) {
    var userL = new userLogic();
    //check the token 
    mod_vasync.waterfall([
    function prepare(callback)
    {
        var decoded = userL.checkToken( token);
    },
    function store(decoded , callback)
    {
        if(decoded != null && decoded.exp > Date.now())
        {
            return callback(null,decoded.id);
        }
        else
        {
            return callback({name: "No Authorize", message:"User not authorize."},null );
        }
    },
    function getUser(userId , callback)
    {
        userL.getUserById(userId,function (err, result)
        {
              return callback(null,result);
            
        });
        
    },
    function storeContext(user,callback)
    {
        return callback(null,user)
    }
    
    ],
    function(err,result){
        userL = null;
        if(err)
        {
            return  resultMethod(err,false);
        }
        else
        {
            return  resultMethod(err,result);
        }
    });
  }
));

module.exports = passport;


