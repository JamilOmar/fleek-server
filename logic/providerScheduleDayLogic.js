//*******************************************************************************************
//Name: Provider Schedule Day Logic
//Description: Provider Schedule Day logic class
//Target : Provider Schedule Day  Creation , Administration of Provider Schedule Day 
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var providerScheduleDayDAL = require('data/dal/providerScheduleDayDAL');
var logger = require('utilities/logger');
var moment = require('moment');
var uuid = require('node-uuid');

//*******************************************************************************************
var providerScheduleDayLogic = function()
{
  
   providerScheduleDayLogic.prototype.self = this;
};
//*******************************************************************************************
//
//Validation of the required fields for the Schedule creation
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.validateFields = function(providerScheduleDay) {


 
      return (
    providerScheduleDay.hasOwnProperty("startTime")
    &&
    providerScheduleDay.hasOwnProperty("endTime")
    &&
    providerScheduleDay.hasOwnProperty("dayOfWeek")
    &&
    providerScheduleDay.hasOwnProperty("providerScheduleId") );
                   

}
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
    if( startTime.isValid() && endTime.isValid() && endTime.diff(startTime)>=1 
    //Day of week validation from Sunday 0 to Saturday 6
    && (providerScheduleDay.dayOfWeek >= 0 && providerScheduleDay.dayOfWeek <=6 ))
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
providerScheduleDayLogic.prototype.createProviderScheduleDay = function(currentUserId,providerScheduleDay, resultMethod) {
var providerScheduleDayData = new providerScheduleDayDAL();
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
                function validate(callback)
                {
                   //validate if the dates and required fields are submited 
                   if(providerScheduleDayLogic.prototype.validateFields(providerScheduleDay))
                    {
                   //if the data is correct continue       
                        return callback(null,providerScheduleDay);
                    }
                    else
                    {
                        return callback({name: "Error at create the provider schedule of the day", message:"There are missing parameters."},null);
                    }
                },
                function getPreviousData(providerScheduleDay,callback)
                {
                    //Gets the previous day per calendar
                    
                    providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek(providerScheduleDay.providerScheduleId,providerScheduleDay.dayOfWeek ,function (err,result)
                    {
                        
                        try
                        {
                            if(providerScheduleDayLogic.prototype.validateTime( providerScheduleDay,result) )
                            {
                                return callback(null,providerScheduleDay);   
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
                function prepareData(providerScheduleDay,callback)
                {
                    var localDate = new Date();
                    providerScheduleDay.id =uuid.v4();
                    providerScheduleDay.modificationDate = localDate;
                    providerScheduleDay.creationDate = localDate;
                    providerScheduleDay.isActive = true;
                    return callback(null,providerScheduleDay);   
                },    
                //method to create the providerScheduleDay    
                function createProviderScheduleDay(providerScheduleDay,callback)
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
                            logger.log("debug","commit" , providerScheduleDay);
                        });
                          
                    return callback(null,providerScheduleDay.id );
                    },connection);

        },
        //get information by id       
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
//Update the provider schedule day
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.updateProviderScheduleDay = function(currentUserId,providerScheduleDay, resultMethod) {
var providerScheduleDayData = new providerScheduleDayDAL();
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
                function validate(callback)
                {
                   //validate if the dates and required fields are submited 
                   if(providerScheduleDayLogic.prototype.validateFields(providerScheduleDay))
                    {
                   //if the data is correct continue       
                        return callback(null,providerScheduleDay);
                    }
                    else
                    {
                        return callback({name: "Error at create the provider schedule of the day", message:"There are missing parameters."},null);
                    }
                },
                function getPreviousData(providerScheduleDay,callback)
                {
                    //Gets the previous day per calendar
                    
                    providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek(providerScheduleDay.providerScheduleId,providerScheduleDay.dayOfWeek ,function (err,result)
                    {
                        
                        try
                        {
                            if(providerScheduleDayLogic.prototype.validateTime( providerScheduleDay,result) )
                            {
                                return callback(null,providerScheduleDay);   
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
                function prepareData(providerScheduleDay,callback)
                {
                    var localDate = new Date();
                    providerScheduleDay.modificationDate = localDate;
                    return callback(null,providerScheduleDay);   
                },    
                //method to create the providerScheduleDay    
                function updateProviderScheduleDay(providerScheduleDay,callback)
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
                            logger.log("debug","commit" , providerScheduleDay);
                        });
                          
                    return callback(null,providerScheduleDay.id );
                    },connection);

        },
        //get information by Schedule id            
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
//Deactivate
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.deactivateProviderScheduleDay = function(providerScheduleDay, resultMethod) {
    var providerScheduleDayData = new providerScheduleDayDAL();
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
                    
                //method to prepare the data
                function prepare(callback)
                {
                    providerScheduleDay.modificationDate =new Date();
                    callback(null,providerScheduleDay);
                },
                //Deactivate 
                function deactivate(providerScheduleDay,callback)
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
                            logger.log("debug","commit" , providerScheduleDay);
                       
                        });
                    return callback(err,result );
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
//Deactivate all the data by the provider schedule Id
//
//*******************************************************************************************
providerScheduleDayLogic.prototype.deactivateAllProviderScheduleDayByProviderScheduleId = function(id, resultMethod,connection) {
  var providerScheduleDayData = new providerScheduleDayDAL();
try
{
 providerScheduleDayData.deactivateProviderScheduleDay(id,function (err,result)
                    {
                        return  resultMethod(err,result);
                    });
}
 catch(err)
    {
         providerScheduleDayData = null;
         return resultMethod(err,null );
    }
}


//********************************************************************************************
module.exports =  providerScheduleDayLogic;