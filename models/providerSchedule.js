require('rootpath')();        
var base  = require('./base.js');   
var providerSchedule = function()
        {
           this.id = null;
           this.providerId = null;
           this.name = null;
           this.isDefault = null;
           this.provider  = null; 
           base.call(this);
        };
providerSchedule.prototype = new base();
providerSchedule.prototype.initializer = function (data)
{
           this.id = data.id;
           this.providerId = data.providerId;
           this.name = data.name;
           this.isDefault = data.isDefault;
      
}
//********************************************************************************************
        module.exports =  providerSchedule;