require('rootpath')();
var createNamespace = require('continuation-local-storage').createNamespace;
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
//*******************************************************************************************
//
//user context
//
//*******************************************************************************************
var user = 
{
    
    set : function (user,next)
    {
        var userContext = createNamespace(constants.USER_CONTEXT_NAMESPACE);
        userContext.run(function(outer) {
  
        userContext.set(constants.USER_CONTEXT, 1);
        next();
    });

    },
    get : function(user)
    {
        var userContext = createNamespace(constants.USER_CONTEXT_NAMESPACE);
        return userContext.get(constants.USER_CONTEXT);
    }
    
    
    
}

module.exports = user;