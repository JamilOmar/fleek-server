//*******************************************************************************************
//Name: ProviderService DAl
//Description: Base class for connectivity with the MySql Database
//Target : ProviderService Creation , Administration of ProviderService
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var providerServiceModel  = require('models/providerService');
var providerServiceServiceQueryModel  = require('models/providerServiceServiceQuery');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var providerServiceDAL = function()
{
  
   providerServiceDAL.prototype.self = this;
};
  providerServiceDAL.prototype = new  baseDAL();
//Method to Create providerService
//*******************************************************************************************
providerServiceDAL.prototype.createProviderService = function(data, resultMethod,connection) {
    data = providerServiceDAL.prototype.self.mapperModelToSql(data); 
            var createProviderServiceQuery = "INSERT INTO `chameleon`.`ProviderService` SET ?;";
             providerServiceDAL.prototype.query(createProviderServiceQuery,data,function (err,result)
                {
                    logger.log("debug","createProviderService",result);
                    return resultMethod(err,result );
                },connection);
        };
//Method to Update ProviderServices
//*******************************************************************************************
providerServiceDAL.prototype.updateProviderService  = function(data,providerId, serviceId, resultMethod,connection) {
     data = providerServiceDAL.prototype.self.mapperModelToSql(data); 
   
            var updateProviderServiceQuery = "UPDATE `chameleon`.`ProviderService` SET ? WHERE ? AND ?;";
             providerServiceDAL.prototype.queryWithArgument(updateProviderServiceQuery,data,[{ProviderId:providerId }, {ServiceId:serviceId}],function (err,result)
                {
                    logger.log("debug","updateProviderServiceQuery",data);
                    return resultMethod(err,result);
                },connection);
        };



//Method to deactivate providerService
//*******************************************************************************************
providerServiceDAL.prototype.deactivateProviderService = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.providerId,
                      data.serviceId
               ];
           var deactivateProviderServiceQuery = "UPDATE `chameleon`.`ProviderService` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderId`=? AND `ServiceId`=?;";
             providerServiceDAL.prototype.query(deactivateProviderServiceQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateProviderService",data);
                    return resultMethod(err,providerServiceDAL.prototype.nonQueryResult(result));
                },connection);
};

