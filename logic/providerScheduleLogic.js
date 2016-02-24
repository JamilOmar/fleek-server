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
var providerScheduleExceptionLogic = require('logic/providerScheduleExceptionLogic');
var providerScheduleDayLogic = require('logic/providerScheduleDayLogic');
var logger = require('utilities/logger');
var validator =require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var uuid = require('node-uuid');
var userLogic = require('./userLogic');
var context = require('security/context');
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
//Validation for Provider Schedule
//
//*******************************************************************************************
providerScheduleLogic.prototype.validate = function (providerSchedule, callback) {
var validatorM = new validatorManager();   
            
        
           if(  !validator.isLength( providerSchedule.name,{min:0, max:60}) )
           {
                validatorM.addException("Name is invalid.");
           }
            if(  (!validator.isNullOrUndefined( providerSchedule.isDefault ) && !validator.isBoolean( providerSchedule.isDefault)) )
           {
                validatorM.addException("IsDefault is invalid.");
           }
           if(  !validator.isNullOrUndefined( providerSchedule.providerId )  )
           {
                validatorM.addException("providerId is invalid.");
           }
                      if(validatorM.isValid())
            return callback(null ,true);
            else
            return callback({name:"Error in Provider Schedule Validation", message : validatorM.GenerateErrorMessage()},false);
}



//*******************************************************************************************
//
// Method for create the provider Schedule
//
//
//*******************************************************************************************
providerScheduleLogic.prototype.createProviderSchedule = function( providerSchedule, resultMethod) {
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
//validate
//*******************************************************************************************
                function validateEntity(callback)
                {
                    providerScheduleLogic.prototype.self.validate(providerSchedule,function(err,result)
                    {
                        return callback(err);
                    })
                },                    
                    
                 //method to prepare the data    
//authorize
//check if the user who is calling is the same user who is being send
//*******************************************************************************************
            function authorize(callback)
            {
                if(context.getUser.id == providerSchedule.providerId )
                {
                    return callback(null);
                }
                else
                {
                     return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                }
                
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
                        return callback(null);
                        
                    }
                },    
//method to create the providerSchedule
//*******************************************************************************************         
                function createProviderSchedule(callback)
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
                                   return callback(null,providerSchedule.id); 
                            }
                         
                        });
                          
                  
                    },connection);

        },
//get information by id
//*******************************************************************************************                
        function getById (id, callback)
        {
                providerScheduleData.getProviderScheduleById(id,function (err,result)
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
//validate
//*******************************************************************************************
                function validateEntity(callback)
                {
                    providerScheduleLogic.prototype.self.validate(providerSchedule,function(err,result)
                    {
                        return callback(err);
                    })
                },                          

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
                    if( Object.keys(data).length ==0 || data.providerId != providerSchedule.providerId ||
                    context.getUser.id != providerSchedule.providerId)
                    {
                        return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                    }
                    else
                    {

                        return callback(null);
                    
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
                    callback(null);
                },
//update
//*******************************************************************************************   
                function updateProviderSchedule(callback)
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
                                return callback(null,providerSchedule.id );
                            }
                        });
                    },connection);

        },
//*******************************************************************************************        
//
//Get information by id
//
//*******************************************************************************************      
        function getById (id, callback)
        {
           
                providerScheduleData.getProviderScheduleById(id,function (err,result)
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
providerScheduleLogic.prototype.deactivateProviderSchedule = function(providerSchedule, resultMethod) {
    var providerScheduleData = new providerScheduleDAL();
    var providerScheduleDayL = new providerScheduleDayLogic();
    var providerScheduleExceptionL = new providerScheduleExceptionLogic();
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
                    if( Object.keys(data).length ==0 ||data.providerId != providerSchedule.providerId
                    ||context.getUser.id != providerSchedule.providerId )
                    {
                         return callback({name: "Error at create provider Schedule", message:"Invalid operation."},null);
                    }
                    else
                    {
                      
                        return callback(null);
                       
                    }
                },                    
//method to prepare the data
//*******************************************************************************************
                function prepare( callback)
                {
                    providerSchedule.modificationDate = new Date();
                    callback(null);
                },
//method to deactivate all the provider schedule days
//*******************************************************************************************
                function deactivateScheduleDay(providerSchedule, callback)
                {
                    providerScheduleDayL.deactivateProviderScheduleDayByProviderScheduleId (providerSchedule,function (err,result)
                    {
                       
                            return callback(err);
                    });
                },
//method to deactivate all the provider schedule Exceptions 
//*******************************************************************************************
                function deactivateException( callback)
                {
                    providerScheduleExceptionL.deactivateProviderScheduleExceptionByProviderScheduleId (providerSchedule,function (err,result)
                    {
                       
                            return callback(err);
                    });
                },
//Deactivate
//******************************************************************************************* 
                function deactivate(callback)
                {
                    providerScheduleData.deactivateProviderSchedule(function (err,result)
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