require('rootpath')();        
let Base  = require('./base.js');   
class ProviderScheduleDay extends Base
{        constructor(){
           this.id = null;
           this.providerScheduleId = null;
           this.startTime = null;
           this.endTime = null; 
           this.dayOfWeek = null;
           super();
          
        };
//********************************************************************************************
initializer(data)
{
           this.id = data.id;
           this.providerScheduleId = data.providerScheduleId;
           this.startTime = data.startTime;
           this.endTime = data.endTime; 
           this.dayOfWeek = data.dayOfWeek;
      
};
}
//********************************************************************************************
        module.exports = ProviderScheduleDay;
   