//*******************************************************************************************
//Name: Provider DAl
//Description: Base class for connectivity with the MySql Database
//Target : Provider Creation , Administration of Providers
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var ProviderModel  = require('models/Provider');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var ProviderDAL = function()
{
  
   ProviderDAL.prototype.self = this;
};
  ProviderDAL.prototype = new  baseDAL();
//Method to Create Provider
//*******************************************************************************************
ProviderDAL.prototype.createProvider = function(data, resultMethod,connection) {
    data = ProviderDAL.prototype.self.mapperModelToSql(data); 
            var createProviderQuery = "INSERT INTO `chameleon`.`Provider` SET ?;";
             ProviderDAL.prototype.query(createProviderQuery,data,function (err,result)
                {
                    logger.log("debug","createProvider",result);
                    return resultMethod(err,result );
                },connection);
        };
//Method to Update Providers
//*******************************************************************************************
ProviderDAL.prototype.updateProvider  = function(data,id, resultMethod,connection) {
     data = ProviderDAL.prototype.self.mapperModelToSql(data); 
            var updateProviderQuery = "UPDATE `chameleon`.`Provider` SET ? WHERE ?;";
             ProviderDAL.prototype.queryWithArgument(updateProviderQuery,data,{ProviderId: id },function (err,result)
                {
                    logger.log("debug","updateProviderQuery",data);
                    return resultMethod(err,result);
                },connection);
        };



//Method to deactivate Provider
//*******************************************************************************************
ProviderDAL.prototype.deactivateProvider = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id
               ];
           var deactivateProviderQuery = "UPDATE `chameleon`.`Provider` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderId`=?;";
             ProviderDAL.prototype.query(deactivateProviderQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateProvider",data);
                    return resultMethod(err,ProviderDAL.prototype.nonQueryResult(result));
                },connection);
};


//Method to select the Provider by Provider Id
//*******************************************************************************************
ProviderDAL.prototype.getProviderById = function(providerId, resultMethod,connection) {
    var getProviderByProviderIdQuery ="SELECT provider.`ProviderId`, provider.`Telephone` , provider.`Rating` , provider.`AllowsKids` , provider.`Appointments` , provider.`IsForMale` , provider.`IsForFemale` , provider.`State` , provider.`Latitude` , provider.`Longitude` , provider.`CreationDate` , provider.`ModificationDate` , provider.`IsActive` FROM `Provider` provider INNER JOIN User user on user.`UserId` = provider.`ProviderId` where provider.`IsActive` = 1 AND user.`IsActive` =1 AND provider.`State` <> -1 AND  provider.`ProviderId` =?";
                ProviderDAL.prototype.getByArguments(getProviderByProviderIdQuery,providerId,function (err,result)
                {
                    
                    logger.log("debug","getProviderByProviderId",providerId , result);
                    return resultMethod(err,ProviderDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};

//Method for transform the information from sql to model
//********************************************************************************************
ProviderDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data[0] !=null )
        {
            data = data[0];
            
            
       
           var provider  = new ProviderModel();
           provider.id = data.Id;
           provider.latitude = data.Latitude;
           provider.longitude = data.Longitude;
           provider.telephone = data.Telephone;
           provider.rating = data.Rating;
           provider.allowsKids = data.AllowsKids;
           provider.appointments = data.Appointments; 
           provider.isForMale = data.IsForMale;
           provider.isForFemale = data.IsForFemale;
           provider.state = data.State;
           provider.creationDate = data.CreationDate;
           provider.modificationDate = data.ModificationDate;
           provider.isActive = data.IsActive
           data = null;
            return provider;
        }
        else
        {
            return {};
        }
   
    }
    catch(err)
    {
         logger.log("error","mapperSqlToModel",err);
        return null;
    }
    
        

}

//Method for transform the information from sql to  a model Collection
//********************************************************************************************
ProviderDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var providerCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var provider  = new ProviderModel();
                provider.id = data.Id;
                provider.latitude = data.Latitude;
                provider.longitude = data.Longitude;
                provider.telephone = data.Telephone;
                provider.rating = data.Rating;
                provider.allowsKids = data.AllowsKids;
                provider.appointments = data.Appointments; 
                provider.isForMale = data.IsForMale;
                provider.isForFemale = data.IsForFemale;
                provider.state = data.State;
                provider.creationDate = data.CreationDate;
                provider.modificationDate = data.ModificationDate;
                provider.isActive = data.IsActive
                data = null;
                providerCollection.push(provider);
              
            }
            return providerCollection;
        }
        else
        {
            return {};
        }
   
    }
    catch(err)
    {
         logger.log("error","mapperSqlToModel",err);
        return null;
    }
    
        

}
//Method for transform the information from model to sql
//********************************************************************************************
ProviderDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id") && data.id != undefined)
    mysqlModel.ProviderId  = data.id;
    if(data.hasOwnProperty("latitude") && data.latitude != undefined)
    mysqlModel.Latitude = data.latitude;
    if(data.hasOwnProperty("longitude") && data.longitude != undefined)
    mysqlModel.Longitude = data.longitude;
    if(data.hasOwnProperty("telephone") && data.telephone != undefined)
    mysqlModel.Telephone = data.telephone;
    if(data.hasOwnProperty("rating") && data.rating != undefined)
    mysqlModel.Rating = data.rating;
    if(data.hasOwnProperty("allowsKids") && data.allowsKids != undefined)
    mysqlModel.AllowsKids = data.allowsKids;
    if(data.hasOwnProperty("appointments") && data.appointments != undefined)
    mysqlModel.Appointments = data.appointments;
    if(data.hasOwnProperty("isForMale") && data.isForMale != undefined)
    mysqlModel.IsForMale = data.isForMale;
    if(data.hasOwnProperty("isForFemale") && data.isForFemale != undefined)
    mysqlModel.IsForFemale = data.isForFemale;
    if(data.hasOwnProperty("state") && data.state != undefined)
    mysqlModel.State = data.state;
    if(data.hasOwnProperty("creationDate") && data.creationDate != undefined)
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate") && data.modificationDate != undefined)
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive")&& data.isActive != undefined)
    mysqlModel.IsActive = data.isActive;
     logger.log("debug","mapperModelToSql",mysqlModel);
      return mysqlModel;    
    }
    catch (err)
    {
         logger.log("error","mapperModelToSql",err);
        return null;
    }
  
}

//********************************************************************************************
module.exports =  ProviderDAL;