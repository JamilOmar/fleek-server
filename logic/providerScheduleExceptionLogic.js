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
var logger = require('utilities/logger');
var uuid = require('node-uuid');
var moment = require('moment');
var config = require('config');
//*******************************************************************************************
var providerScheduleExceptionLogic = function()
{
  
   providerScheduleExceptionLogic.prototype.self = this;
};
//validation of the required fields for the Exception creation
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.validateFields = function(providerScheduleException) {


 
      return(
    providerScheduleException.hasOwnProperty("date")
    &&
    providerScheduleException.hasOwnProperty("description"));
   
 
}


//create
//*******************************************************************************************
providerScheduleExceptionLogic.prototype.createProviderScheduleException = function(currentUserId,providerScheduleException, resultMethod) {
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
                 //method to validate the data    
                function validate(callback)
                {
                    try
                    {
                   //validate if the dates and required fields are submited 
                   if(providerScheduleExceptionLogic.prototype.validateFields(providerScheduleException))
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
                        return callback({name: "Error at create the provider schedule exception.", message:"There are missing parameters."},null);
                    }
                    }
                    catch (err)
                    {  
                        return callback(err,null);
                        
                    }
                },
//check if previous data e
//*******************************************************************************************
                function checkExistingProviderSchedule (callback)
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
                //method to check if the dates are correct
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
                            }
                            logger.log("debug","commit" , providerScheduleException);
                        });
                          
                    return callback(null,providerScheduleException.id );
                    },connection);

        },
        //get information by id       
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

//update
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
                 //method to validate the data    
                function validate(callback)
                {
                    try
                    {
                   //validate if the dates and required fields are submited 
                   if(providerScheduleExceptionLogic.prototype.validateFields(providerScheduleException))
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
                        return callback({name: "Error at update the provider schedule exception.", message:"There are missing parameters."},null);
                    }
                    }
                    catch (err)
                    {  
                        return callback(err,null);
                        
                    }
                },
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
                function prepareData(providerScheduleException,callback)
                {
                    var localDate = new Date();
                    providerScheduleException.date = providerScheduleException.date.toISOString();
                    providerScheduleException.modificationDate = localDate;
                    delete providerScheduleException.isActive;
                    delete providerScheduleException.creationDate;
                    delete providerScheduleException.providerScheduleId;
                    return callback(null,providerScheduleException);   
                },    
                //method to update the providerScheduleException    
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

//get providerScheduleException by Id
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

//get providerScheduleException by provider schedule Id
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


//deactivate
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
                    
                //method to prepare the data
                function prepare(callback)
                {
                    providerScheduleException.modificationDate =new Date();
                    callback(null,providerScheduleException);
                },
                //Deactivate 
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



//********************************************************************************************
module.exports =  providerScheduleExceptionLogic;