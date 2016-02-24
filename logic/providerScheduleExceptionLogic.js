//*******************************************************************************************
//Name: Provider Schedule Exception Logic
//Description: Provider Schedule Day Exception class
//Target : Provider Schedule Day  Creation , Administration of Provider Schedule Day 
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var providerScheduleExceptionDAL = require('data/dal/providerScheduleExceptionDAL');
var providerScheduleLogic = require('logic/providerScheduleLogic')
var logger = require('utilities/logger');
var uuid = require('node-uuid');
var moment = require('moment');
var validator =require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var config = require('config');
var context = require('security/context');
//*******************************************************************************************
var providerScheduleExceptionLogic = function()
{
  
   providerScheduleExceptionLogic.prototype.self = this;
};
//*******************************************************************************************
//
//Validation for Provider Schedule Day
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.validate = function (providerScheduleException,callback) {
var validatorM = new validatorManager();   
            
        
     
  
           if(  !validator.isNullOrUndefined( providerScheduleException.startdateTime )  )
           {
                validatorM.addException("date Id is invalid.");
           }
           if(  !validator.isNullOrUndefined( providerScheduleException.description ) ) 
           {
                validatorM.addException("description is invalid.");
           }
          
 
            if(validatorM.isValid())
            return callback(null ,true);
            else
            return callback({name:"Error in Provider Schedule Exception Validation", message : validatorM.GenerateErrorMessage()},false);
}
//*******************************************************************************************
//
//create
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.createProviderScheduleException = function(providerScheduleException, resultMethod) {
var providerScheduleExceptionData = new providerScheduleExceptionDAL();
var providerScheduleL = new providerScheduleLogic();
try
{
    //create a connection for the transaction
    providerScheduleExceptionData.pool.getConnection(function(err,connection){
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
                    providerScheduleExceptionLogic.prototype.self.validate(providerScheduleException,function(err,result)
                    {
                        return callback(err);
                    })
                },                        
//authorize
//*******************************************************************************************
                function authorize(callback)
                {
                    providerScheduleL.validateProviderScheduleByIdProviderId(providerScheduleException.providerScheduleId, context.getUser.id,function (err,result) {
                        
                        return callback(err,result);
                    },connection);
                },    
//validate the data
//*******************************************************************************************
                function validate(data,callback)
                {
                    try
                    {
                   //validate if the dates and required fields are submited 
                   if(Object.keys(data).length >0 )
                    {
                        var tmp =  moment(providerScheduleException.date);
                        tmp.format(config.get('chameleon.date.format'));
                             
                             if(tmp !== null || tmp.isValid())
                             {
                                  providerScheduleException.date = tmp;
                                  return callback(null,providerScheduleException);
                             }
                             else
                             {
                                   return callback({name: "Error at create the provider schedule exception.", message:"There are invalid parameters."},null);
                             }   

                    }
                    else
                    {
                        return callback({name: "Error at create the provider schedule exception.", message:"There are invalid parameters."},null);
                    }
                    }
                    catch (err)
                    {  
                        return callback(err,null);
                        
                    }
                },
//check if previous data exists with the same configuration
//*******************************************************************************************
                function getPreviousData(providerScheduleException,callback)
                {
                    //Gets the previous day per calendar
                    
                    providerScheduleExceptionData.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay(providerScheduleException.providerScheduleId,providerScheduleException.date.year(),providerScheduleException.date.month()+1,providerScheduleException.date.date()   ,function (err,result)
                    {
                        
                        try
                        {
                            
                             if( Object.keys(result).length <=0)
                            {
                                 return callback(null,providerScheduleException );
                            }
                            else
                            {
                                return callback({name: "Error at create the provider schedule exception.", message:"There is a similar date."},null);
                            } 

                        } 
                        catch(err)
                        {
                            return callback(err,null );
                        } 
                        
                        
                    },connection);
                    
                    
                },
//prepare the data
//*******************************************************************************************
                function prepareData(providerScheduleException,callback)
                {
                    var localDate = new Date();
                    providerScheduleException.id =uuid.v4();
                    providerScheduleException.date = providerScheduleException.date.toISOString();
                    providerScheduleException.modificationDate = localDate;
                    providerScheduleException.creationDate = localDate;
                    providerScheduleException.isActive = true;
                    return callback(null,providerScheduleException);   
                },    
//method to create the providerScheduleException
//*******************************************************************************************    
                function createProviderScheduleException(providerScheduleException,callback)
                {
                    providerScheduleExceptionData.createProviderScheduleException(providerScheduleException,function (err,result)
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
                            }else
                            {
                                logger.log("debug","commit" , providerScheduleException)
                                return callback(null,providerScheduleException.id );
                            };
                        });
                          
                    
                    },connection);

        },
