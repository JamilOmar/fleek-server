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
var userLogic = require('./userLogic');
//*******************************************************************************************
//constants
var constants = require('global/constants');
//*******************************************************************************************
var providerScheduleLogic = function()
{
  
   providerScheduleLogic.prototype.self = this;
};

//*******************************************************************************************
//
// Method for create the provider Schedule
//
//
//*******************************************************************************************
providerScheduleLogic.prototype.createProviderSchedule = function(currentUserId, providerSchedule, resultMethod) {
var providerScheduleData = new providerScheduleDAL();
var userL = new userLogic();
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
//authorize
//check if the user who is calling is the same user who is being send
//*******************************************************************************************
            function authorize(callback)
            {
                if(currentUserId == providerSchedule.providerId && !(currentUserId == providerSchedule.providerId))
                {
                    return callback(null,providerSchedule);
                }
                else
                {
                     return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                }
                
            },
//validate if the user exists and if is a provider
//*******************************************************************************************
             function validateProvider(providerSchedule,callback)
             {
                 userL.checkUser(providerSchedule.providerId,function(err,data)
                 {
                    if( Object.keys(data).length ==0 || data.isProvider ==false)
                    {
                         return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                    }
                    else
                    {
                        return callback(null,providerSchedule);
                    }
                     
                     
                 },connection);
             },
//Check if the user has an schedule , version 1 will only accept on schedule per user             
//*******************************************************************************************            
                function check(callback)
                {
                    providerScheduleData.getProviderScheduleByProviderId(providerSchedule.providerId,function (err,result)
                    {
                        return  callback(err,result);
                    },null);
                  
                },
//Prepare the data for insertion
//*******************************************************************************************                     
                function prepare(data,callback)
                {
                   
                    if( Object.keys(data).length >0)
                    {
                        return callback({name: "Error at create schedule", message:"There is already an schedule"},null);
                    }
                    else
                    {
                        var localDate = new Date();
                        providerSchedule.id =uuid.v4();
                        providerSchedule.modificationDate = localDate;
                        providerSchedule.creationDate = localDate;
                        providerSchedule.isActive = true;
                        providerSchedule.isDefault = true;
                        return callback(null,providerSchedule);
                        
                    }
                },    
//method to create the providerSchedule
//*******************************************************************************************         
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
                            else
                            {
                                   logger.log("debug","commit" , providerSchedule);
                                   return callback(null,providerSchedule); 
                            }
                         
                        });
                          
                  
                    },connection);

        },
//get information by id
//*******************************************************************************************                
        function getById (providerSchedule, callback)
        {
                providerScheduleData.getProviderScheduleById(providerSchedule.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        },
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleData = null;
                userL = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleData = null;
         userL = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
// Method for update the provider Schedule
//
//
//*******************************************************************************************
providerScheduleLogic.prototype.updateProviderSchedule = function(currentUserId,providerSchedule, resultMethod) {
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

//check if previous data exists
//*******************************************************************************************
                function checkExistingItem (callback)
                {
                    providerScheduleData.getProviderScheduleById(providerSchedule.id,function (err,result)
                    {
                        return  callback(err,result);
                    },connection);
                },
//authorize
//check if the user who is calling is the same user who created the provider schedule
//*******************************************************************************************
                 function authorize(data,callback)
                {
                    //Validate if the object exists and has the same provider
                    if( Object.keys(data).length ==0 || data.providerId != providerSchedule.providerId)
                    {
                         return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                    }
                    else
                    {
                        //Authorize
                       if(currentUserId == providerSchedule.providerId && !(currentUserId == providerSchedule.providerId))
                        {
                            return callback(null,providerSchedule);
                        }
                        else
                        {
                            return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                        }
                    }
                },
//prepare the data 
//*******************************************************************************************
                //method to prepare the data    
                function prepare(callback)
                {
                    providerSchedule.modificationDate = new Date();
                    delete providerSchedule.isDefault;
                    delete providerSchedule.isActive;
                    delete providerSchedule.creationDate;
                    delete providerSchedule.providerId;
                    callback(null,providerSchedule);
                },
//update
//*******************************************************************************************   
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
                            else
                            {
                                logger.log("debug","commit" , providerSchedule);
                                return callback(null,providerSchedule );
                            }
                        });
                    },connection);

        },
//*******************************************************************************************        
//
//Get information by id
//
//*******************************************************************************************      
        function getById (providerSchedule, callback)
        {
           
                providerScheduleData.getProviderScheduleById(providerSchedule.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
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

//*******************************************************************************************
//
//get providerSchedule by Id
//
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
//*******************************************************************************************
//
//get providerSchedule by provider Id
//
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
//*******************************************************************************************
//
//method for validate if a providerSchedule exists with providerSchedule id and provider
//
//*******************************************************************************************
providerScheduleLogic.prototype.validateProviderScheduleByIdProviderId = function(id,providerId, resultMethod,connection) {
     var providerScheduleData = new providerScheduleDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleData.getProviderScheduleByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },connection);

        }],function(err,result){
            providerScheduleData = null;
            return  resultMethod(err,result);
            });
};
//*******************************************************************************************
//
// Method for remove the provider Schedule
//
//
//*******************************************************************************************
providerScheduleLogic.prototype.deactivateProviderSchedule = function(currentUserId,providerSchedule, resultMethod) {
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
//check if previous data exists
//*******************************************************************************************
                function checkExistingItem (callback)
                {
                    providerScheduleData.getProviderScheduleById(providerSchedule.id,function (err,result)
                    {
                        return  callback(err,result);
                    },connection);
                },
//authorize
//check if the user who is calling is the same user who created the provider schedule
//*******************************************************************************************
                 function authorize(data,callback)
                {
                    //Validate if the object exists and has the same provider
                    if( Object.keys(data).length ==0 ||data.providerId != providerSchedule.providerId)
                    {
                         return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                    }
                    else
                    {
                        //Authorize
                       if(currentUserId == providerSchedule.providerId && !(currentUserId == providerSchedule.providerId))
                        {
                            return callback(null,providerSchedule);
                        }
                        else
                        {
                            return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                        }
                    }
                },                    
//method to prepare the data
//*******************************************************************************************
                function prepare(providerSchedule, callback)
                {
                    providerSchedule.modificationDate = new Date();
                    callback(null,providerSchedule);
                },
//Deactivate
//******************************************************************************************* 
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
                            else
                            {
                                logger.log("debug","commit" , providerSchedule);
                                return callback(err,result );
                            }
                          
                       
                        });
                  
                    },connection);

        }
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