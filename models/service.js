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
service.prototype.initializer = function (data)
{
    this.id = data.id;
    this.name = data.name
    this.type = data.type;     
}
//********************************************************************************************
module.exports = service;