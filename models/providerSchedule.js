require('rootpath')();        
var base  = require('./base.js');   
var providerSchedule = function()
        {
           this.id = null;
           this.providerId = null;
           this.name = null;
           this.isDefault = null; 
           base.call(this);
        };
providerSchedule.prototype = new base();
//********************************************************************************************
        module.exports =  providerSchedule;