require('rootpath')();
var userLogic = require('logic/userLogic');
var tokenHelper = require('security/helper/tokenHelper');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var context = require('security/context');
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

//*******************************************************************************************    
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
//*******************************************************************************************        
    function prepare(callback)
    {
        var decoded = tokenHelper.checkToken( token);
        return callback(null,decoded);
    },
//*******************************************************************************************    
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
//*******************************************************************************************    
    function getUser(id , callback)
    {
        userL.getUserById(id,function (err, result)
        {
              return callback(null,result);
            
        });
        
    },
//*******************************************************************************************    
    function storeContext(user,callback)
    {
       context.setUser(user ,callback);

    }
    
    ],
    function(err,result){
        userL = null;
        if(err)
        {
            return  resultMethod(err,null);
        }
        else
        {
            return  resultMethod(err,result);
        }
    });
  }
));
//*******************************************************************************************
module.exports = passport;


