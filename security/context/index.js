require('rootpath')();
var createNamespace = require('continuation-local-storage');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
//*******************************************************************************************
//
//user context
//
//*******************************************************************************************
var context = 
{
//*******************************************************************************************    
    setUser : function (user,next)
    {
        var userContext = createNamespace.createNamespace(constants.USER_CONTEXT_NAMESPACE);
        userContext.run(function() {
  
        userContext.set(constants.USER_CONTEXT, user);
        next(null,user);
    });
//*******************************************************************************************
    },
    getUser : function()
    {
        var userContext = createNamespace.getNamespace(constants.USER_CONTEXT_NAMESPACE);
        return userContext.get(constants.USER_CONTEXT);
    }
    
    
    
}
//*******************************************************************************************
module.exports = context;