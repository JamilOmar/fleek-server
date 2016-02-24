//*******************************************************************************************
//Name: providerSchedule DAl
//Description: Base class for connectivity with the MySql Database
//Target : providerSchedule Creation , Administration of providerSchedule
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var providerScheduleModel  = require('models/providerSchedule');
var util = require('util');
var userModel  = require('models/user');
var logger = require('utilities/logger');
//*******************************************************************************************

var providerScheduleDAL = function()
{
  
   providerScheduleDAL.prototype.self = this;
};
  providerScheduleDAL.prototype = new  baseDAL();
//Method to Create providerSchedule
//*******************************************************************************************
providerScheduleDAL.prototype.createProviderSchedule = function(data, resultMethod,connection) {
    data = providerScheduleDAL.prototype.self.mapperModelToSql(data); 
            var createProviderScheduleQuery = "INSERT INTO `chameleon`.`ProviderSchedule` SET ?;";
             providerScheduleDAL.prototype.query(createProviderScheduleQuery,data,function (err,result)
                {
                    logger.log("debug","createProviderSchedule",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//Method to Update providerSchedules
//*******************************************************************************************
providerScheduleDAL.prototype.updateProviderSchedule  = function(data,id, resultMethod,connection) {
     data = providerScheduleDAL.prototype.self.mapperModelToSql(data); 
            var updateProviderScheduleQuery = "UPDATE `chameleon`.`ProviderSchedule` SET ? WHERE ?;";
    console.log(providerScheduleDAL);
             providerScheduleDAL.prototype.queryWithArgument(updateProviderScheduleQuery,data,{ProviderScheduleId:id},function (err,result)
                {
                    logger.log("debug","updateProviderSchedule",data);
                    return resultMethod(err,result);
                },connection);
        };


//Method to Select providerSchedule By Id
//*******************************************************************************************
providerScheduleDAL.prototype.getProviderScheduleById = function(id, resultMethod,connection) {
    var getProviderScheduleByIdQuery ="SELECT providerSchedule.`ProviderScheduleId` ,providerSchedule.`ProviderId` , providerSchedule.`Name` ,providerSchedule.`IsDefault`, providerSchedule.`CreationDate`, providerSchedule.`ModificationDate` ,providerSchedule.`IsActive`, provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl' FROM `chameleon`.`ProviderSchedule` providerSchedule INNER JOIN `User` provider on provider.`UserId` = providerSchedule.`ProviderId`  WHERE providerSchedule.`IsActive` = 1  AND provider.`IsActive` = 1 AND provider.`IsProvider` =1 AND providerSchedule.`ProviderScheduleId` =?";
                providerScheduleDAL.prototype.getByArguments(getProviderScheduleByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getProviderScheduleById" , result);
                    return resultMethod(err,providerScheduleDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};

//Method to deactivate providerSchedule
//*******************************************************************************************
providerScheduleDAL.prototype.deactivateProviderSchedule = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateProviderScheduleQuery = "UPDATE `chameleon`.`ProviderSchedule` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderScheduleId`=?;";
             providerScheduleDAL.prototype.query(deactivateProviderScheduleQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateProviderSchedule",data);
                    return resultMethod(err,providerScheduleDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to select the ProviderSchedule by Provider Id
//*******************************************************************************************
providerScheduleDAL.prototype.getProviderScheduleByProviderId = function(id, resultMethod,connection) {
    var getProviderScheduleByProviderIdQuery ="SELECT providerSchedule.`ProviderScheduleId` ,providerSchedule.`ProviderId` , providerSchedule.`Name` ,providerSchedule.`IsDefault`, providerSchedule.`CreationDate`, providerSchedule.`ModificationDate` ,providerSchedule.`IsActive`, provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl' FROM `chameleon`.`ProviderSchedule` providerSchedule INNER JOIN `User` provider on provider.`UserId` = providerSchedule.`ProviderId`  WHERE providerSchedule.`IsActive` = 1  AND provider.`IsActive` = 1 AND provider.`IsProvider` =1 AND providerSchedule.`ProviderId` =?";
                providerScheduleDAL.prototype.getByArguments(getProviderScheduleByProviderIdQuery,id,function (err,result)
                {
                    logger.log("debug","getProviderScheduleByProviderId",id , result);
                    return resultMethod(err,providerScheduleDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method to select the ProviderSchedule by ProviderSchedule Id and Provider Id
//*******************************************************************************************
providerScheduleDAL.prototype.getProviderScheduleByIdProviderId = function(id, providerId, resultMethod,connection) {
    var getProviderScheduleByIdProviderIdQUery ="SELECT providerSchedule.`ProviderScheduleId` ,providerSchedule.`ProviderId` , providerSchedule.`Name` ,providerSchedule.`IsDefault`, providerSchedule.`CreationDate`, providerSchedule.`ModificationDate` ,providerSchedule.`IsActive`, provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl' FROM `chameleon`.`ProviderSchedule` providerSchedule INNER JOIN `User` provider on provider.`UserId` = providerSchedule.`ProviderId`  WHERE providerSchedule.`IsActive` = 1  AND provider.`IsActive` = 1 AND provider.`IsProvider` =1 AND providerSchedule.`ProviderScheduleId`=? AND providerSchedule.`ProviderId` =?";
                providerScheduleDAL.prototype.getByArguments(getProviderScheduleByIdProviderIdQUery,[id,providerId],function (err,result)
                {
                    logger.log("debug","getProviderScheduleByIdProviderId",id , result);
                    return resultMethod(err,providerScheduleDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method for transform the information from sql to model
//********************************************************************************************
providerScheduleDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data.length >0 )
        {
            data = data[0];
           var providerSchedule  = new providerScheduleModel();
           providerSchedule.id = data.ProviderScheduleId;
           providerSchedule.providerId = data.ProviderId;
           providerSchedule.name = data.Name; 
           providerSchedule.isDefault = data.IsDefault;
           providerSchedule.creationDate = data.CreationDate;
           providerSchedule.modificationDate = data.ModificationDate;
           providerSchedule.isActive = data.IsActive
           providerSchedule.provider = new userModel();
           providerSchedule.provider.basicInformation(data.provider_UserId ,data.provider_Name, data.provider_Lastname , data.provider_Username , data.provider_PictureUrl);
           data = null;
            return providerSchedule;
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


providerScheduleDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var providerScheduleCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
           var data = dataRequested[i];
           var providerSchedule  = new providerScheduleModel();
           providerSchedule.id = data.ProviderScheduleId;
           providerSchedule.providerId = data.ProviderId;
           providerSchedule.name = data.Name; 
           providerSchedule.isDefault = data.IsDefault;
           providerSchedule.creationDate = data.CreationDate;
           providerSchedule.modificationDate = data.ModificationDate;
           providerSchedule.isActive = data.IsActive
           providerSchedule.provider = new userModel();
           providerSchedule.provider.basicInformation(data.provider_UserId ,data.provider_Name, data.provider_Lastname , data.provider_Username , data.provider_PictureUrl);
           data = null;
            return providerSchedule;
                providerScheduleCollection.push(providerSchedule);
            }
            return providerScheduleCollection;
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
providerScheduleDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
        var mysqlModel  ={};
        if(data.hasOwnProperty("id") && data.id != undefined)
        mysqlModel.ProviderScheduleId  = data.id;
        if(data.hasOwnProperty("providerId")  && data.providerId != undefined)
        mysqlModel.ProviderId = data.providerId;
        if(data.hasOwnProperty("name")  && data.name != undefined)
        mysqlModel.Name = data.name;
        if(data.hasOwnProperty("isDefault")  && data.isDefault != undefined)
        mysqlModel.IsDefault = data.isDefault;
        if(data.hasOwnProperty("creationDate")  && data.creationDate != undefined)
        mysqlModel.CreationDate = data.creationDate;
        if(data.hasOwnProperty("modificationDate")  && data.modificationDate != undefined)
        mysqlModel.ModificationDate = data.modificationDate;
        if(data.hasOwnProperty("isActive")  && data.isActive != undefined)
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
module.exports =  providerScheduleDAL;