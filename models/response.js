var response = function()
        {
          this.data =null;
          this.responseCode =null;
         
        };
response.prototype.createResponse =function(logicData,code)
{
    this.data =logicData;
    this.responseCode =code;
}
//********************************************************************************************
module.exports =  response;