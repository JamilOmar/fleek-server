require('rootpath')();        
var base  = require('./base.js');   
var portafolio = function()
        {
           this.id = null;
           this.reservationId = null;
           this.userId = null;
           this.customerId = null; 
           //Amazon AWS Id
           this.repositoryId = null;
           this.description = null;
           base.call(this);
          
        };
portafolio.prototype = new base();
portafolio.prototype.initializer = function (data)
{
           this.id = data.id;
           this.reservationId = data.reservationId;
           this.userId = data.userId;
           this.customerId = data.customerId; 
           //Amazon AWS Id
           this.repositoryId = data.repositoryId;
           this.description = data.description;
}
//********************************************************************************************
 module.exports =  portafolio;