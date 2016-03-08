//*******************************************************************************************
//Name: Provider Schedule Day Logic
//Description: Provider Schedule Day logic class
//Target : Provider Schedule Day  Creation , Administration of Provider Schedule Day 
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync  = require("vasync");
var providerScheduleDAL = require('data/dal/providerScheduleDAL');
var providerScheduleDayDAL = require('data/dal/providerScheduleDayDAL');
var logger = require('utilities/logger');
var moment = require('moment');
var uuid = require('node-uuid');
var validator =require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var context = require('security/context');
//*******************************************************************************************
var providerScheduleDayLogic = function()
{
  
   providerScheduleDayLogic.prototype.self = this;
};


//*******************************************************************************************
//
//Validation for Provider Schedule Day
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.validate = function (providerScheduleDay,callback) {
var validatorM = new validatorManager();   
           if(  validator.isNullOrUndefined( providerScheduleDay.startTime )  )
           {
                validatorM.addException("StartTime Id is required.");
           }
           if(  validator.isNullOrUndefined( providerScheduleDay.endTime ) ) 
           {
                validatorM.addException("EndTime is required.");
           }
            if(!validator.isNullOrUndefined( providerScheduleDay.dayOfWeek ) && !validator.isNumberAndIntegerAndRange( providerScheduleDay.dayOfWeek, 0, 6) )
           {
                validatorM.addException("DayOfWeek is invalid.");
           }
            if(validator.isNullOrUndefined( providerScheduleDay.providerScheduleId ) )
           {
                validatorM.addException("ProviderScheduleId is invalid.");
           }
 
         if (validatorM.isValid()) {
        validatorM = null;
        return callback(null, true);
    } else {
        var message = validatorM.GenerateErrorMessage();
        validatorM = null;
        return callback({
            name: "Error in Provider Schedule Day Validation",
            message: message
        }, false);
    }}

