require('rootpath')();        
let Base  = require('./base.js');   
class Provider extends Base
{
        constructor(){
           this.id = null;
           this.latitude = null;
           this.longitude = null;
           this.telephone = null;
           this.rating = null;
           this.allowsKids = null;
           this.appointments = null; 
           this.isForMale = null;
           this.isForFemale = null;
           this.state = null;
           this.user = null;
           this.address = null;
           super();
          
        };

initializer(data)
{
           this.id = data.id;
           this.latitude = data.latitude;
           this.longitude = data.longitude;
           this.telephone = data.telephone;
           this.rating = data.rating;
           this.allowsKids = data.allowsKids;
           this.appointments = data.appointments; 
           this.isForMale = data.isForMale;
           this.isForFemale = data.isForFemale;
           this.state = data.state;
           this.address = data.address;
      
}
}
//********************************************************************************************
 module.exports =  Provider();
 
