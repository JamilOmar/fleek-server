require('rootpath')();        
var base  = require('./base.js');   
var providerScheduleDayException = function()
        {
           this.id = null;
           this.providerScheduleId = null;
           this.date = null;
           this.description = null;
           base.call(this);
        };
providerScheduleDayException.prototype = new base();
//********************************************************************************************
module.exports = providerScheduleDayException;
   