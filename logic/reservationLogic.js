//*******************************************************************************************
//Name: Reservation Logic
//Description: Reservation logic class
//Target : Reservation Creation , Administration of Reservations
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var reservationDAL = require('data/dal/reservationDAL');
var providerScheduleDayLogic = require('./providerScheduleDayLogic');
var providerScheduleExceptionLogic = require('./providerScheduleExceptionLogic');
var reservationDetailLogic = require ('./reservationDetailLogic')
var logger = require('utilities/logger');
var uuid = require('node-uuid');
var moment = require('moment');
var config = require('config');
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');

var context = require('security/context');
//*******************************************************************************************
//constants
var constants = require('global/constants');
//*****************************************************

var reservationLogic = function()
{
  
   reservationLogic.prototype.self = this;
};



//*******************************************************************************************
//
//Validation for Provider Schedule
//
//*******************************************************************************************
reservationLogic.prototype.validate = function (reservation, callback) {
var validatorM = new validatorManager();   
            
        
         
            if(  (!validator.isNullOrUndefined( reservation.customerId ) && !validator.isBoolean( providerSchedule.isDefault)) )
           {
                validatorM.addException("customerId is invalid.");
           }
           if(  !validator.isNullOrUndefined( reservation.providerId )  )
           {
                validatorM.addException("providerId is invalid.");
           }
               if(  !validator.isNullOrUndefined( reservation.providerScheduleId )  )
           {
                validatorM.addException("providerScheduleId is invalid.");
           }
                   if(  !validator.isNullOrUndefined( reservation.latitude )  )
           {
                validatorM.addException("latitude is invalid.");
           }
                   if(  !validator.isNullOrUndefined( reservation.longitude )  )
           {
                validatorM.addException("longitude is invalid.");
           }
                   if(  (!validator.isNullOrUndefined( reservation.address ) && !validator.isLength( reservation.address,{min:0, max:250})))
           {
                validatorM.addException("address is invalid.");
           }
                   if(  !validator.isNullOrUndefined( reservation.cancelationReason ) && !validator.isLength( reservation.cancelationReason,{min:0, max:250}) )
           {
                validatorM.addException("cancelationReason is invalid.");
           }
                   if(  !validator.isNullOrUndefined( reservation.date )  )
           {
                validatorM.addException("date is invalid.");
           }
                      if(  !validator.isNullOrUndefined( reservation.startTime )  )
           {
                validatorM.addException("startTime is invalid.");
           }
                     if(  !validator.isNullOrUndefined( reservation.endTime )  )
           {
                validatorM.addException("endTime is invalid.");
           }
                     if(  !validator.isNullOrUndefined( reservation.state )  )
           {
                validatorM.addException("state is invalid.");
           }
                      if(validatorM.isValid())
            return callback(null ,true);
            else
            return callback({name:"Error in Provider Schedule Validation", message : validatorM.GenerateErrorMessage()},false);
}

