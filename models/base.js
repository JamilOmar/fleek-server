var base = function()
        {
           this.creationDate = null;
           this.modificationDate = null;
           this.isActive = false; 
        };
//******************************************************
base.prototype.deactivate = function()
{
    this.modificationDate = new Date();
    this.isActive =false;
}
//******************************************************
base.prototype.refreshModification = function()
{
    this.modificationDate =new Date();
}
//******************************************************
base.prototype.create = function()
{
    var date = new Date();
    this.creationDate = date;
    this.modificationDate = date;
    this.isActive =true;
}
//******************************************************
base.prototype.IsEmpty =function()
{
     return  Object.keys(this).length >0;
}
//********************************************************************************************
        module.exports =  base;