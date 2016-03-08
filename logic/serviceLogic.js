//*******************************************************************************************
//Name: Service Logic
//Description: Service logic class
//Target : Service  Creation , Administration of Services 
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync  = require("vasync");
var serviceDAL = require('data/dal/serviceDAL');
var cache = require('data/cache/cache.js');
var logger = require('utilities/logger');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var serviceLogic = function()
{
  
   serviceLogic.prototype.self = this;
};


//Method to Select service By Type Id
//*******************************************************************************************
serviceLogic.prototype.getServiceByTypeId = function(id,cultureCode, resultMethod) {
     var serviceData = new serviceDAL();
       var cacheL =new cache();
    mod_vasync.waterfall([function Get (callback){
            
        cacheL.getSetCache(constants.REDIS_SERVICE+id+constants.LANGUAGE+cultureCode,function(err,result)
        {
                return callback(err,result);
        });
        }, 
        function queryData (service,callback)
        {
            if(service && service.length >0)
            {
               return  callback(null,{isNew:false,  service:service});
            }
            else
            {
                serviceData.getServiceByTypeId(id,cultureCode,function (err,result)
                {
                    return  callback(null,{isNew:true, service:result});
                },null);
            }
        },
        function getdata(data, callback)
        {
            if(data.isNew)
            {   
                cacheL.addSetCache(constants.REDIS_SERVICE+id+constants.LANGUAGE+cultureCode,JSON.stringify( data.service),function(err,result)
                    {
                        return callback(err,result);
                    });
                }
                else
                {
                    return callback(null, data.service);
                }
                
            }],function(err,result){
        cacheL = null; 
        serviceData = null;
        return  resultMethod(err,JSON.parse(result));});
};


//********************************************************************************************
module.exports =  serviceLogic;