//Method to select the  Active/NonActive providerService by Provider Id Service Id 
//*******************************************************************************************
providerServiceDAL.prototype.getProviderServiceByProviderIdServiceIdActiveNonActive = function(providerId, serviceId, resultMethod,connection) {
    var getProviderServiceByProviderIdServiceIdActiveNonActiveQuery ="SELECT providerService.`ProviderId` ,providerService.`ServiceId`,serviceLocal.`Name`  , providerService.`CurrencyCode`, providerService.`Price` , providerService.`IsCustom` , providerService.`CustomName` , providerService.`AverageTimePerSession` , providerService.`ModificationDate` , providerService.`CreationDate` , providerService.`IsActive`  FROM `chameleon`.`ProviderService` providerService  INNER JOIN `chameleon`.`Service` service ON providerService.`ServiceId` = service.`ServiceId` INNER JOIN `Service_Local` serviceLocal ON service.`ServiceId` = serviceLocal.`ServiceId` INNER JOIN `User` provider ON provider.`UserId` = providerService.`ProviderId` WHERE service.`IsActive` =1  AND serviceLocal.`CultureCode` =  provider.`CultureCode` AND providerService.`ProviderId` =? AND  providerService.`ServiceId` =? ";
                providerServiceDAL.prototype.getByArguments(getProviderServiceByProviderIdServiceIdActiveNonActiveQuery,[providerId,serviceId],function (err,result)
                {
                    
                    logger.log("debug","getProviderServiceByProviderIdServiceIdActiveNonActive",[providerId,serviceId] , result);
                    return resultMethod(err,providerServiceDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to select the ProviderService by Provider Id Service Id 
//*******************************************************************************************
providerServiceDAL.prototype.getProviderServiceByProviderIdServiceId = function(providerId, serviceId, resultMethod,connection) {
    var getProviderServiceByProviderIdServiceIdQuery ="SELECT providerService.`ProviderId` ,providerService.`ServiceId`,serviceLocal.`Name`  , providerService.`CurrencyCode`, providerService.`Price` , providerService.`IsCustom` , providerService.`CustomName` , providerService.`AverageTimePerSession` , providerService.`ModificationDate` , providerService.`CreationDate` , providerService.`IsActive`  FROM `chameleon`.`ProviderService` providerService  INNER JOIN `chameleon`.`Service` service ON providerService.`ServiceId` = service.`ServiceId` INNER JOIN `Service_Local` serviceLocal ON service.`ServiceId` = serviceLocal.`ServiceId` INNER JOIN `User` provider ON provider.`UserId` = providerService.`ProviderId` WHERE service.`IsActive` =1 AND providerService.`IsActive` =1 AND serviceLocal.`CultureCode` =  provider.`CultureCode` AND providerService.`ProviderId` =? AND  providerService.`ServiceId` =? ";
                providerServiceDAL.prototype.getByArguments(getProviderServiceByProviderIdServiceIdQuery,[providerId,serviceId],function (err,result)
                {
                    
                    logger.log("debug","getProviderServiceByProviderIdServiceId",[providerId,serviceId] , result);
                    return resultMethod(err,providerServiceDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to select the ProviderService by Provider Id
//*******************************************************************************************
providerServiceDAL.prototype.getProviderServiceByProviderId = function(providerId, resultMethod,connection) {
        var getProviderServiceByProviderIdQuery ="SELECT providerService.`ProviderId` ,providerService.`ServiceId`,serviceLocal.`Name`  , providerService.`CurrencyCode`, providerService.`Price` , providerService.`IsCustom` , providerService.`CustomName` , providerService.`AverageTimePerSession` , providerService.`ModificationDate` , providerService.`CreationDate` , providerService.`IsActive`  FROM `chameleon`.`ProviderService` providerService  INNER JOIN `chameleon`.`Service` service ON providerService.`ServiceId` = service.`ServiceId` INNER JOIN `Service_Local` serviceLocal ON service.`ServiceId` = serviceLocal.`ServiceId` INNER JOIN `User` provider ON provider.`UserId` = providerService.`ProviderId` WHERE service.`IsActive` =1 AND providerService.`IsActive` =1  AND serviceLocal.`CultureCode` =  provider.`CultureCode` AND providerService.`ProviderId` =? ORDER BY serviceLocal.`Name`";
                providerServiceDAL.prototype.getByArguments(getProviderServiceByProviderIdQuery,providerId,function (err,result)
                {
                    
                    logger.log("debug","getProviderServiceByProviderId",providerId , result);
                    return resultMethod(err,providerServiceDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method to select the ProviderServiceQuery by Provider Id , Service Type and Culture
//*******************************************************************************************
providerServiceDAL.prototype.getProviderServiceByProviderIdTypeId = function(providerId,serviceTypeId,cultureCode, resultMethod,connection) {
        var getProviderServiceByProviderIdTypeIdQuery ="SELECT service.`ServiceId` , serviceLocal.`Name` , service.Type  , IFNULL( providerService.`ProviderId`,0) >0 Exist FROM `Service` service  LEFT JOIN (SELECT  providerService.ProviderId , providerService.`ServiceId` FROM `ProviderService` providerService   WHERE providerService.`ProviderId` =? AND providerService.`IsActive`=1) providerService ON providerService.`ServiceId` = service.`ServiceId` INNER JOIN `ServiceType` serviceType ON serviceType.`ServiceTypeId` = service.`Type` INNER JOIN `Service_Local` serviceLocal on serviceLocal.`ServiceId` = service.`ServiceId`  INNER JOIN `Culture` culture on culture.`CultureCode` = serviceLocal.`CultureCode`  WHERE service.`IsActive` =1  AND serviceType.`IsActive` =1 AND culture.`IsActive`=1  AND serviceType.`ServiceTypeId`=? AND culture.`CultureCode` =?  ORDER BY serviceLocal.Name";
                providerServiceDAL.prototype.getByArguments(getProviderServiceByProviderIdTypeIdQuery,[providerId,serviceTypeId,cultureCode],function (err,result)
                {
                    
                    logger.log("debug","getProviderServiceByProviderIdTypeIdQuery",providerId , result);
                    return resultMethod(err,providerServiceDAL.prototype.self.mapperSqlToModelCollectionServiceQuery(result));
                },connection);  
};
//Method for transform the information from sql to model
//********************************************************************************************
providerServiceDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data[0] !=null )
        {
            data = data[0];
            
            
       
           var providerService  = new providerServiceModel();
           providerService.providerId = data.ProviderId;
           providerService.serviceId = data.ServiceId;
           providerService.name = data.Name;
           providerService.currencyCode = data.CurrencyCode;
           providerService.customName =  data.CustomName;
           providerService.price = data.Price;
           providerService.averageTimePerSession = data.AverageTimePerSession;
           providerService.isCustom = data.isCustom;
           providerService.creationDate = data.CreationDate;
           providerService.modificationDate = data.ModificationDate;
           providerService.isActive = data.IsActive;

           data = null;
            return providerService;
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
providerServiceDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var providerServiceCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var providerService  = new providerServiceModel();
                providerService.providerId = data.ProviderId;
                providerService.serviceId = data.ServiceId;
                providerService.name = data.Name;
                providerService.currencyCode = data.CurrencyCode;
                providerService.customName =  data.CustomName;
                providerService.price = data.Price;
                providerService.averageTimePerSession = data.AverageTimePerSession;
                providerService.isCustom = data.isCustom;
                providerService.creationDate = data.CreationDate;
                providerService.modificationDate = data.ModificationDate;
                providerService.isActive = data.IsActive;
                data = null;
                providerServiceCollection.push(providerService);
              
            }
            return providerServiceCollection;
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
//Method for transform the information from sql to  a model Collection for ProviderService and Service
//********************************************************************************************
providerServiceDAL.prototype.mapperSqlToModelCollectionServiceQuery = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var providerServiceServiceQueryCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var providerServiceServiceQuery  = new providerServiceServiceQueryModel();
                providerServiceServiceQuery.serviceId = data.ServiceId;
                providerServiceServiceQuery.name = data.Name;
                providerServiceServiceQuery.type = data.Type;
                providerServiceServiceQuery.exist =  data.Exist;
                data = null;
                providerServiceServiceQueryCollection.push(providerServiceServiceQuery);
              
            }
            return providerServiceServiceQueryCollection;
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
providerServiceDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("providerId") && data.providerId !== undefined)
    mysqlModel.ProviderId  = data.providerId;
    if(data.hasOwnProperty("serviceId") && data.serviceId !== undefined)
    mysqlModel.ServiceId = data.serviceId;
    if(data.hasOwnProperty("currencyCode") && data.currencyCode !== undefined)
    mysqlModel.CurrencyCode = data.currencyCode;
    if(data.hasOwnProperty("customName") && data.customName !== undefined)
    mysqlModel.CustomName = data.customName;
    if(data.hasOwnProperty("price") && data.price !== undefined)
    mysqlModel.Price = data.price;
    if(data.hasOwnProperty("averageTimePerSession") && data.averageTimePerSession !== undefined)
    mysqlModel.AverageTimePerSession = data.averageTimePerSession;
    if(data.hasOwnProperty("isCustom") && data.isCustom !== undefined)
    mysqlModel.IsCustom = data.isCustom;
    if(data.hasOwnProperty("creationDate") && data.creationDate !== undefined)
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate") && data.modificationDate !== undefined)
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive")&& data.isActive !== undefined)
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
module.exports =  providerServiceDAL;