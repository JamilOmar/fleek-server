require('rootpath')();        
var base  = require('./base.js');   
var enterpriseProvider = function()
        {
           this.id = null;     
           this.providerId = null;
           this.enterpriseId = null;
           this.isMainUser = null;
           base.call(this);
        
        };
enterpriseProvider.prototype = new base();
//********************************************************************************************
        module.exports = enterpriseProvider;