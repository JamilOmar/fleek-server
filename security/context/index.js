require('rootpath')();
var cls = require('continuation-local-storage');
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
        var userContext = cls.createNamespace(constants.USER_CONTEXT_NAMESPACE);
        userContext.run(function() {
  
        userContext.set(constants.USER_CONTEXT,	user);
        next(null,user);
    });
//*******************************************************************************************
    },
    getUser : function()
    {
        var userContext = cls.getNamespace(constants.USER_CONTEXT_NAMESPACE);
        var x = userContext.get(constants.USER_CONTEXT);
        return x;
    },
     destroy : function()
    {
       cls.destroyNamespace(constants.USER_CONTEXT_NAMESPACE );
      
    }
    
    
    
}
//*******************************************************************************************
module.exports = context;