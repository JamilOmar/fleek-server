//*******************************************************************************************
//Name: Provider Schedule Logic
//Description: Provider Schedule logic class
//Target : Provider Schedule  Creation , Administration of Provider Schedule 
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var providerScheduleDAL = require('data/dal/providerScheduleDAL');
var logger = require('utilities/logger');
var cache = require('data/cache/cache.js');
var uuid = require('node-uuid');
//*******************************************************************************************
//constants
var constants = require('global/constants');
//*******************************************************************************************
var providerScheduleLogic = function()
{
  
   providerScheduleLogic.prototype.self = this;
};

//create
//*******************************************************************************************
providerScheduleLogic.prototype.createProviderSchedule = function(providerSchedule, resultMethod) {
var providerScheduleData = new providerScheduleDAL();
try
{
    //create a connection for the transaction
    providerScheduleData.pool.getConnection(function(err,connection){
        //start the transaction
          if (err) 
                { //if there is an error in the connection
                    return resultMethod(err,null );
                }
        connection.beginTransaction(function(err)
        {  
                if (err) 
                { //if there is an error in the transaction return
                    return resultMethod(err,null );
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
                 //method to prepare the data    
                
                function check(callback)
                {
                    providerScheduleData.getProviderScheduleByProviderId(providerSchedule.providerId,function (err,result)
                    {
                        return  callback(err,result);
                    },null);
                  
                },  
                function prepare(data,callback)
                {
                   
                    if( Object.keys(data).length >0)
                    {
                           callback({name: "Error at create schedule", message:"There is already an schedule"},null);
                    }
                    else
                    {
                        var localDate = new Date();
                        providerSchedule.id =uuid.v4();
                        providerSchedule.modificationDate = localDate;
                        providerSchedule.creationDate = localDate;
                        providerSchedule.isActive = true;
                        providerSchedule.isDefault = true;
                        callback(null,providerSchedule);
                        
                    }
                    
                    
                },    
                //method to create the providerSchedule    
                function createProviderSchedule(providerSchedule,callback)
                {
                    providerScheduleData.createProviderSchedule(providerSchedule,function (err,result)
                    {
                        if(err)
                        {
                            return connection.rollback(function() {
                                callback(err,null);});
                        }
                        //if no error commit
                        connection.commit(function(err) 
                        {
                            if(err)
                            {
                                return connection.rollback(function() {
                                    callback(err,null);});
                            }
                            logger.log("debug","commit" , providerSchedule);
                        });
                          
                    return callback(null,result );
                    },connection);

        },
        //get information by id            
        function getById (id, callback)
        {
                providerScheduleData.getProviderScheduleById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        },
        /*
        //store the information under cache
        //******************************************************************************************* 
        function saveInCache(providerSchedule,callback)
        {
                    var cacheL =new cache();
                    cacheL.saveCache(constants.REDIS_PROVIDER_SCHEDULE+providerSchedule.providerId,providerSchedule,function(err,result)
                    {
                        delete cacheL; 
                        return callback(err,result);
                    });
          
        }*/
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleData = null;
         return resultMethod(err,null );
    }
        
};
//update
//*******************************************************************************************
providerScheduleLogic.prototype.updateProviderSchedule = function(providerSchedule, resultMethod) {
var providerScheduleData = new providerScheduleDAL();
try
{
    //create a connection for the transaction
    providerScheduleData.pool.getConnection(function(err,connection){
        //start the transaction
          if (err) 
                { //if there is an error in the connection
                    return resultMethod(err,null );
                }
        connection.beginTransaction(function(err)
        {  
                if (err) 
                { //if there is an error in the transaction return
                    return resultMethod(err,null );
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
                
                //method to prepare the data    
                function prepare(callback)
                {
                    providerSchedule.modificationDate = new Date();
                    callback(null,providerSchedule);
                },
                //update   
                function updateProviderSchedule(providerSchedule,callback)
                {
                    providerScheduleData.updateProviderSchedule(providerSchedule,providerSchedule.id,function (err,result)
                    {
                        if(err)
                        {
                            return connection.rollback(function() {
                                callback(err,null);});
                        }
                        //if no error commit
                        connection.commit(function(err) 
                        {
                            if(err)
                            {
                                return connection.rollback(function() {
                                    callback(err,null);});
                            }
                            logger.log("debug","commit" , providerSchedule);
                        });
                     
                    return callback(null,providerSchedule );
                    },connection);

        },
        //get information by id            
        function getById (providerSchedule, callback)
        {
           
                providerScheduleData.getProviderScheduleById(providerSchedule.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        },
        /*
        //store the information under cache
        //******************************************************************************************* 
        function saveInCache(providerSchedule,callback)
        {
                    var cacheL =new cache();
                    cacheL.saveCache(constants.REDIS_PROVIDER_SCHEDULE+providerSchedule.id,providerSchedule,function(err,result)
                    {
                        delete cacheL; 
                        return callback(err,result);
                    });
          
        }
        */
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleData = null;
         return resultMethod(err,null );
    }
        
};


//get providerSchedule by Id
//*******************************************************************************************
providerScheduleLogic.prototype.getProviderScheduleById = function(id, resultMethod) {
     var providerScheduleData = new providerScheduleDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleData.getProviderScheduleById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            providerScheduleData = null;
            return  resultMethod(err,result);
            });
};

//get providerSchedule by provider Id
//*******************************************************************************************
providerScheduleLogic.prototype.getProviderScheduleByProviderId = function(id, resultMethod) {
     var providerScheduleData = new providerScheduleDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleData.getProviderScheduleByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            providerScheduleData = null;
            return  resultMethod(err,result);
            });
};
//get providerSchedule by provider Id
//*******************************************************************************************
/*
providerScheduleLogic.prototype.getProviderScheduleByProviderId = function(id, resultMethod) {
    var providerScheduleData = new providerScheduleDAL();
    var cacheL =new cache();
    mod_vasync.waterfall([function Get (callback){
            
        cacheL.getCache(constants.REDIS_PROVIDER_SCHEDULE+id,function(err,result)
        {
            return callback(err,result);
        });
        }, 
        function queryData (providerSchedule,callback)
        {
            if( providerSchedule)
            {
                return  callback(null,{isNew:false, providerSchedule:providerSchedule});
            }
            else
            {
                providerScheduleData.getProviderScheduleByProviderId(id,function (err,result)
                {
                    return  callback(err,{isNew:true, providerSchedule:result});
                },null);
            }
            },
            function getdata(data, callback)
            {
                if(data.isNew)
                {
                    cacheL.saveCache(constants.REDIS_PROVIDER_SCHEDULE+data.providerSchedule.providerId,data.providerSchedule,function(err,result)
                        {
                            return callback(err,result);
                        });
                }
                else
                {
                    return callback(null, data.providerSchedule);
                }
                
            }],function(err,result){
            delete cacheL; 
            delete providerScheduleData;
            return  resultMethod(err,result);});
    
};
*/


//deactivate
//*******************************************************************************************
providerScheduleLogic.prototype.deactivateProviderSchedule = function(providerSchedule, resultMethod) {
    var providerScheduleData = new providerScheduleDAL();
try
{
    //create a connection for the transaction
    providerScheduleData.pool.getConnection(function(err,connection){
        //start the transaction
         if (err) 
                { //if there is an error in the connection
                    return resultMethod(err,null );
                }
        connection.beginTransaction(function(err)
        {  
                if (err) 
                { //if there is an error in the transaction return
                    return resultMethod(err,null );
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
                    
                //method to prepare the data
                function prepare(callback)
                {
                    providerSchedule.modificationDate = new Date();
                    callback(null,providerSchedule);
                },
                //Deactivate 
                function deactivate(providerSchedule,callback)
                {
                    providerScheduleData.deactivateProviderSchedule(providerSchedule,function (err,result)
                    {
                        if(err)
                        {
                            return connection.rollback(function() {
                                callback(err,null);});
                        }
                        //if no error commit
                        connection.commit(function(err) 
                        {
                            if(err)
                            {
                                return connection.rollback(function() {
                                    callback(err,null);});
                            }
                            logger.log("debug","commit" , providerSchedule);
                       
                        });
                    return callback(err,result );
                    },connection);

        },
        /*
        function removeCache(data,callback)
        {
            var cacheL =new cache();
            cacheL.deleteCache(constants.REDIS_PROVIDER_SCHEDULE+providerSchedule.providerId,function(err,result)
            {
                delete cacheL; 
                return callback(err,result);
            });
          
        }*/
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
          providerScheduleData = null;
         return resultMethod(err,null );
    }
        
};



//********************************************************************************************
module.exports =  providerScheduleLogic;