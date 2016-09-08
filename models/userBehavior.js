require('rootpath')();        
var base  = require('./base.js');   
var userBehavior = function()
        {
            this.id =null;
            this.analysis = null;
            base.call(this);
            
        };
userBehavior.prototype = new base();
userBehavior.prototype.initializer = function (data)
{
            this.id =data.id;
            this.analysis = data.analysis;
          
}
//********************************************************************************************
        module.exports = userBehavior;