//*******************************************************************************************
//Name: ServiceType Type Logic
//Description: ServiceType Type logic class
//Target : ServiceType Type  Creation , Administration of ServiceTypes 
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync  = require("vasync");
var serviceTypeDAL = require('data/dal/serviceTypeDAL');
var cache = require('data/cache/cache.js');
var logger = require('utilities/logger');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var serviceTypeLogic = function()
{
  
   serviceTypeLogic.prototype.self = this;
};



//Method to Select the service type
//*******************************************************************************************
serviceTypeLogic.prototype.getServiceType = function(cultureCode, resultMethod) {
    var serviceTypeData = new serviceTypeDAL();
   
    var cacheL =new cache();
    mod_vasync.waterfall([function Get (callback){
            
        cacheL.getSetCache(constants.REDIS_SERVICE_TYPE+cultureCode,function(err,result)
        {
                return callback(err,result);
        });
        }, 
        function queryData (serviceType,callback)
        {
            if(serviceType && serviceType.length >0)
            {
               return  callback(null,{isNew:false,  serviceType:serviceType});
            }
            else
            {
                serviceTypeData.getServiceType(cultureCode,function (err,result)
                {
                    return  callback(null,{isNew:true, serviceType:result});
                },null);
            }
        },
        function getdata(data, callback)
        {
            if(data.isNew)
            {   
                cacheL.addSetCache(constants.REDIS_SERVICE_TYPE+cultureCode,JSON.stringify( data.serviceType),function(err,result)
                    {
                        return callback(err,result);
                    });
                }
                else
                {
                    return callback(null, data.serviceType);
                }
                
            }],function(err,result){
        cacheL = null; 
        serviceTypeData =null;
        return  resultMethod(err,JSON.parse(result));});

}
//********************************************************************************************
module.exports =serviceTypeLogic;