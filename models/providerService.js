require('rootpath')();        
var base  = require('./base.js');   
var providerService = function()
        {
           this.providerId = null;
           this.serviceId = null;
           this.name = null;
           this.currencyCode = null;
           this.customName = null;
           this.price = null;
           this.averageTimePerSession = null; 
           this.isCustom = null;
           base.call(this);
          
        };
providerService.prototype = new base();
providerService.prototype.initializer = function (data)
{
           this.providerId = data.providerId;
           this.serviceId = data.serviceId;
           this.name = data.name;
           this.currencyCode = data.currencyCode;
           this.customName = data.customName;
           this.price = data.price;
           this.averageTimePerSession = data.averageTimePerSession; 
           this.isCustom = data.isCustom;
      
}
//********************************************************************************************
 module.exports =  providerService;