//*******************************************************************************************
//
//validation of the required fields for the reservation creation
//
//*******************************************************************************************
reservationLogic.prototype.validateFields = function(reservation) {


 
      return (
    reservation.hasOwnProperty("date")
    &&
    validator.isDate(reservation.date)
    &&
    reservation.hasOwnProperty("customerId")
     &&
    reservation.hasOwnProperty("providerId")
    &&
    reservation.hasOwnProperty("providerScheduleId") );
                   

}
//*******************************************************************************************
//
//validation of the required fields for the reservation creation
//
//*******************************************************************************************
reservationLogic.prototype.validateTime = function(reservation,providerScheduleDayList,providerScheduleDayException,dataRequested) { 
//convert the string into dates
   var providerScheduleDay =null;
   var isValid = true;
   if( Object.keys(providerScheduleDayException).length <=0)
   {
       
    for (var sd = 0; sd < providerScheduleDayList.length; sd++) 
    {
     isValid =true;
    providerScheduleDay = providerScheduleDayList[sd];  
    var startTimeCalendar = moment(providerScheduleDay.startTime ,'HH:mm:ss');
    var endTimeCalendar = moment(providerScheduleDay.endTime ,'HH:mm:ss'); 
    var startTimeReservation =  moment(reservation.startTime ,'HH:mm:ss');
    var endTimeReservation =  moment(reservation.endTime,'HH:mm:ss' );
    
    //check if they are valid dates and if the endtime is bigger than the start time , and at 
    //least the schedule has an hour                
    if( startTimeReservation.isValid() && endTimeReservation.isValid() && endTimeReservation.diff(startTimeReservation)>=1)
    {
        
        if(startTimeCalendar <= startTimeReservation && endTimeCalendar >= startTimeReservation &&
    endTimeCalendar >= endTimeReservation && startTimeCalendar < endTimeReservation )
    {
        
        var rStartTime = null;
        var rEndTime = null;
        //compare the entry with previous dates
        for (var i = 0; i < dataRequested.length; i++) 
        { 
                
            rStartTime =  moment(dataRequested[i].startTime ,'HH:mm:ss');
            rEndTime =  moment(dataRequested[i].endTime,'HH:mm:ss' );
            if( ((startTimeReservation >= rStartTime && startTimeReservation <= rEndTime ) ||
            (endTimeReservation >= rStartTime && endTimeReservation <= rEndTime )) 
            &&
            reservation.date.isSame(dataRequested[i].date)
            &&
            dataRequested[i].id != reservation.id )
            {
               
                isValid = false;
            }
           
                rStartTime = null;
                rEndTime = null;
        }
    }
    else
    {
        isValid = false;
    }
    }
    else
    {
        isValid=false;
    }
    startTimeReservation = null;
    endTimeReservation = null;
    if( isValid)
    {
        providerScheduleDay =null;
        return true;
    }
   }
   }
    providerScheduleDay = null;
    startTimeReservation = null;
    endTimeReservation = null;
   return false;
}
//*******************************************************************************************
//
//Method to Create an entry to the reservation
//
//*******************************************************************************************
reservationLogic.prototype.createReservation = function(reservation, resultMethod) {
    
var reservationData = new reservationDAL();
var reservationDetailVerification = null;
var providerScheduleDayL = new providerScheduleDayLogic();
var reservationDetailL = new reservationDetailLogic();
var providerScheduleExceptionL = new providerScheduleExceptionLogic();
try
{
    //create a connection for the transaction
    reservationData.pool.getConnection(function(err,connection){
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
                    reservationLogic.prototype.self.validate(reservation,function(err,result)
                    {
                        return callback(err);
                    })
                },

//Check if the reservation is ok
//*******************************************************************************************
                function checkReservationDetail( callback)
                {
                    // create object for retain reservationDetails, reservation , schedule Dates , schedule Exceptions and previous reservations
                    reservationDetailVerification = reservationDetailL.validateTime(reservation.reservationDetail);
                    
                    return callback(null);
                },
//If the time is correct proceed to create the reservation time
//*******************************************************************************************
                function checkVerificationDate(callback)
                {
                    if(reservationDetailVerification.totalTime == 0)
                    {
                         return callback({name: "Error at create the reservation", message:"There are reservation details are incorrect."},null);

                    }
                    else
                    {
                        reservation.startTime = reservationDetailVerification.startTime;
                        reservation.endTime = reservationDetailVerification.endTime;
                        var tmp =  moment(reservation.date);
                        tmp.format(config.get('chameleon.date.format'));
                         if(tmp !== null || tmp.isValid())
                             {
                                  reservation.date = tmp;
                             }
                             else
                             {
                                   return callback({name: "Error at create the reservation.", message:"There are invalid parameters."},null);
                             }   
                       
                        return callback(null);
                    }
                },
//get the schedule times
//*******************************************************************************************                
                function getScheduleDay( callback)
                {
                    var reservationDay = reservation.date.day();
                    providerScheduleDayLogic.getProviderScheduleDayByProviderScheduleIdDayOfWeek(reservation.providerScheduleId, reservationDay,function(err,result)
                    {
                        if(result.length > 0)
                        {
                            reservationDetailVerification.providerScheduleDay = result;
                            return callback(err);
                        }
                        else
                        {
                              return callback({name: "Error at create the reservation", message:"There are no reservation schedules defined."},null);

                        }
                    },connection);
                },
//get if there are any schedule exception for this date
//*******************************************************************************************                
                function getScheduleException(callback)
                {
                    providerScheduleExceptionLogic.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay(reservation.providerScheduleId,reservation.date.year(),reservation.date.month()+1,reservation.date.date()   ,function (err,result)
                    {
                        
                          reservationDetailVerification.providerScheduleException = result;
                          return callback(err);
                        
                    },connection);
                },
//get if there are any previous reservations for this date
//*******************************************************************************************                     
                function getPreviousReservationsData(callback)
                {
                     reservationData.getReservationByProviderScheduleIdYearMonthDay(reservation.providerScheduleId,reservation.date.year(),reservation.date.month()+1,reservation.date.date()   ,function (err,result)
                    {
                        
                          reservationDetailVerification.previousReservations = result;
                          return callback(err,reservationDetailVerification);
                        
                    },connection);
                    
                },
//Validate data for create reservation
//*******************************************************************************************                   
                function validatePreviousInformation(  callback)
                {
                    if(reservationLogic.prototype.validateTime(reservation,reservationDetailVerification.providerScheduleDay,
                    reservationDetailVerification.providerScheduleException ,reservationDetailVerification.previousReservations  ))
                    {
                         return callback(null);
                    }
                    else
                    {
                          return callback({name: "Error at create the reservation.", message:"There are invalid dates."},null);
                    }
                    
                }, 
                 
 //Preparing the reservation data
//*******************************************************************************************                   
                 //method to prepare the data    
                function prepare(callback)
                {
                    var localDate = new Date();
                    reservation.id =uuid.v4();
                    reservation.modificationDate = localDate;
                    reservation.creationDate = localDate;
                    reservation.isActive = true;
                    reservation.isCanceled =false;
                    reservation.date = reservation.date.toISOString();
                    callback(null);
                },    
//method to create the reservation
//*******************************************************************************************       
                function createReservation(callback)
                {
                    reservationData.createReservation(reservation,function (err,result)
                    {
                        logger.log("debug","save" , reservation); 
                        return callback(err,result );
 
                    },connection);

        },
//method to create the reservation details
//*******************************************************************************************               
        function createReservationDetails(result, callback)
        {
              mod_vasync.forEachPipeline(
                  {
                      'func':function createReservationDetails(item,callback)
                      {
                         reservationDetailL.createReservationDetail(item,reservation.id,function(err,result)
                         {
                                 return callback(err,result);                             
                         },connection); 
                      },
                      'inputs': reservationDetailVerification.reservationDetailList 
                      
                  },function(err,result)
                  {
                      
                      return callback(err,result);
                  }
              );
            
        },
//Method to obtain all the reservations by id
//*******************************************************************************************        
        function getById (data, callback)
        {
                reservationData.getReservationById(reservation.id,function (err,result)
                {
                  
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                        if(err)
                        {
                            return connection.rollback(function() {
                                connection.release();
                                reservationData = null;
                                reservationDetailVerification = null;
                                providerScheduleDayL = null;
                                reservationDetailL=null;
                                providerScheduleExceptionL = null;
                                resultMethod(err,null);});
                        }
                        //if no error commit
                        connection.commit(function(err) 
                        {
                            if(err)
                            {
                                return connection.rollback(function() {
                                    connection.release();
                                    reservationData = null;
                                    reservationDetailVerification = null;
                                    providerScheduleDayL = null;
                                    reservationDetailL=null;
                                    providerScheduleExceptionL = null;
                                    resultMethod(err,null);});
                            }
                            else
                            {
                                logger.log("debug","commit" , reservation);
                                connection.release();
                                reservationData = null;
                                reservationDetailVerification = null;
                                providerScheduleDayL = null;
                                reservationDetailL=null;
                                providerScheduleExceptionL = null;
                                return resultMethod(null,result );
                            }
                        });
               
        });

        });
    });
    }
    catch(err)
    {
        reservationData = null;
        reservationDetailVerification = null;
        providerScheduleDayL = null;
        reservationDetailL=null;
        providerScheduleExceptionL = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
//reservation validation for the workflow, validates the states of the petition
//
//*******************************************************************************************
reservationLogic.prototype.approvalReservationValidation = function (  reservation, originalReservation)
{
var  verification = false;    
//firts validation
//*******************************************************************************************
if( originalReservation.state == constants.REQUEST_STATES_RESERVATION.SUBMITED && originalReservation.isActive
&& ((originalReservation.customerId == reservation.customerId)&&(originalReservation.providerId == reservation.providerId)))
    {
        switch (reservation.state) {
            case constants.REQUEST_STATES_RESERVATION.APPROVED:
            // the person who is accepting is the customer's friend
            verification = ( originalReservation.providerId == context.getUser.id && originalReservation.state == constants.REQUEST_STATES_RESERVATION.SUBMITED);
            break;
  
        case constants.REQUEST_STATES_RESERVATION.CANCELED:
          // the person who is accepting is the customer's friend
            verification = ( originalReservation.providerId == context.getUser.id  || originalReservation.customerId == context.getUser.id   && originalReservation.state != constants.REQUEST_STATES_RESERVATION.COMPLETED) ;
            break;
         case constants.REQUEST_STATES_RESERVATION.COMPLETED:
          // the person who is accepting is the customer's friend
            verification = ( originalReservation.customerId == context.getUser.id   && originalReservation.state == constants.REQUEST_STATES_RESERVATION.APPROVED) ;
            break;    
         default:verification = false;
        break;
    }    
}
// no workflow required already decided
return verification;    
}
//*******************************************************************************************
//
//method to Update reservations
//
//*******************************************************************************************
reservationLogic.prototype.approvalReservation = function(reservation, resultMethod) {
var reservationData = new reservationDAL();
try
{
    //create a connection for the transaction
    reservationData.pool.getConnection(function(err,connection){
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
                    reservationLogic.prototype.self.validate(reservation,function(err,result)
                    {
                        return callback(err);
                    })
                },
//method to prepare the data
//*******************************************************************************************    
                function getData(callback)
                {
                    reservationData.getReservationById(reservation.id,function (err,result)
                    {
                        return  callback(err,result);
                    },connection);
                },
//authorize
//*******************************************************************************************
                function authorize(data,callback)
                {
                    if( Object.keys(data).length <=0)
                    {	
                      return callback({name: "Error at reservation's approval", message:"Invalid operation."},null);
                    }
                    else
                    {
                        if (reservationLogic.prototype.self.approvalReservationValidation( reservation, data))
                        {
                            //prepare data
                            reservation.modificationDate =new Date();
                            delete reservation.customerId;
                            delete reservation.providerId;
                            delete reservation.creationDate;
                            delete reservation.isActive;
                            
                            return callback(null);
                }
                else
                {
                     return callback({name: "Error at reservation's approval", message:"Invalid operation."},null);
                }
                
            }
                },
//update
//*******************************************************************************************   
                function updateReservation(callback)
                {
                    reservationData.updateReservation(reservation,reservation.id,function (err,result)
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
                                logger.log("debug","commit" , reservation);
                                return callback(null,reservation );
                            }
                        });
                     
                  
                    },connection);

        },
