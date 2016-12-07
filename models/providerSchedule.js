require('rootpath')();        
let Base  = require('./base.js');   
class ProviderSchedule extends Base
{
    constructor(){    
           this.id = null;
           this.providerId = null;
           this.name = null;
           this.isDefault = null;
           this.isMultiple = null;
           this.provider  = null; 
           super();
        };
//********************************************************************************************        
initializer(data)
{
           this.id = data.id;
           this.providerId = data.providerId;
           this.name = data.name;
           this.isDefault = data.isDefault;
           this.isMultiple = data.isMultiple;
      
}
}
//********************************************************************************************
module.exports =  ProviderSchedule;