//get information by 
//*******************************************************************************************  
        function getById (id, callback)
        {
                providerScheduleExceptionData.getProviderScheduleExceptionById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleExceptionData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleExceptionData = null;
         providerScheduleL = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
//update
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.updateProviderScheduleException = function(providerScheduleException, resultMethod) {
var providerScheduleExceptionData = new providerScheduleExceptionDAL();
try
{
    //create a connection for the transaction
    providerScheduleExceptionData.pool.getConnection(function(err,connection){
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
                    providerScheduleExceptionLogic.prototype.self.validate(providerScheduleException,function(err,result)
                    {
                        return callback(err);
                    })
                },                           
//authorize
//*******************************************************************************************
                function authorize(callback)
                {
                    providerScheduleExceptionData.getProviderScheduleExceptionByIdProviderScheduleIdProviderId(providerScheduleException.id,providerScheduleException.providerScheduleId,context.getUser.id ,function (err,result) {
                        
                        return callback(err,result);
                    },connection);
                },    
//method to validate the data
//*******************************************************************************************    
                function validateData(data,callback)
                {
                    try
                    {
                   //validate if the dates and required fields are submited 
                   if(Object.keys(data).length >0 )
                    {
                        var tmp =  moment(providerScheduleException.date);
                        tmp.format(config.get('chameleon.date.format'));
                             
                             if(tmp !== null || tmp.isValid())
                             {
                                  providerScheduleException.date = tmp;
                                  return callback(null,providerScheduleException);
                             }
                             else
                             {
                                   return callback({name: "Error at update the provider schedule exception.", message:"There are invalid parameters."},null);
                             }   

                    }
                    else
                    {
                        return callback({name: "Error at update the provider schedule exception.", message:"There are invalid parameters."},null);
                    }
                    }
                    catch (err)
                    {  
                        return callback(err,null);
                        
                    }
                },
//check if previous data exists with the same configuration
//*******************************************************************************************
                function getPreviousData(providerScheduleException,callback)
                {
                    //Gets the previous day per calendar
                    
                    providerScheduleExceptionData.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay(providerScheduleException.providerScheduleId,providerScheduleException.date.year(),providerScheduleException.date.month()+1,providerScheduleException.date.date()   ,function (err,result)
                    {
                        
                        try
                        {
                            
                             if( Object.keys(result).length <=0)
                            {
                                 return callback(null,providerScheduleException );
                            }
                            else
                            {
                                //compare the entry with previous dates
                                for (var i = 0; i < result.length; i++) 
                                {
                                    
                                    if(result[i].id == providerScheduleException.id )
                                    {
                                      return callback(null,providerScheduleException );  
                                    }
                                    else
                                    {
                                        continue;
                                    }
                                    
                                } 

                                return callback({name: "Error at update the provider schedule exception.", message:"There is a similar date."},null);
                            } 

                        } 
                        catch(err)
                        {
                            return callback(err,null );
                        } 
                        
                        
                    },connection);
                    
                    
                },
//method to check if the dates are correct
//*******************************************************************************************
                function prepareData(providerScheduleException,callback)
                {
                    var localDate = new Date();
                    providerScheduleException.date = providerScheduleException.date.toISOString();
                    providerScheduleException.modificationDate = localDate;
                    providerScheduleException.isActive =undefined;
                    providerScheduleException.creationDate= undefined;
                    providerScheduleException.providerScheduleId=undefined;
                    return callback(null,providerScheduleException);   
                },    
//method to update the providerScheduleException
//*******************************************************************************************    
                function updateProviderScheduleException(providerScheduleException,callback)
                {
                    providerScheduleExceptionData.updateProviderScheduleException(providerScheduleException,providerScheduleException.id,function (err,result)
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
                            logger.log("debug","commit" , providerScheduleException);
                        });
                          
                    return callback(null,providerScheduleException.id );
                    },connection);

        },
//get information by id
//*******************************************************************************************       
        function getById (id, callback)
        {
                providerScheduleExceptionData.getProviderScheduleExceptionById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleExceptionData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleExceptionData = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
//get providerScheduleException by Id
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.getProviderScheduleExceptionById = function(id, resultMethod) {
     var providerScheduleExceptionData = new providerScheduleExceptionDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleExceptionData.getProviderScheduleExceptionById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            providerScheduleExceptionData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
//get providerScheduleException by provider schedule Id
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.getProviderScheduleExceptionByProviderScheduleId = function(id, resultMethod) {
    var providerScheduleExceptionData = new providerScheduleExceptionDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleExceptionData.getProviderScheduleExceptionByProviderScheduleId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            providerScheduleExceptionData = null;
            return  resultMethod(err,result);});
}
//*******************************************************************************************
//
//get ProviderScheduleException By ProviderSchedule Id Year Month Day for external connection
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay = function(id,year,month,day, resultMethod,connection) {
    var providerScheduleExceptionData = new providerScheduleExceptionDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleExceptionData.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay(id,function (err,result)
            {
              return  callback(err,result);
            },connection);

        }],function(err,result){
            providerScheduleExceptionData = null;
            return  resultMethod(err,result);});
}
//*******************************************************************************************
//
//deactivate
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.deactivateProviderScheduleException = function(providerScheduleException, resultMethod) {
    var providerScheduleExceptionData = new providerScheduleExceptionDAL();
try
{
    //create a connection for the transaction
    providerScheduleExceptionData.pool.getConnection(function(err,connection){
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
                function authorize(callback)
                {
                    providerScheduleExceptionData.getProviderScheduleExceptionByIdProviderScheduleIdProviderId(providerScheduleException.id,providerScheduleException.providerScheduleId,context.getUser.id ,function (err,result) {
                        
                        return callback(err,result);
                    },connection);
                },    
                    
//method to prepare the data
//*******************************************************************************************
                function prepare(data , callback)
                {
                    if(Object.keys(data).length >0 )
                    {
                    providerScheduleException.modificationDate =new Date();
                        return callback(null,providerScheduleException);
                    }
                    else
                    {
                        return callback({name: "Error at deactive the provider schedule exception.", message:"There are invalid parameters."},null);
                    }   
                },
//Deactivate
//******************************************************************************************* 
                function deactivate(providerScheduleException,callback)
                {
                    providerScheduleExceptionData.deactivateProviderScheduleException(providerScheduleException,function (err,result)
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
                                    //Refresh the list cache
                                    callback(err,providerScheduleException.providerScheduleId);});
                            }
                            logger.log("debug","commit" , providerScheduleException);
                       
                        });
                    return callback(err,result );
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleExceptionData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleExceptionData = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
//Deactivate all the data by the provider schedule Id
//
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.deactivateProviderScheduleExceptionByProviderScheduleId = function(id, resultMethod,connection) {
 var providerScheduleExceptionData = new providerScheduleExceptionDAL();
try
{
 providerScheduleExceptionData.deactivateProviderScheduleExceptionByProviderScheduleId(id,function (err,result)
                    {
                        return  resultMethod(err,result);
                    });
}
 catch(err)
    {
         providerScheduleExceptionData = null;
         return resultMethod(err,null );
    }
}
//********************************************************************************************
module.exports =  providerScheduleExceptionLogic;