//get information by id
//*******************************************************************************************            
        function getById (reservation, callback)
        {
           
                reservationData.getReservationById(reservation.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                reservationData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         reservationData = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************
//
//Method to Select reservation By Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationById = function(id, resultMethod) {
     var reservationData = new reservationDAL();
        mod_vasync.waterfall([ function Get (callback){
            reservationData.getReservationById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            reservationData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
//Method to Select reservation By Customer Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByCustomerId = function(id, resultMethod) {
     var reservationData = new reservationDAL();
        mod_vasync.waterfall([ function Get (callback){
            reservationData.getReservationByCustomerId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            reservationData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
//Method to Select reservation By Provider Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByProviderId = function(id, resultMethod) {
     var reservationData = new reservationDAL();
        mod_vasync.waterfall([ function Get (callback){
            reservationData.getReservationByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            reservationData = null;
            return  resultMethod(err,result);});
};


//*******************************************************************************************
//
//Method to deactivate reservation
//
//*******************************************************************************************
reservationLogic.prototype.deactivateReservation = function(reservation, resultMethod) {
    var reservationData = new reservationDAL();
try
{
    //create a connection for the transaction
    reservationData.pool.getConnection(function(err,connection){
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
                    reservation.modificationDate =new Date();
                    callback(null,reservation);
                },
                //Deactivate 
                function deactivate(reservation,callback)
                {
                    reservationData.deactivateReservation(reservation,function (err,result)
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
                                logger.log("debug","commit" , reservation);
                                return callback(err,result );
                            }
                       
                        });
                    
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                reservationData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         reservationData = null;
         return resultMethod(err,null );
    }
        
};
//********************************************************************************************
module.exports =  reservationLogic;