require('rootpath')();        
var base  = require('./base.js');   
var enterprise = function()
        {
           this.id = null;
           this.countryId = null;
           this.latitude = null;
           this.longitude = null;
           this.address = null;
           this.name = null;
           this.telephone = null;
           this.contactEmail = null; 
           this.activeEmployees = null;
           base.call(this);
        };
enterprise.prototype = new base();
//********************************************************************************************
        module.exports = enterprise;