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
providerScheduleDay.prototype.initializer = function (data)
{
           this.id = data.id;
           this.providerScheduleId = data.providerScheduleId;
           this.startTime = data.startTime;
           this.endTime = data.endTime; 
           this.dayOfWeek = data.dayOfWeek;
      
}
//********************************************************************************************
        module.exports = providerScheduleDay;
   