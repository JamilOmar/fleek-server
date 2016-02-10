//*******************************************************************************************
//Name: providerScheduleException DAl
//Description: Base class for connectivity with the MySql Database
//Target : providerScheduleException Creation , Administration of providerScheduleException
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var providerScheduleExceptionModel  = require('models/providerScheduleException');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var providerScheduleExceptionDAL = function()
{
  
   providerScheduleExceptionDAL.prototype.self = this;
};
  providerScheduleExceptionDAL.prototype = new  baseDAL();
//Method to Create providerScheduleException
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.createProviderScheduleException = function(data, resultMethod,connection) {
    data = providerScheduleExceptionDAL.prototype.self.mapperModelToSql(data); 
            var createProviderScheduleExceptionQuery = "INSERT INTO `chameleon`.`ProviderScheduleException` SET ?;";
             providerScheduleExceptionDAL.prototype.query(createProviderScheduleExceptionQuery,data,function (err,result)
                {
                    logger.log("debug","createProviderScheduleException",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//Method to Update providerScheduleDays
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.updateProviderScheduleException  = function(data,id, resultMethod,connection) {
     data = providerScheduleExceptionDAL.prototype.self.mapperModelToSql(data); 
            var updateProviderScheduleExceptionQuery = "UPDATE `chameleon`.`ProviderScheduleException` SET ? WHERE ?;";
    console.log(providerScheduleExceptionDAL);
             providerScheduleExceptionDAL.prototype.queryWithArgument(updateProviderScheduleExceptionQuery,data,{ProviderScheduleExceptionId:id},function (err,result)
                {
                    logger.log("debug","updateProviderScheduleException",data);
                    return resultMethod(err,result);
                },connection);
        };


//Method to Select providerScheduleException By Schedule Id , Year  And Month 
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay= function(id,year,month,day, resultMethod,connection) {
    var getProviderScheduleExceptionByProviderScheduleIdYearMonthDayQuery ="SELECT * FROM `chameleon`.`providerScheduleException` WHERE `ProviderScheduleId` =? AND `IsActive` = 1 AND YEAR(`Date`) = ? AND MONTH(`Date`) = ? AND DAY(`Date`) = ?";
                providerScheduleExceptionDAL.prototype.getByArguments(getProviderScheduleExceptionByProviderScheduleIdYearMonthDayQuery,[id,year,month,day],function (err,result)
                {
                    logger.log("debug","getProviderScheduleExceptionByProviderScheduleIdYearMonthDay" , result);
                    return resultMethod(err,providerScheduleExceptionDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method to Select providerScheduleException By Schedule Id, Provider , Year  And Month 
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.getProviderScheduleExceptionByProviderScheduleIdProviderIdYearMonthDay= function(id,year,month,day, resultMethod,connection) {
    var getProviderScheduleExceptionByProviderScheduleIdProviderIdYearMonthDayQuery ="SELECT pse.* FROM `chameleon`.`providerScheduleException` pse INNER JOIN `ProviderSchedule` ps ON ps.`ProviderScheduleId` = pse.`ProviderScheduleId` INNER JOIN `User` u on u.`UserId` = ps.`ProviderId`  WHERE ps.ProviderScheduleId` =? AND u.UserId =?  AND YEAR(pse.`Date`) = ? AND MONTH(pse.`Date`) = ? AND DAY(pse.`Date`) = ?  AND pse.`IsActive` = 1  AND ps.`IsActive` =1 AND u.`IsActive` =1";
                providerScheduleExceptionDAL.prototype.getByArguments(getProviderScheduleExceptionByProviderScheduleIdProviderIdYearMonthDayQuery,[id,year,month,day],function (err,result)
                {
                    logger.log("debug","getProviderScheduleExceptionByProviderScheduleIdProviderIdYearMonthDay" , result);
                    return resultMethod(err,providerScheduleExceptionDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method to Select providerScheduleException By Id
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.getProviderScheduleExceptionById = function(id, resultMethod,connection) {
    var getProviderScheduleExceptionByIdQuery ="SELECT * FROM `chameleon`.`providerScheduleException` WHERE `IsActive` = 1 AND `ProviderScheduleExceptionId` =?";
                providerScheduleExceptionDAL.prototype.getByArguments(getProviderScheduleExceptionByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getProviderScheduleExceptionById" , result);
                    return resultMethod(err,providerScheduleExceptionDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to deactivate providerScheduleException
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.deactivateProviderScheduleException = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateProviderScheduleExceptionQuery = "UPDATE `chameleon`.`providerScheduleException` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderScheduleExceptionId`=?;";
             providerScheduleExceptionDAL.prototype.query(deactivateProviderScheduleExceptionQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateProviderScheduleException",data);
                    return resultMethod(err,providerScheduleExceptionDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to select the providerScheduleException by Provider Id
//*******************************************************************************************
providerScheduleExceptionDAL.prototype.getProviderScheduleExceptionByProviderScheduleId = function(id, resultMethod,connection) {
    var getProviderScheduleExceptionByProviderScheduleIdQuery ="SELECT pse.* FROM `providerScheduleException` pse INNER JOIN `ProviderSchedule` ps on pse.`ProviderScheduleId` = ps.`ProviderScheduleId` WHERE ps.`IsActive` =1 AND pse.`IsActive` =1 AND ps.`ProviderScheduleId` = ? ORDER BY pse.`Date`";
                providerScheduleExceptionDAL.prototype.getByArguments(getProviderScheduleExceptionByProviderScheduleIdQuery,id,function (err,result)
                {
                    logger.log("debug","getProviderScheduleExceptionByProviderScheduleId",id , result);
                    return resultMethod(err,providerScheduleExceptionDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method for transform the information from sql to model
//********************************************************************************************
providerScheduleExceptionDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data[0] !=null )
        {
            data = data[0];
            
            
       
           var providerScheduleException  = new providerScheduleExceptionModel();
           providerScheduleException.id = data.ProviderScheduleExceptionId;
           providerScheduleException.providerScheduleId = data.ProviderScheduleId;
           providerScheduleException.date = data.Date; 
           providerScheduleException.description = data.Description;
           providerScheduleException.creationDate = data.CreationDate;
           providerScheduleException.modificationDate = data.ModificationDate;
           providerScheduleException.isActive = data.IsActive
           data = null;
            return providerScheduleException;
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


providerScheduleExceptionDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var providerScheduleExceptionCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var providerScheduleException  = new providerScheduleExceptionModel();
                providerScheduleException.id = data.ProviderScheduleExceptionId;
                providerScheduleException.providerScheduleId = data.ProviderScheduleId;
                providerScheduleException.date = data.Date; 
                providerScheduleException.description = data.Description;
                providerScheduleException.creationDate = data.CreationDate;
                providerScheduleException.modificationDate = data.ModificationDate;
                providerScheduleException.isActive = data.IsActive
                data = null;
                providerScheduleExceptionCollection.push(providerScheduleException);
              
            }
            return providerScheduleExceptionCollection;
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
providerScheduleExceptionDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id"))
    mysqlModel.ProviderScheduleExceptionId  = data.id;
    if(data.hasOwnProperty("providerScheduleId"))
    mysqlModel.ProviderScheduleId = data.providerScheduleId;
    if(data.hasOwnProperty("date"))
    mysqlModel.Date = data.date;
    if(data.hasOwnProperty("description"))
    mysqlModel.Description = data.description;
    if(data.hasOwnProperty("creationDate"))
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate"))
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive"))
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
module.exports =  providerScheduleExceptionDAL;