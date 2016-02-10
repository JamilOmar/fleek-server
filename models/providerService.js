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
//********************************************************************************************
        module.exports =  providerService;