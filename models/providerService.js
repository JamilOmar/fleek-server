require('rootpath')();        
var base  = require('./base.js');   
var providerService = function()
        {
           this.id = null;
           this.serviceId = null;
           this.customName = null;
           this.price = null;
           this.averageTimePerSession = null; 
           this.isCustom = null;
           base.call(this);
          
        };
providerService.prototype = new base();
providerService.prototype.initializer = function (data)
{
           this.id = data.id;
           this.serviceId = data.serviceId;
           this.customName = data.customName;
           this.price = data.price;
           this.averageTimePerSession = data.averageTimePerSession; 
           this.isCustom = data.isCustom;
      
}
//********************************************************************************************
        module.exports =  providerService;