//*******************************************************************************************
//Name: Service DAl
//Description: Base class for connectivity with the MySql Database
//Target : Service Creation , Administration of services
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var serviceModel  = require('models/service');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var serviceDAL = function()
{
  
   serviceDAL.prototype.self = this;
};
  serviceDAL.prototype =  new baseDAL();



//Method to Select Services By Type Id 
//*******************************************************************************************
serviceDAL.prototype.getServiceByTypeId = function(id,cultureCode, resultMethod,connection) {
    var getServiceByTypeIdQuery ="SELECT s.`ServiceId` , sl.`Name` , s.`Type` , s.`CreationDate` , s.`ModificationDate` , s.`IsActive` FROM `chameleon`.`Service` s inner join `chameleon`.`ServiceType` st on s.`Type` = st.`ServiceTypeId` INNER JOIN `chameleon`.`Service_Local` sl on  s.`ServiceId` = sl.`ServiceId` INNER JOIN `chameleon`.`Culture` cu on cu.`CultureId` = sl.`CultureId`  WHERE s.`IsActive` =1 AND cu.`IsActive` = 1 AND st.`IsActive` AND s.`Type` = ? AND cu.`CultureCode`=? ORDER BY s.`Name`";
                serviceDAL.prototype.getByArguments(getServiceByTypeIdQuery,[id,cultureCode],function (err,result)
                {
                    logger.log("debug","getServiceByTypeId" , result);
                    return resultMethod(err,serviceDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};


//Method for transform the information from sql to model
//********************************************************************************************
serviceDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
        
        if(data != null && data.length >0)
        {
            data = data[0];
            var service  = new serviceModel();
            service.id = data.ServiceId;
            service.name = data.Name;
            service.type = data.Type;
            service.creationDate = data.CreationDate;
            service.modificationDate = data.ModificationDate;
            service.isActive = data.IsActive;
            data = null;
            return service;
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


serviceDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var userCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var service  = new serviceModel();
                service.id = data.ServiceId;
                service.name = data.Name;
                service.type = data.Type;
                service.creationDate = data.CreationDate;
                service.modificationDate = data.ModificationDate;
                service.isActive = data.IsActive;
                data = null;
                userCollection.push(service);
            }
            return userCollection;
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
serviceDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id")  && data.id!= undefined)
    mysqlModel.ServiceId  = data.id;
    if(data.hasOwnProperty("name")  && data.name!= undefined)
    mysqlModel.Name = data.name;
    if(data.hasOwnProperty("lastname")  && data.lastname!= undefined)
    mysqlModel.Type = data.lastname;
    if(data.hasOwnProperty("creationDate")  && data.creationDate!= undefined)
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate")  && data.modificationDate!= undefined)
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive")  && data.isActive!= undefined)
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
module.exports = serviceDAL;