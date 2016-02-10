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
//********************************************************************************************
        module.exports =  portafolio;