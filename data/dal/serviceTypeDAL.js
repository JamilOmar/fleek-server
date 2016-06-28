//*******************************************************************************************
//Name: ServiceType DAl
//Description: Base class for connectivity with the MySql Database
//Target : Service Type Creation , Administration of services
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var serviceTypeModel  = require('models/serviceType');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var serviceTypeDAL = function()
{
  
   serviceTypeDAL.prototype.self = this;
};
  serviceTypeDAL.prototype =  new baseDAL();

//Method to Select a Service Type By Id
//*******************************************************************************************
serviceTypeDAL.prototype.getServiceTypeById = function(id,cultureCode, resultMethod,connection) {
    var getServiceTypeByIdQuery ="SELECT * FROM `chameleon`.`ServiceType` WHERE `IsActive` = 1 AND `ServiceTypeId` =?";
                serviceTypeDAL.prototype.getByArguments(getServiceTypeByIdQuery,[id,cultureCode],function (err,result)
                {
                    logger.log("debug","getServiceTypeById" , result);
                    return resultMethod(err,serviceTypeDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to Select a Service Type
//*******************************************************************************************
serviceTypeDAL.prototype.getServiceType = function(cultureCode, resultMethod,connection) {
    var getServiceTypeQuery ="SELECT st.`ServiceTypeId` , stl.`Name` , st.`PictureUrl`, st.`CreationDate` , st.`ModificationDate`,st.`IsActive` FROM `chameleon`.`ServiceType` st INNER JOIN `chameleon`.`ServiceType_Local` stl on st.`ServiceTypeId` = stl.`ServiveTypeId` INNER JOIN `chameleon`.`Culture` cu on cu.`CultureCode` = stl.`CultureCode`  WHERE st.`IsActive` = 1 AND cu.`CultureCode` =? AND cu.`IsActive` = 1  ORDER BY stl.`Name`";
                serviceTypeDAL.prototype.getByArguments(getServiceTypeQuery,cultureCode,function (err,result)
                {
                    logger.log("debug","getServiceType" , result);
                    return resultMethod(err,serviceTypeDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};


//Method for transform the information from sql to model
//********************************************************************************************
serviceTypeDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
        
        if(data != null && data.length >0 )
        {
            data = data[0];
            var serviceType  = new serviceTypeModel();
            serviceType.id = data.ServiceTypeId;
            serviceType.name = data.Name;
            serviceType.pictureUrl = data.PictureUrl;
            serviceType.creationDate = data.CreationDate;
            serviceType.modificationDate = data.ModificationDate;
            serviceType.isActive = data.IsActive
            data = null;
            return serviceType;
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


serviceTypeDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var serviceTypeCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var serviceType  = new serviceTypeModel();
            	serviceType.id = data.ServiceTypeId;
            	serviceType.name = data.Name;
                serviceType.pictureUrl = data.PictureUrl; 
            	serviceType.creationDate = data.CreationDate;
            	serviceType.modificationDate = data.ModificationDate;
            	serviceType.isActive = data.IsActive
            	data = null;
                serviceTypeCollection.push(serviceType);
            }
            return serviceTypeCollection;
        }
        else
        {
            return {};
        }
   
    }
    catch(err)
    {
         logger.log("error","mapperSqlToModelCollection",err);
        return null;
    }
    
        

}
//Method for transform the information from model to sql
//********************************************************************************************
serviceTypeDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
     var mysqlModel  ={};
    if(data.hasOwnProperty("id")  && data.id!= undefined)
    mysqlModel.ServiceTypeId  = data.id;
    if(data.hasOwnProperty("name")  && data.name!= undefined)
    mysqlModel.Name = data.name;
      if(data.hasOwnProperty("pictureUrl")  && data.pictureUrl!= undefined)
    mysqlModel.PictureUrl = data.pictureUrl;           
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
module.exports =serviceTypeDAL;