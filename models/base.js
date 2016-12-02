

class Base{

constructor()
{
    this.creationDate = null;
    this.modificationDate = null;
    this.isActive = false; 
};
//******************************************************    
deactivate(){
    this.modificationDate = new Date();
    this.isActive =false;

};
//******************************************************
refreshModification()
{
    this.modificationDate =new Date();
};
//******************************************************
create()
{
    var date = new Date();
    this.creationDate = date;
    this.modificationDate = date;
    this.isActive =true;
}
//******************************************************
IsEmpty()
{
     return  this.id == null;
}
}
//********************************************************************************************
module.exports =  Base;