//*******************************************************************************************
//
//Validation of the required fields for the Schedule creation
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.validateTime = function(providerScheduleDay,dataRequested) { 
//convert the string into dates
    var startTime =  moment(providerScheduleDay.startTime ,'HH:mm:ss');
    var endTime =  moment(providerScheduleDay.endTime,'HH:mm:ss' );
    //check if they are valid dates and if the endtime is bigger than the start time , and at 
    //least the schedule has an hour                
    if( startTime.isValid() && endTime.isValid() && endTime.diff(startTime)>=1)
    {
        var dStartTime = null;
        var dEndTime = null;
        //compare the entry with previous dates
        for (var i = 0; i < dataRequested.length; i++) 
        { 
                
            dStartTime =  moment(dataRequested[i].startTime ,'HH:mm:ss');
            dEndTime =  moment(dataRequested[i].endTime,'HH:mm:ss' );
            if( ((startTime >= dStartTime && startTime <= dEndTime ) ||
            (endTime >= dStartTime && endTime <= dEndTime )) 
            &&
            dataRequested[i].dayOfWeek == providerScheduleDay.dayOfWeek
            &&
            dataRequested[i].id != providerScheduleDay.id )
            {
                //the new date is on an interval of a previous date
                dStartTime = null;
                dEndTime = null;
                startTime = null;
                endTime = null;
                return false;
            }
            else
            {
                dStartTime = null;
                dEndTime = null;
            }
        }
        //no previous dates
        return true;
    }
    else
    {
        startTime = null;
        endTime = null;
        return false;
    }
}
//*******************************************************************************************
//
//Create provider schedule day
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.createProviderScheduleDay = function(providerScheduleDay, resultMethod) {
var providerScheduleDayData = new providerScheduleDayDAL();
var providerScheduleData = new providerScheduleDAL();
var contextUser = context.getUser();
try
{
    //create a connection for the transaction
    providerScheduleDayData.pool.getConnection(function(err,connection){
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
                    providerScheduleDayLogic.prototype.self.validate(providerScheduleDay,function(err,result)
                    {
                        return callback(err);
                    })
                },                             
//method to authorize the data
//*******************************************************************************************    
                function authorize(callback)
                {
                   providerScheduleData.getProviderScheduleByIdProviderId(providerScheduleDay.providerScheduleId, contextUser.id,function (err,result) {
                        
                        return callback(err,result);
                    });
                   
                },                    
//method to validate the data
//*******************************************************************************************    
                function validate(data, callback)
                {
                   //validate if the dates and required fields are submited 
                   if(Object.keys(data).length >0 )
                    {
                   //if the data is correct continue       
                        return callback(null);
                    }
                    else
                    {
                        return callback({name: "Error at create the provider schedule of the day", message:"There are invalid parameters."},null);
                    }
                },
//get the previous 
//*******************************************************************************************   
                function getPreviousData(callback)
                {
                    //Gets the previous day per calendar
                    
                    providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek(providerScheduleDay.providerScheduleId,providerScheduleDay.dayOfWeek ,function (err,result)
                    {
                        
                        try
                        {
                            if(providerScheduleDayLogic.prototype.validateTime( providerScheduleDay,result) )
                            {
                                return callback(null);   
                            }
                            else
                            {
                                return callback({name: "Error at create the provider schedule of the day", message:"There is a similar date."},null);
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
                function prepareData(callback)
                {
                    var localDate = new Date();
                    providerScheduleDay.id =uuid.v4();
                    providerScheduleDay.modificationDate = localDate;
                    providerScheduleDay.creationDate = localDate;
                    providerScheduleDay.isActive = true;
                    return callback(null);   
                },    
//method to create the providerScheduleDay
//*******************************************************************************************     
                function createProviderScheduleDay(callback)
                {
                    providerScheduleDayData.createProviderScheduleDay(providerScheduleDay,function (err,result)
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
                                logger.log("debug","commit" , providerScheduleDay);
                                return callback(null,providerScheduleDay.id );
                            }
                        });
                          
                    
                    },connection);

        },
//get information by id
//*******************************************************************************************       
        function getById (id, callback)
        {
                providerScheduleDayData.getProviderScheduleDayById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleDayData = null;
                providerScheduleData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleDayData = null;
         providerScheduleData = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
//Update the provider schedule day
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.updateProviderScheduleDay = function(providerScheduleDay, resultMethod) {
var providerScheduleDayData = new providerScheduleDayDAL();
var contextUser = context.getUser();
try
{
    //create a connection for the transaction
    providerScheduleDayData.pool.getConnection(function(err,connection){
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
                    providerScheduleDayLogic.prototype.self.validate(providerScheduleDay,function(err,result)
                    {
                        return callback(err);
                    })
                },                          
                    //method to authorize the data
//*******************************************************************************************    
                function authorize(callback)
                {
                   providerScheduleDayData.getProviderScheduleDayByIdProviderScheduleIdProviderId(providerScheduleDay.id,providerScheduleDay.providerScheduleId, contextUser.id,function (err,result) {
                        
                        return callback(err,result);
                    },connection);
                   
                },                    
//method to validate the data
//*******************************************************************************************        
                function validate(data,callback)
                {
                   //validate if the dates and required fields are submited 
                   if(Object.keys(data).length >0 )
                    {
                   //if the data is correct continue       
                        return callback(null);
                    }
                    else
                    {
                        return callback({name: "Error at create the provider schedule of the day", message:"There are invalid parameters."},null);
                    }
                },
//Gets the previous day per calendar                
//*******************************************************************************************                      
                function getPreviousData(callback)
                {
                 
                    
                    providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek(providerScheduleDay.providerScheduleId,providerScheduleDay.dayOfWeek ,function (err,result)
                    {
                        
                        try
                        {
                            if(providerScheduleDayLogic.prototype.validateTime( providerScheduleDay,result) )
                            {
                                return callback(null);   
                            }
                            else
                            {
                                return callback({name: "Error at create the provider schedule of the day", message:"There is a similar date."},null);
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
                function prepareData(callback)
                {
                    var localDate = new Date();
                    providerScheduleDay.modificationDate = localDate;
                    providerScheduleDay.providerScheduleId = undefined;
                    providerScheduleDay.isActive = undefined;
                    return callback(null);   
                },    
//method to create the providerScheduleDay
//*******************************************************************************************                          
                function updateProviderScheduleDay(callback)
                {
                    providerScheduleDayData.updateProviderScheduleDay(providerScheduleDay,providerScheduleDay.id,function (err,result)
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
                                logger.log("debug","commit" , providerScheduleDay);
                                 return callback(null,providerScheduleDay.id );
                            }
                        });
                          
                  
                    },connection);

        },
//get information by Schedule id
//*******************************************************************************************                                  
        function getById (id, callback)
        {
                providerScheduleDayData.getProviderScheduleDayById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleDayData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleDayData = null;
         return resultMethod(err,null );
    }
        
};

//*******************************************************************************************
//
//Get providerScheduleDay by Id
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.getProviderScheduleDayById = function(id, resultMethod) {
     var providerScheduleDayData = new providerScheduleDayDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleDayData.getProviderScheduleDayById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            providerScheduleDayData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
//Get providerScheduleDay by provider schedule Id
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.getProviderScheduleDayByProviderScheduleId = function(id, resultMethod) {
    var providerScheduleDayData = new providerScheduleDayDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleDayData.getProviderScheduleDayByProviderScheduleId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            providerScheduleDayData = null;
            return  resultMethod(err,result);});
}

//*******************************************************************************************
//
// Get ProviderScheduleDay By Provider Schedule Id DayOfWeek for external connection
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.getProviderScheduleDayByProviderScheduleIdDayOfWeek = function(id,dayOfWeek, resultMethod,connection) {
    var providerScheduleDayData = new providerScheduleDayDAL();
        mod_vasync.waterfall([ function Get (callback){
            providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek(id,dayOfWeek,function (err,result)
            {
              return  callback(err,result);
            },connection);

        }],function(err,result){
            providerScheduleDayData = null;
            return  resultMethod(err,result);});
}


//*******************************************************************************************
//
//Deactivate
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.deactivateProviderScheduleDay = function(providerScheduleDay, resultMethod) {
    var providerScheduleDayData = new providerScheduleDayDAL();
    var contextUser = context.getUser();
try
{
    //create a connection for the transaction
    providerScheduleDayData.pool.getConnection(function(err,connection){
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
//*******************************************************************************************    
                function authorize(callback)
                {
                   providerScheduleDayData.getProviderScheduleDayByIdProviderScheduleIdProviderId(providerScheduleDay.id,providerScheduleDay.providerScheduleId, contextUser.id,function (err,result) {
                        
                        return callback(err,result);
                    },connection);
                   
                },                    

//method to prepare the data
//*******************************************************************************************    
                function prepare(data,callback)
                {
                    if(Object.keys(data).length >0 )
                    {
                        providerScheduleDay.modificationDate =new Date();

                        callback(null);
                    
                    }
                    else
                    {
                        return callback({name: "Error at deactive the provider schedule day.", message:"There are invalid parameters."},null);
                    }   
                },
//Deactivate
//*******************************************************************************************     
                function deactivate(callback)
                {
                    providerScheduleDayData.deactivateProviderScheduleDay(providerScheduleDay,function (err,result)
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
                                    callback(err,providerScheduleDay.providerScheduleId);});
                            }
                            else
                            {
                                logger.log("debug","commit" , providerScheduleDay);
                                return callback(err,result );
                            }
                        });
                   
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                providerScheduleDayData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         providerScheduleDayData = null;
         return resultMethod(err,null );
    }
        
};

//********************************************************************************************
module.exports =  providerScheduleDayLogic;