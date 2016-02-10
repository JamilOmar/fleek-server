//*******************************************************************************************
//Name: User Friend DAl
//Description: Base class for connectivity with the MySql Database
//Target : Administration of Enterprise Providers
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var enterpriseProviderModel  = require('models/enterpriseProvider');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var enterpriseProviderDAL = function()
{
  
   enterpriseProviderDAL.prototype.self = this;
};
  enterpriseProviderDAL.prototype = new baseDAL();



//get enterprise by provider and enterprise Id
//*******************************************************************************************
enterpriseProviderDAL.prototype.getEnterpriseProviderByProviderAndEnterpriseId = function(providerId,enterpriseId ,resultMethod,connection) {
        var getParameters = 
               [
                  providerId,enterpriseId
               ];
    var getEnterpriseProviderByProviderAndEnterpriseIdQuery ="SELECT * FROM `chameleon`.`EnterpriseProvider` WHERE  `IsActive` = 1 AND `ProviderId` =? AND `EnterpriseId` =?";
                enterpriseProviderDAL.prototype.getByArguments(getEnterpriseProviderByProviderAndEnterpriseIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getEnterpriseProviderByProviderAndEnterpriseId" , result);
                    return resultMethod(err,enterpriseProviderDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//get enterprise by Id
//*******************************************************************************************
enterpriseProviderDAL.prototype.getEnterpriseProviderById = function(id,resultMethod,connection) {
        var getParameters = 
               [
                  id
               ];
    var getEnterpriseProviderByIdQuery ="SELECT * FROM `chameleon`.`EnterpriseProvider` WHERE  `IsActive` = 1 AND  `EnterpriseProviderId` =?";
                enterpriseProviderDAL.prototype.getByArguments(getEnterpriseProviderByIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getEnterpriseProviderByIdQuery" , result);
                    return resultMethod(err,enterpriseProviderDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//get all enterprises of a provider
//*******************************************************************************************
enterpriseProviderDAL.prototype.getEnterpriseProviderByProviderId = function(providerId,resultMethod,connection) {
        var getParameters = 
               [
                  providerId
               ];
    var getEnterpriseProviderByProviderIdQuery ="SELECT * FROM `chameleon`.`EnterpriseProvider` WHERE  `IsActive` = 1 AND `ProviderId` = ?";
                enterpriseProviderDAL.prototype.getByArguments(getEnterpriseProviderByProviderIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getEnterpriseProviderByProviderId" , result);
                    return resultMethod(err,enterpriseProviderDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//create
//*******************************************************************************************
enterpriseProviderDAL.prototype.addEnterpriseProvider = function(data, resultMethod,connection) {
     data = enterpriseProviderDAL.prototype.self.mapperModelToSql(data);
      var addEnterpriseProviderQuery = "INSERT INTO `chameleon`.`EnterpriseProvider` SET ?;";
             enterpriseProviderDAL.prototype.query(addEnterpriseProviderQuery,data,function (err,result)
                {
                    logger.log("debug","addEnterpriseProvider",data);
                    return resultMethod(err,enterpriseProviderDAL.prototype.nonQueryResult(result));
                },connection);
};
//deactivate
//*******************************************************************************************
enterpriseProviderDAL.prototype.deactivateEnterpriseProvider = function(data, resultMethod,connection) {
     var disableParameters = 
               [
                   data.modificationDate, data.id
               ];
      var deactivateEnterpriseProviderQuery = "UPDATE `chameleon`.`EnterpriseProvider` SET `ModificationDate`=?,`IsActive`=0 WHERE `EnterpriseProviderId`=?;";
             enterpriseProviderDAL.prototype.query(deactivateEnterpriseProviderQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateEnterpriseProvider",data);
                    return resultMethod(err,enterpriseProviderDAL.prototype.nonQueryResult(result));
                },connection);
};
//remove enterprise providers by provider and enterprise id
//*******************************************************************************************
enterpriseProviderDAL.prototype.removeEnterpriseProviderByProviderAndEnterpriseId = function(data, resultMethod,connection) {
     var disableParameters = 
               [
                   data.modificationDate, data.enterpriseId, data.providerId
               ];
      var removeEnterpriseProviderByProviderAndEnterpriseIdQuery = "UPDATE `chameleon`.`EnterpriseProvider` SET `ModificationDate`=?,`IsActive`=0 WHERE `EnterpriseId`=? AND `ProviderId`=?;";
             enterpriseProviderDAL.prototype.query(removeEnterpriseProviderByProviderAndEnterpriseIdQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","removeEnterpriseProviderByProviderAndEnterpriseId",data);
                    return resultMethod(err,enterpriseProviderDAL.prototype.nonQueryResult(result));
                },connection);
};


//Method for transform the information from sql to model
//********************************************************************************************
enterpriseProviderDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
       if(data != null)
        {
            data = data[0];
            var enterpriseProvider  = new enterpriseProviderModel();
            enterpriseProvider.id = data.id;
            enterpriseProvider.providerId = data.CustomerId;
            enterpriseProvider.enterpriseId = data.FriendId;
            enterpriseProvider.isMainUser = data.IsMainUser;
            enterpriseProvider.creationDate = data.CreationDate;
            enterpriseProvider.modificationDate = data.ModificationDate;
            enterpriseProvider.isActive = data.IsActive
            return enterpriseProvider;
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


    enterpriseProviderDAL.prototype.mapperSqlToModelCollection = function(data)
{
    try
    {
        
        if(data != null)
        {
            var enterpriseProviderCollection = [];
            for (var i = 0 ; i < data.length ; i++)
            {
                data = data[i];
  
            var enterpriseProvider  = new enterpriseProviderModel();
            enterpriseProvider.id = data.id;
            enterpriseProvider.providerId = data.CustomerId;
            enterpriseProvider.enterpriseId = data.FriendId;
            enterpriseProvider.isMainUser = data.IsMainUser;
            enterpriseProvider.creationDate = data.CreationDate;
            enterpriseProvider.modificationDate = data.ModificationDate;
            enterpriseProvider.isActive = data.IsActive
            enterpriseProviderCollection.push(enterpriseProvider);
            }
            return enterpriseProviderCollection;
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
enterpriseProviderDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={
    EnterpriseProviderId : data.id,    
    ProviderId  : data.providerId,
    EnterpriseId : data.enterpriseId,
    IsMainUser : data.isMainUser,
    CreationDate : data.creationDate,
    ModificationDate : data.modificationDate,
    IsActive : data.isActive
    };
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
module.exports = enterpriseProviderDAL;