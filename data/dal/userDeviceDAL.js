//*******************************************************************************************
//Name: User Device DAl
//Description: Base class for connectivity with the MySql Database
//Target : Administration of user's devices
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var userDeviceModel  = require('models/userDevice');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var userDeviceDAL = function()
{
  
   userDeviceDAL.prototype.self = this;
};
  userDeviceDAL.prototype =  new baseDAL();



//Method to get the user device By Id
//*******************************************************************************************
userDeviceDAL.prototype.getDeviceById = function(id, resultMethod,connection) {
     var getParameters = 
               {
                   UserDeviceId : id
              
               };
    var getDeviceByIdQuery ="select * from UserDevice where  `UserDeviceId` = ?  AND `IsActive` = 1 ";
                userDeviceDAL.prototype.getByArguments(getDeviceByIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getDeviceById" , result);
                    return resultMethod(err,userDeviceDAL.prototype.self.mapperSqlToModel(result[0]));
                },connection);  
};

//Method to get the user device
//*******************************************************************************************
userDeviceDAL.prototype.getDeviceByUserIdDeviceSerial = function(id,serial, resultMethod,connection) {
     var getParameters = 
               {
                   userId : id,
                   deviceSerialNumber: serial
               };
    var getDeviceByUserIdDeviceSerialQuery ="select * from UserDevice where  `UserId` = ?  AND `DeviceSerialNumber`  =? AND `IsActive` = 1 ";
                userDeviceDAL.prototype.getByArguments(getDeviceByUserIdDeviceSerialQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getDeviceByUserIdDeviceSerial" , result);
                    return resultMethod(err,userDeviceDAL.prototype.self.mapperSqlToModel(result[0]));
                },connection);  
};

//Method to get the enabled user device
//*******************************************************************************************
userDeviceDAL.prototype.getEnabledDeviceByUserIdDeviceSerial = function(id,serial, resultMethod,connection) {
     var getParameters = 
               {
                   userId : id,
                   deviceSerialNumber: serial
               };
    var getEnabledDeviceByUserIdDeviceSerialQuery ="select * from UserDevice where  `UserId` = ?  AND `DeviceSerialNumber`  =? AND `IsActive` = 1 `IsBlocked`=0 ";
                userDeviceDAL.prototype.getByArguments(getEnabledDeviceByUserIdDeviceSerialQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getEnabledDeviceByUserIdDeviceSerial" , result);
                    return resultMethod(err,userDeviceDAL.prototype.self.mapperSqlToModel(result[0]));
                },connection);  
};
//Method to add user devices
//*******************************************************************************************
userDeviceDAL.prototype.addUserDevice = function(data, resultMethod,connection) {
      var addUserDeviceQuery = "INSERT INTO `chameleon`.`UserDevice` SET ?;";
             userDeviceDAL.prototype.query(addUserDeviceQuery,data,function (err,result)
                {
                    logger.log("debug","addUserDevice",data);
                    return resultMethod(err,result);
                },connection);
};
//Method to remove user devices
//*******************************************************************************************
userDeviceDAL.prototype.removeUserDevice = function(data, resultMethod,connection) {
     var disableParameters = 
               {
                  
                   modificationDate : data.modificationDate,
                   UserDeviceId : data.id
               };
      var removeUserDeviceQuery = "UPDATE `chameleon`.`UserDevice` SET (`ModificationDate`=?,`IsActive`=0   ) WHERE  `chameleon`.`UserDevice`.`UserDeviceId`=?;";
             userDeviceDAL.prototype.query(removeUserDeviceQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","removeUserDevice",data);
                    return resultMethod(err,result);
                },connection);
};
//Method to block user devices
//*******************************************************************************************
userDeviceDAL.prototype.blockDevice = function(data, resultMethod,connection) {
     var disableParameters = 
               {
                   modificationDate : data.modificationDate,
                   UserDeviceId : data.id
               };
      var blockDeviceQuery = "UPDATE `chameleon`.`UserDevice` SET (`ModificationDate`=?,`IsBlocked`=0   ) WHERE `chameleon`.`UserDevice`.`UserDeviceId`=? ;";
             userDeviceDAL.prototype.query(blockDeviceQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","blockDevice",data);
                    return resultMethod(err,result);
                },connection);
};
//Method to unblock user devices
//*******************************************************************************************
userDeviceDAL.prototype.unblockDevice = function(data, resultMethod,connection) {
     var enableParameters = 
               {
                   modificationDate : data.modificationDate,
                   UserDeviceId : data.id
               };
      var unblockDeviceQuery = "UPDATE `chameleon`.`UserDevice` SET (`ModificationDate`=?,`IsBlocked`=1   ) WHERE `chameleon`.`UserDevice`.`UserDeviceId`=? ;";
             userDeviceDAL.prototype.query(unblockDeviceQuery,enableParameters,function (err,result)
                {
                    logger.log("debug","unblockDevice",data);
                    return resultMethod(err,result);
                },connection);
};
//Method for transform the information from sql to model
//********************************************************************************************
userDeviceDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    var userDevice  = new userDeviceModel();
    userDevice.id = data.UserDeviceId;
    userDevice.userId = data.UserId;
    userDevice.deviceSerialNumber = data.DeviceSerialNumber;
    userDevice.deviceFriendlyName = data.DeviceFriendlyName;
    userDevice.isBlocked = data.IsBlocked;
    userDevice.creationDate = data.CreationDate;
    userDevice.modificationDate = data.ModificationDate;
    userDevice.isActive = data.IsActive
    return userDevice;
    }
    catch(err)
    {
         logger.log("error","mapperSqlToModel",err);
        return null;
    }
    
        

}
//Method for transform the information from model to sql
//********************************************************************************************
userDeviceDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={
    UserDeviceId : data.id,    
    UserId  : data.userId,
    DeviceSerialNumber : data.deviceSerialNumber,
    DeviceFriendlyName  : data.deviceFriendlyName,
    IsBlocked : data.isBlocked,
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
module.exports = userDeviceDAL;