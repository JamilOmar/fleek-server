require('rootpath')();
var mod_vasync  = require("vasync");
var userDeviceDAL = require('data/dal/userDeviceDal');
var userDeviceModel = require('models/userDevice');
var logger = require('utilities/logger');
var userDeviceLogic = function()
{
  
   userDeviceLogic.prototype.self = this;
};

//Method to Get the User Device per Id and Device Serial
//*******************************************************************************************
userDeviceLogic.prototype.getEnabledDeviceByUserIdDeviceSerial = function(id,serial, resultMethod) {
     var userDeviceData = new userDeviceDAL();
        mod_vasync.waterfall([ function Get (callback){
            userDeviceData.getEnabledDeviceByUserIdDeviceSerial(id,serial,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            userDeviceData = null;
            return  resultMethod(err,result);});
};

//Method to add a User Device
//*******************************************************************************************
userDeviceLogic.prototype.addUserDevice = function(userId,deviceSerial,deviceFriendlyName, resultMethod) {
       var userDeviceData = new userDeviceDAL();
        mod_vasync.waterfall([ 
             //method to prepare the data
                function prepare(callback)
                {
                    var userDevice = new userDeviceModel();
                    userDevice.userId = userId;
                    userDevice.deviceSerialNumber = deviceSerial;
                    userDevice.deviceSerialNumber = deviceFriendlyName;
                    userDevice.isBlocked = false;
                    var localDate =new Date();
                    userDevice.modificationDate = localDate;
                    userDevice.CreationDate = localDate;
                    userDevice.isActive = true;
                    callback(null,userDevice);
                },
        function addDevice (userDevice , callback){    
         userDeviceData.addUserDevice(userDevice,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            userDeviceData = null;
            return  resultMethod(err,result);});
    
};
//Method to remove the User's friend
//*******************************************************************************************
userDeviceLogic.prototype.removeUserFriend = function(userId,deviceSerial,deviceFriendlyName, resultMethod) {
       var userDeviceData = new userDeviceDAL();
        mod_vasync.waterfall([ 
             //method to prepare the data
                function prepare(callback)
                {
                    var userDevice = new userDeviceModel();
                    userDevice.userId = userId;
                    userDevice.deviceSerialNumber = deviceSerial;
                      userDevice.deviceSerialNumber = deviceFriendlyName;
                    userDevice.isBlocked = false;
                    var localDate =new Date();
                    userDevice.modificationDate = localDate;
                    userDevice.CreationDate = localDate;
                    userDevice.isActive = true;
                    callback(null,userDevice);
                },
        function removeFriend (userfriend , callback){    
         userDeviceData.removeUserFriend(userfriend,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            userFriendData = null;
            return  resultMethod(err,result);});
    
};
//********************************************************************************************
module.exports =userDeviceLogic;