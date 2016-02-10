//*******************************************************************************************
//Name: providerScheduleDay DAl
//Description: Base class for connectivity with the MySql Database
//Target : providerScheduleDay Creation , Administration of providerScheduleDay
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var providerScheduleDayModel  = require('models/providerScheduleDay');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var providerScheduleDayDAL = function()
{
  
   providerScheduleDayDAL.prototype.self = this;
};
  providerScheduleDayDAL.prototype = new  baseDAL();
//Method to Create providerScheduleDay
//*******************************************************************************************
providerScheduleDayDAL.prototype.createProviderScheduleDay = function(data, resultMethod,connection) {
    data = providerScheduleDayDAL.prototype.self.mapperModelToSql(data); 
            var createProviderScheduleDayQuery = "INSERT INTO `chameleon`.`ProviderScheduleDay` SET ?;";
             providerScheduleDayDAL.prototype.query(createProviderScheduleDayQuery,data,function (err,result)
                {
                    logger.log("debug","createProviderScheduleDay",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//Method to Update providerScheduleDays
//*******************************************************************************************
providerScheduleDayDAL.prototype.updateProviderScheduleDay  = function(data,id, resultMethod,connection) {
     data = providerScheduleDayDAL.prototype.self.mapperModelToSql(data); 
            var updateProviderScheduleDayQuery = "UPDATE `chameleon`.`ProviderScheduleDay` SET ? WHERE ?;";
    console.log(providerScheduleDayDAL);
             providerScheduleDayDAL.prototype.queryWithArgument(updateProviderScheduleDayQuery,data,{ProviderScheduleDayId:id},function (err,result)
                {
                    logger.log("debug","updateProviderScheduleDay",data);
                    return resultMethod(err,result);
                },connection);
        };
//Method to Select providerScheduleDay By Schedule Id and Day of the week
//*******************************************************************************************
providerScheduleDayDAL.prototype.getProviderScheduleDayByProviderScheduleIdDayOfWeek = function(id,dayOfWeek, resultMethod,connection) {
    var getProviderScheduleDayByProviderScheduleIdDayOfWeekQuery ="SELECT providerScheduleDay.`ProviderScheduleDayId` , providerScheduleDay.`ProviderScheduleId` , providerScheduleDay.`StartTime`, providerScheduleDay.`DayOfWeek` ,providerScheduleDay.`EndTime` , providerScheduleDay.`CreationDate` ,providerScheduleDay.`ModificationDate` ,providerScheduleDay.`IsActive` FROM `chameleon`.`ProviderScheduleDay` providerScheduleDay INNER JOIN `ProviderSchedule` providerSchedule on providerScheduleDay.`ProviderScheduleId` = providerSchedule.`ProviderScheduleId` WHERE providerScheduleDay.`ProviderScheduleDayId` =? AND providerScheduleDay.`IsActive` = 1 AND providerScheduleDay.`DayOfWeek` = ? AND providerSchedule.`IsActive` =1";
                providerScheduleDayDAL.prototype.getByArguments(getProviderScheduleDayByProviderScheduleIdDayOfWeekQuery,[id,dayOfWeek],function (err,result)
                {
                    logger.log("debug","getProviderScheduleDayByProviderScheduleIdDayOfWeek" , result);
                    return resultMethod(err,providerScheduleDayDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};


//Method to Select providerScheduleDay By Id
//*******************************************************************************************
providerScheduleDayDAL.prototype.getProviderScheduleDayById = function(id, resultMethod,connection) {
    var getProviderScheduleDayByIdQuery ="SELECT providerScheduleDay.`ProviderScheduleDayId` , providerScheduleDay.`ProviderScheduleId` , providerScheduleDay.`StartTime`, providerScheduleDay.`DayOfWeek` ,providerScheduleDay.`EndTime` , providerScheduleDay.`CreationDate` ,providerScheduleDay.`ModificationDate` ,providerScheduleDay.`IsActive` FROM `chameleon`.`ProviderScheduleDay` providerScheduleDay INNER JOIN `ProviderSchedule` providerSchedule on providerScheduleDay.`ProviderScheduleId` = providerSchedule.`ProviderScheduleId` WHERE providerScheduleDay.`ProviderScheduleDayId` =? AND providerScheduleDay.`IsActive` = 1  AND providerSchedule.`IsActive` =1";
                providerScheduleDayDAL.prototype.getByArguments(getProviderScheduleDayByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getProviderScheduleDayById" , result);
                    return resultMethod(err,providerScheduleDayDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to deactivate providerScheduleDay
//*******************************************************************************************
providerScheduleDayDAL.prototype.deactivateProviderScheduleDay = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateProviderScheduleDayQuery = "UPDATE `chameleon`.`ProviderScheduleDay` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderScheduleDayId`=?;";
             providerScheduleDayDAL.prototype.query(deactivateProviderScheduleDayQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateProviderScheduleDay",data);
                    return resultMethod(err,providerScheduleDayDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to deactivate providerScheduleDay
//*******************************************************************************************
providerScheduleDayDAL.prototype.deactivateProviderScheduleDayByProviderScheduleId = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateProviderScheduleDayByProviderScheduleIdQuery = "UPDATE `chameleon`.`ProviderScheduleDay` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderScheduleId`=?;";
             providerScheduleDayDAL.prototype.query(deactivateProviderScheduleDayByProviderScheduleIdQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateProviderScheduleDayByProviderScheduleId",data);
                    return resultMethod(err,providerScheduleDayDAL.prototype.nonQueryResult(result));
                     },connection);
};
       
//Method to select the ProviderScheduleDay by Provider Id
//*******************************************************************************************
providerScheduleDayDAL.prototype.getProviderScheduleDayByProviderScheduleId = function(id, resultMethod,connection) {
    var getProviderScheduleDayByProviderScheduleIdQuery ="SELECT providerScheduleDay.`ProviderScheduleDayId` , providerScheduleDay.`ProviderScheduleId` , providerScheduleDay.`StartTime`, providerScheduleDay.`DayOfWeek` ,providerScheduleDay.`EndTime` , providerScheduleDay.`CreationDate` ,providerScheduleDay.`ModificationDate` ,providerScheduleDay.`IsActive` FROM `chameleon`.`ProviderScheduleDay` providerScheduleDay INNER JOIN `ProviderSchedule` providerSchedule on providerScheduleDay.`ProviderScheduleId` = providerSchedule.`ProviderScheduleId` WHERE providerScheduleDay.`ProviderScheduleId` =? AND providerScheduleDay.`IsActive` = 1  AND providerSchedule.`IsActive` =1 ORDER BY providerScheduleDay.ProviderScheduleId,providerScheduleDay.DayOfWeek, providerScheduleDay.StartTime ";
                providerScheduleDayDAL.prototype.getByArguments(getProviderScheduleDayByProviderScheduleIdQuery,id,function (err,result)
                {
                    logger.log("debug","getProviderScheduleDayByProviderScheduleId",id , result);
                    return resultMethod(err,providerScheduleDayDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method for transform the information from sql to model
//********************************************************************************************
providerScheduleDayDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data[0] !=null )
        {
            data = data[0];
            
            
       
           var providerScheduleDay  = new providerScheduleDayModel();
           providerScheduleDay.id = data.ProviderScheduleDayId;
           providerScheduleDay.providerScheduleId = data.ProviderScheduleId;
           providerScheduleDay.startTime = data.StartTime; 
           providerScheduleDay.endTime = data.EndTime;
           providerScheduleDay.dayOfWeek = data.DayOfWeek;
           providerScheduleDay.creationDate = data.CreationDate;
           providerScheduleDay.modificationDate = data.ModificationDate;
           providerScheduleDay.isActive = data.IsActive
           data = null;
            return providerScheduleDay;
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


providerScheduleDayDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var providerScheduleDayCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var providerScheduleDay  = new providerScheduleDayModel();
                providerScheduleDay.id = data.ProviderScheduleDayId;
                providerScheduleDay.providerScheduleId = data.ProviderScheduleId;
                providerScheduleDay.startTime = data.StartTime; 
                providerScheduleDay.endTime = data.EndTime;
                providerScheduleDay.dayOfWeek = data.DayOfWeek;
                providerScheduleDay.creationDate = data.CreationDate;
                providerScheduleDay.modificationDate = data.ModificationDate;
                providerScheduleDay.isActive = data.IsActive
                data = null;
                providerScheduleDayCollection.push(providerScheduleDay);
              
            }
            return providerScheduleDayCollection;
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
providerScheduleDayDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id"))
    mysqlModel.ProviderScheduleDayId  = data.id;
    if(data.hasOwnProperty("providerScheduleId"))
    mysqlModel.ProviderScheduleId = data.providerScheduleId;
    if(data.hasOwnProperty("startTime"))
    mysqlModel.StartTime = data.startTime;
    if(data.hasOwnProperty("endTime"))
    mysqlModel.EndTime = data.endTime;
    if(data.hasOwnProperty("dayOfWeek"))
    mysqlModel.DayOfWeek = data.dayOfWeek;
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
module.exports =  providerScheduleDayDAL;