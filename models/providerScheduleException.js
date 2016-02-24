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
providerScheduleDayException.prototype.initializer = function (data)
{
           this.id = data.id;
           this.providerScheduleId = data.providerScheduleId;
           this.date = data.date;
           this.description = data.description;
      
}
//********************************************************************************************
module.exports = providerScheduleDayException;
   