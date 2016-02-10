require('rootpath')();        
var base  = require('./base.js');   
var service = function()
        {
           this.id = null;
           this.name = null;
           this.type = null;
           base.call(this);
      
        };
service.prototype = new base();
//********************************************************************************************
        module.exports = service;