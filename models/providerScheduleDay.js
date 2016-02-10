require('rootpath')();        
var base  = require('./base.js');   
var providerScheduleDay = function()
        {
           this.id = null;
           this.providerScheduleId = null;
           this.startTime = null;
           this.endTime = null; 
           this.dayOfWeek = null;
           base.call(this);
          
        };
providerScheduleDay.prototype = new base();
//********************************************************************************************
        module.exports = providerScheduleDay;
   