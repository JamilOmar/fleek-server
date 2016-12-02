require('rootpath')();        
let base  = require('./base.js');   

class portafolio extends base {
constructor(){
        this.id = null;
        this.reservationId = null;
        this.userId = null;
        this.customerId = null; 
        //Amazon AWS Id
        this.repositoryId = null;
        this.description = null;
        super();
        
};
initializer(data)
{
           this.id = data.id;
           this.reservationId = data.reservationId;
           this.userId = data.userId;
           this.customerId = data.customerId; 
           //Amazon AWS Id
           this.repositoryId = data.repositoryId;
           this.description = data.description;
};
}
//********************************************************************************************
 module.exports =  portafolio;