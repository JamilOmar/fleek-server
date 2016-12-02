//*******************************************************************************************
//Name: Reservation Logic
//Description: Reservation logic class
//Target : Reservation Creation , Administration of Reservations
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync = require("vasync");
var reservationDAL = require('data/dal/reservationDAL');
var providerScheduleDAL = require('data/dal/providerScheduleDAL');
var providerScheduleDayDAL = require('data/dal/providerScheduleDayDAL');
var providerScheduleExceptionDAL = require('data/dal/providerScheduleExceptionDAL');
var reservationDetailLogic = require('./reservationDetailLogic');
var userRatingLogic = require('./userRatingLogic')
var logger = require('utilities/logger');
var uuid = require('node-uuid');
var moment = require('moment');
var config = require('config');
require("moment-duration-format");
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var context = require('security/context');
//*******************************************************************************************
//constants
var constants = require('global/constants');
//*****************************************************

var reservationLogic = function() {

    reservationLogic.prototype.self = this;
};



//*******************************************************************************************
//
//Validation for Provider Schedule
//
//*******************************************************************************************
reservationLogic.prototype.validate = function(reservation, callback) {
    var validatorM = new validatorManager();


    if (!validator.isNullOrUndefined(reservation.state) && !validator.isNumberAndIntegerAndRange(reservation.state, constants.REQUEST_STATES_RESERVATION.CANCELED, constants.REQUEST_STATES_RESERVATION.COMPLETED)) {
        validatorM.addException("State is invalid.");
    }
    if (validator.isNullOrUndefined(reservation.customerId)) {
        validatorM.addException("CustomerId is invalid.");
    }
    if (validator.isNullOrUndefined(reservation.providerId)) {
        validatorM.addException("ProviderId is invalid.");
    }
    if (validator.isNullOrUndefined(reservation.providerScheduleId)) {
        validatorM.addException("ProviderScheduleId is invalid.");
    }
    if (!validator.isNullOrUndefined(reservation.latitude) && !validator.isCoordinate(String(reservation.latitude))) {
        validatorM.addException("Latitude is invalid.");
    }
    if (!validator.isNullOrUndefined(reservation.longitude) && !validator.isCoordinate(String(reservation.longitude))) {
        validatorM.addException("Longitude is invalid.");
    }
    if ((validator.isNullOrUndefined(reservation.address) || !validator.isLength(reservation.address, {
            min: 0,
            max: 250
        }))) {
        validatorM.addException("Address is invalid.");
    }
    if (reservation.state == constants.REQUEST_STATES_RESERVATION.CANCELED) {
        if (validator.isNullOrUndefined(reservation.cancelationReason) || !validator.isLength(reservation.cancelationReason, {
                min: 0,
                max: 250
            }))
            validatorM.addException("CancelationReason is invalid.");
    } else {
        reservation.cancelationReason = undefined;

    }
    if (validator.isNullOrUndefined(reservation.date)) {
        validatorM.addException("Date is invalid.");
    }
    if (validator.isNullOrUndefined(reservation.startTime)) {
        validatorM.addException("StartTime is invalid.");
    }


    if (validatorM.isValid()) {
        validatorM = null;
        return callback(null, true);
    } else {
        var message = validatorM.GenerateErrorMessage();
        validatorM = null;
        return callback({
            name: "Error in Reservation Validation",
            message: message
        }, false);
    }
}

//*******************************************************************************************
//
//validation of the required fields for the reservation creation
//
//*******************************************************************************************
reservationLogic.prototype.validateTime = function(reservation, providerScheduleDayList, providerScheduleDayException, dataRequested) {
        //convert the string into dates
        var providerScheduleDay = null;
        var isValid = true;
        if (Object.keys(providerScheduleDayException)
            .length <= 0) {

            for (var sd = 0; sd < providerScheduleDayList.length; sd++) {
                isValid = true;
                providerScheduleDay = providerScheduleDayList[sd];
                var startTimeCalendar = moment(providerScheduleDay.startTime, 'HH:mm:ss');
                var endTimeCalendar = moment(providerScheduleDay.endTime, 'HH:mm:ss');
                var startTimeReservation = moment(reservation.startTime, 'HH:mm:ss');
                var endTimeReservation = moment(reservation.endTime, 'HH:mm:ss');

//check if they are valid dates and if the endtime is bigger than the start time , and at 
//least the schedule has an hour                
                if (startTimeReservation.isValid() && endTimeReservation.isValid() && endTimeReservation.diff(startTimeReservation, "minutes") >= 1) {

                    if (startTimeCalendar <= startTimeReservation && endTimeCalendar >= startTimeReservation &&
                        endTimeCalendar >= endTimeReservation && startTimeCalendar < endTimeReservation) {

                        var rStartTime = null;
                        var rEndTime = null;
                        //compare the entry with previous dates
                        for (var i = 0; i < dataRequested.length; i++) {

                            rStartTime = moment(dataRequested[i].startTime, 'HH:mm:ss');
                            rEndTime = moment(dataRequested[i].endTime, 'HH:mm:ss');
                            if (((startTimeReservation >= rStartTime && startTimeReservation <= rEndTime) ||
                                    (endTimeReservation >= rStartTime && endTimeReservation <= rEndTime)) &&
                                reservation.date.isSame(dataRequested[i].date) &&
                                dataRequested[i].id != reservation.id &&(
                                dataRequested[i].state == constants.REQUEST_STATES_RESERVATION.CANCELED ||
                                dataRequested[i].state == constants.REQUEST_STATES_RESERVATION.COMPLETED  )
                            ) {

                                isValid = false;
                            }

                            rStartTime = null;
                            rEndTime = null;
                        }
                    } else {
                        isValid = false;
                    }
                } else {
                    isValid = false;
                }
                startTimeReservation = null;
                endTimeReservation = null;
                if (isValid) {
                    providerScheduleDay = null;
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
//generate available times
//
//*******************************************************************************************
reservationLogic.prototype.getTime = function(reservationList, providerScheduleDayList, providerScheduleDayException, reservationRequest) {
        //convert the string into dates
        var providerScheduleDay = null;
        var isValid = true;
        var availableTimes = [];
        if (Object.keys(providerScheduleDayException)
            .length <= 0 )  {

            for (var sd = 0; sd < providerScheduleDayList.length; sd++) {
                providerScheduleDay = providerScheduleDayList[sd];
                var startTimeCalendar = moment(providerScheduleDay.startTime, 'HH:mm:ss');
                var endTimeCalendar = moment(providerScheduleDay.endTime, 'HH:mm:ss');
                var lengthTimeCalendar = endTimeCalendar.diff(startTimeCalendar, "minutes");
                if( lengthTimeCalendar - reservationRequest.averageTimePerSession >=0 ) //at least one turn
                {
                    var newStartTimeCalendar = startTimeCalendar;
                    var newEndTimeCalendar =startTimeCalendar.clone();
                     newEndTimeCalendar.add(reservationRequest.averageTimePerSession , "minutes");
                    //divide into minutes for check the time diference
                    while (endTimeCalendar.diff(newEndTimeCalendar,"minutes")>=0)
                    {
                        availableTimes.push({from:newStartTimeCalendar, to:newEndTimeCalendar.clone()});
                        newStartTimeCalendar = newEndTimeCalendar.clone();
                        newEndTimeCalendar.add(reservationRequest.averageTimePerSession , "minutes");
                    }
                }

                startTimeCalendar = null;
                endTimeCalendar = null;
     
            }
            for (var rsrv = 0 ; rsrv < reservationList.length; rsrv++)
            {
                var rStartTime = moment(reservationList[rsrv].startTime, 'HH:mm:ss');
                var rEndTime = moment(reservationList[rsrv].endTime, 'HH:mm:ss');
                for (var times = 0 ; times< availableTimes.length ; times++)
                {
                    var tFrom =  moment(availableTimes[times].from.format('HH:mm:ss'),'HH:mm:ss');
                    var tTo =  moment(availableTimes[times].to.format('HH:mm:ss'),'HH:mm:ss');
                      if ((( tFrom>= rStartTime && tTo <= rEndTime)))
                      {
                          availableTimes.splice(times , 1);
                      } 
                    tFrom =null;
                    tTo = null;
                }
                rStartTime = null;
                rEndTime = null;
            }
            
            
        }
        
        for(var i = 0 ; i< availableTimes.length; i++)
        {
            availableTimes[i].from =  availableTimes[i].from.format('HH:mm:ss');
            availableTimes[i].to =  availableTimes[i].to.format('HH:mm:ss');
        }
        providerScheduleDay = null;
        startTimeCalendar = null;
        endTimeCalendar = null;
        return availableTimes;
    }    
     //*******************************************************************************************
    //
    //Method to Generate available times for reservations
    //
    //*******************************************************************************************
reservationLogic.prototype.generateAvailableTimes = function(reservationRequest, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    var infoVerification = {};
    var providerScheduleDayData = new providerScheduleDayDAL();
    var providerScheduleData = new providerScheduleDAL();
    var reservationDetailL = new reservationDetailLogic();
    var providerScheduleExceptionData = new providerScheduleExceptionDAL();
    try {
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
                    //If the time is correct proceed to create the reservation time
//*******************************************************************************************
                        function checkVerificationDate(callback) {
                            try {
                          
                                   
                                    var tmp = moment(reservationRequest.date);
                                    tmp.format(config.get('chameleon.date.format'));
                                    if (tmp !== null && tmp.isValid()) {
                                        reservationRequest.date = tmp;
                                         return callback(null);
                                    } else {
                                        return callback({
                                            name: "Error at get available Times.",
                                            message: "There are invalid parameters."
                                        }, null);
                                    
                                }
                            } catch (err) {
                                return callback({
                                    name: "Error at get available Times.",
                                    message: "Unable to cast."
                                }, null);
                            }
                        },
//get schedule information
//*******************************************************************************************                
                        function getSchedule(callback) {
                            var reservationDay = reservationRequest.date.day();
                            providerScheduleData.getProviderScheduleByProviderIdAndDefault(reservationRequest.providerId,  function(err, result) {
                                if (Object.keys(result)
                                .length > 0) {
                                     infoVerification.providerSchedule = result;
                                    return callback(err);
                                } else {
                                    return callback({
                                        name: "Error at create the reservation",
                                        message: "There are no schedules defined."
                                    }, null);

                                }
                            }, null);
                        },                        
//get schedule day  information
//*******************************************************************************************                
                        function getScheduleDay(callback) {
                            var reservationDay = reservationRequest.date.day();
                            providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek( infoVerification.providerSchedule.id, reservationDay,function(err, result) {
                                if (result.length > 0) {
                                     infoVerification.providerScheduleDay = result;
                                    return callback(err);
                                } else {
                                    return callback({
                                        name: "Error at create the reservation",
                                        message: "There are no  schedule days defined."
                                    }, null);

                                }
                            }, null);
                        },
//get if there are any schedule exception for this date
//*******************************************************************************************                
                        function getScheduleException(callback) {
                            providerScheduleExceptionData.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay(infoVerification.providerSchedule.id, reservationRequest.date.year(), reservationRequest.date.month() + 1, reservationRequest.date.date(), function(err, result) {
                                infoVerification.providerScheduleException = result;
                                return callback(err);

                            }, null);
                        },
//get if there are any previous reservations for this date
//*******************************************************************************************                     
                        function getPreviousReservationsData(callback) {
                            reservationData.getReservationByProviderScheduleIdYearMonthDay(infoVerification.providerSchedule.id, reservationRequest.date.year(), reservationRequest.date.month() + 1, reservationRequest.date.date(), function(err, result) {

                                infoVerification.previousReservations = result;
                                return callback(err);

                            }, null);

                        },
//Validate data for create reservation
//*******************************************************************************************                   
                        function generateAvailableTimes(callback) {
                            //async 
                            process.nextTick(function(){
                            try
                            {
                            var availableTimes = reservationLogic.prototype.getTime(infoVerification.previousReservations, infoVerification.providerScheduleDay,
                                    infoVerification.providerScheduleException ,reservationRequest);
                                    return callback(null,availableTimes);
                            }catch(err)
                            {
                                return callback({
                                       name: "Error at get available Times.",
                                        message: "There was an issue on generate the available times"
                                    }, null);
                            }

                        });
                        },
                    ],
                    function(err, result) {
                        reservationData = null;
                        infoVerification = null;
                        providerScheduleDayData = null;
                        providerScheduleExceptionData = null;
                        return resultMethod(err, result);
                    });

  
    } catch (err) {
        reservationData = null;
        infoVerification = null;
        providerScheduleDayData = null;
        providerScheduleExceptionData = null;
        return resultMethod(err, null);
    }

};   
    
    //*******************************************************************************************
    //
    //Method to Create an entry to the reservation
    //
    //*******************************************************************************************
reservationLogic.prototype.createReservation = function(reservation, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    var reservationDetailVerification = null;
    var providerScheduleDayData = new providerScheduleDayDAL();
    var reservationDetailL = new reservationDetailLogic();
    var providerScheduleExceptionData = new providerScheduleExceptionDAL();
    try {
        //create a connection for the transaction
        reservationData.pool.getConnection(function(err, connection) {
            //start the transaction
            if (err) { //if there is an error in the connection
                return resultMethod(err, null);
            }
            connection.beginTransaction(function(err) {
                if (err) { //if there is an error in the transaction return
                    return resultMethod(err, null);
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
//validate
//*******************************************************************************************
                        function validateEntity(callback) {
                            reservationLogic.prototype.self.validate(reservation, function(err, result) {
                                return callback(err);
                            })
                        },
//method to prepare the data    
//authorize
//check if the user who is calling is the same user who is being sent
//*******************************************************************************************
                        function authorize(callback) {
                            if (contextUser.id == reservation.customerId) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create provider Schedule",
                                    message: "Invalid operation."
                                }, null);
                            }

                        },

//Check if the reservation is ok
//*******************************************************************************************
                        function checkReservationDetail(callback) {
                            // create object for retain reservationDetails, reservation , schedule Dates , schedule Exceptions and previous reservations
                            reservationDetailVerification = reservationDetailL.validateTime(reservation.reservationDetail);

                            return callback(null);
                        },
//If the time is correct proceed to create the reservation time
//*******************************************************************************************
                        function checkVerificationDate(callback) {
                            try {
                                if (reservationDetailVerification.totalTime == 0) {
                                    return callback({
                                        name: "Error at create the reservation",
                                        message: "There are reservation details are incorrect."
                                    }, null);

                                } else {
                                    var duration = moment.duration(reservation.startTime)
                                        .asMinutes() + reservationDetailVerification.totalTime;
                                    reservation.endTime = moment.duration(duration, "minutes")
                                        .format("HH:mm:ss");
                                    duration = null;
                                    var tmp = moment(reservation.date);
                                    tmp.format(config.get('chameleon.date.format'));
                                    if (tmp !== null && tmp.isValid()) {
                                        reservation.date = tmp;
                                    } else {
                                        return callback({
                                            name: "Error at create the reservation.",
                                            message: "There are invalid parameters."
                                        }, null);
                                    }

                                    return callback(null);
                                }
                            } catch (err) {
                                return callback({
                                    name: "Error at create the reservation.",
                                    message: "There was an error in validation."
                                }, null);
                            }
                        },
//get the schedule times
//*******************************************************************************************                
                        function getScheduleDay(callback) {
                            var reservationDay = reservation.date.day();
                            providerScheduleDayData.getProviderScheduleDayByProviderScheduleIdDayOfWeek(reservation.providerScheduleId, reservationDay, function(err, result) {
                                if (result.length > 0) {
                                    reservationDetailVerification.providerScheduleDay = result;
                                    return callback(err);
                                } else {
                                    return callback({
                                        name: "Error at create the reservation",
                                        message: "There are no reservation schedules defined."
                                    }, null);

                                }
                            }, connection);
                        },
//get if there are any schedule exception for this date
//*******************************************************************************************                
                        function getScheduleException(callback) {
                            providerScheduleExceptionData.getProviderScheduleExceptionByProviderScheduleIdYearMonthDay(reservation.providerScheduleId, reservation.date.year(), reservation.date.month() + 1, reservation.date.date(), function(err, result) {

                                reservationDetailVerification.providerScheduleException = result;
                                return callback(err);

                            }, connection);
                        },
//get if there are any previous reservations for this date
//*******************************************************************************************                     
                        function getPreviousReservationsData(callback) {
                            reservationData.getReservationByProviderScheduleIdYearMonthDay(reservation.providerScheduleId, reservation.date.year(), reservation.date.month() + 1, reservation.date.date(), function(err, result) {

                                reservationDetailVerification.previousReservations = result;
                                return callback(err);

                            }, connection);

                        },
//Validate data for create reservation
//*******************************************************************************************                   
                        function validatePreviousInformation(callback) {
                            if (reservationLogic.prototype.validateTime(reservation, reservationDetailVerification.providerScheduleDay,
                                    reservationDetailVerification.providerScheduleException, reservationDetailVerification.previousReservations)) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create the reservation.",
                                    message: "There are invalid dates."
                                }, null);
                            }

                        },

//Preparing the reservation data
//*******************************************************************************************                   
//method to prepare the data    
                        function prepare(callback) {
                            var localDate = new Date();
                            reservation.id = uuid.v4();
                            reservation.modificationDate = localDate;
                            reservation.creationDate = localDate;
                            reservation.isActive = true;
                            reservation.state = constants.REQUEST_STATES_RESERVATION.SUBMITED;
                            reservation.date = reservation.date.toISOString();
                            callback(null);
                        },
//method to create the reservation
//*******************************************************************************************       
                        function createReservation(callback) {
                            reservationData.createReservation(reservation, function(err, result) {
                                logger.log("debug", "save", reservation);
                                return callback(err, result);

                            }, connection);

                        },
//method to create the reservation details
//*******************************************************************************************               
                        function createReservationDetails(result, callback) {
                            mod_vasync.forEachPipeline({
                                'func': function createReservationDetails(item, callback) {
                                    reservationDetailL.createReservationDetail(item, reservation.id, function(err, result) {
                                        return callback(err, result);
                                    }, connection);
                                },
                                'inputs': reservationDetailVerification.reservationDetailList

                            }, function(err, result) {

                                return callback(err, result);
                            });

                        },
//Method to obtain all the reservations by id
//*******************************************************************************************        
                        function getById(data, callback) {
                            reservationData.getReservationById(reservation.id, function(err, result) {

                                return callback(err, result);
                            }, connection);
                        }
                    ],
                    function(err, result) {
                        if (err) {
                            return connection.rollback(function() {
                                connection.release();
                                reservationData = null;
                                reservationDetailVerification = null;
                                providerScheduleDayData = null;
                                reservationDetailL = null;
                                providerScheduleExceptionData = null;
                                resultMethod(err, null);
                            });
                        }
//if no error commit
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    connection.release();
                                    reservationData = null;
                                    reservationDetailVerification = null;
                                    providerScheduleDayData = null;
                                    reservationDetailL = null;
                                    providerScheduleExceptionData = null;
                                    resultMethod(err, null);
                                });
                            } else {
                                logger.log("debug", "commit", reservation);
                                connection.release();
                                reservationData = null;
                                reservationDetailVerification = null;
                                providerScheduleDayData = null;
                                reservationDetailL = null;
                                providerScheduleExceptionData = null;
                                return resultMethod(null, result);
                            }
                        });

                    });

            });
        });
    } catch (err) {
        reservationData = null;
        reservationDetailVerification = null;
        providerScheduleDayData = null;
        reservationDetailL = null;
        providerScheduleExceptionData = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
//reservation validation for the workflow, validates the states of the petition
//
//*******************************************************************************************
reservationLogic.prototype.approvalReservationValidation = function(contextUser, reservation, originalReservation) {
        var verification = false;
        //firts validation
        //*******************************************************************************************
        if ((originalReservation.state != constants.REQUEST_STATES_RESERVATION.COMPLETED || originalReservation.state != constants.REQUEST_STATES_RESERVATION.CANCELED) && ((originalReservation.customerId == reservation.customerId) && (originalReservation.providerId == reservation.providerId))) {
            switch (reservation.state) {
                case constants.REQUEST_STATES_RESERVATION.APPROVED:
                    // the person who is accepting is the customer's friend
                    verification = (originalReservation.providerId == contextUser.id && originalReservation.state == constants.REQUEST_STATES_RESERVATION.SUBMITED);
                    break;

                case constants.REQUEST_STATES_RESERVATION.CANCELED:
                    // the person who is accepting is the customer's friend
                    verification = (originalReservation.providerId == contextUser.id || originalReservation.customerId == contextUser.id );
                    break;
                
                case constants.REQUEST_STATES_RESERVATION.COMPLETED_PROVIDER:
                    // reservation completed by the provider
                    verification = (originalReservation.providerId == contextUser.id && originalReservation.state == constants.REQUEST_STATES_RESERVATION.APPROVED);
                    break;
                case constants.REQUEST_STATES_RESERVATION.COMPLETED_CUSTOMER:
                    // reservation completed by the customer
                    verification = (originalReservation.providerId == contextUser.id  && originalReservation.state == constants.REQUEST_STATES_RESERVATION.COMPLETED_PROVIDER);
                    break;            
                case constants.REQUEST_STATES_RESERVATION.COMPLETED:
                    // complete the reservation request
                    verification = (originalReservation.providerId == contextUser.id && originalReservation.state == constants.REQUEST_STATES_RESERVATION.COMPLETED_CUSTOMER);
                    break;
                default:
                    verification = false;
                    break;
            }
        }
        // no workflow required already decided
        return verification;
    }
    //*******************************************************************************************
    //
    //method to Update reservations with the workflow
    //
    //*******************************************************************************************
reservationLogic.prototype.approvalReservation = function(reservation, resultMethod) {
    var reservationData = new reservationDAL();
    var userRatingL = new userRatingLogic();
    var contextUser = context.getUser();
    try {
        //create a connection for the transaction
        reservationData.pool.getConnection(function(err, connection) {
            //start the transaction
            if (err) { //if there is an error in the connection
                return resultMethod(err, null);
            }
            connection.beginTransaction(function(err) {
                if (err) { //if there is an error in the transaction return
                    return resultMethod(err, null);
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
//validate
//*******************************************************************************************
                        function validateEntity(callback) {
                            reservationLogic.prototype.self.validate(reservation, function(err, result) {
                                return callback(err);
                            })
                        },
//method to prepare the data
//*******************************************************************************************    
                        function getData(callback) {
                            reservationData.getReservationById(reservation.id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
//authorize
//*******************************************************************************************
                        function authorize(data, callback) {
                            if (Object.keys(data)
                                .length <= 0) {
                                return callback({
                                    name: "Error at reservation's approval",
                                    message: "Invalid operation."
                                }, null);
                            } else {
                                if (reservationLogic.prototype.self.approvalReservationValidation(contextUser, reservation, data)) {
                                    //prepare data
                                    reservation.modificationDate = new Date();
                                    reservation.creationDate = undefined;
                                    reservation.isActive = undefined;

                                    return callback(null);
                                } else {
                                    return callback({
                                        name: "Error at reservation's approval",
                                        message: "Invalid operation."
                                    }, null);
                                }

                            }
                        },
//Create rating if is required
//*******************************************************************************************
                        function createRating(callback)
                        {
                            
                            if(reservation.state == constants.REQUEST_STATES_RESERVATION.COMPLETED_PROVIDER|| reservation.state == constants.REQUEST_STATES_RESERVATION.COMPLETED_CUSTOMER)
                            {
                                reservation.reservationRate.reservationId = reservation.id;
                                if(reservation.state == constants.REQUEST_STATES_RESERVATION.COMPLETED_PROVIDER)
                                {


                                    reservation.reservationRate.fromUserId = reservation.providerId;
                                    reservation.reservationRate.toUserId = reservation.customerId;
                                }
                                else
                                {

                                    reservation.reservationRate.fromUserId = reservation.customerId;
                                    reservation.reservationRate.toUserId = reservation.providerId;
                                    reservation.reservationRate.isForProvider =true;
                                    //complete the reservation after the customer's rating
                                    reservation.state =constants.REQUEST_STATES_RESERVATION.COMPLETED;
                                }
                            userRatingL.createUserRating(reservation.reservationRate,function(err,result)
                            {
                                return callback(err, result);

                            },connection);
                            }
                            else{

                                return callback(null, null);
                            }
                        },                        
//update
//*******************************************************************************************   
                        function updateReservation(data,callback) {
                            reservationData.updateReservation(reservation, reservation.id, function(err, result) {
                                   if (err) {
                                    return connection.rollback(function() {
                                        callback(err, null);
                                    });
                                }
                                //if no error commit
                                connection.commit(function(err) {
                                    if (err) {
                                        return connection.rollback(function() {
                                            callback(err, null);
                                        });
                                    } else {
                                        logger.log("debug", "commit", reservation);
                                        return callback(null, reservation);
                                    }
                                });
                        },connection);
                        },
//get information by id
//*******************************************************************************************            
                        function getById(reservation, callback) {

                            reservationData.getReservationById(reservation.id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        }
                    ],
                    function(err, result) {
                        connection.release();
                        reservationData = null;
                        userRatingL=null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        reservationData = null;
        userRatingL = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
//Method to Select reservation By Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationById = function(id, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    mod_vasync.waterfall([


        function Get(callback) {
            reservationData.getReservationById(id, function(err, result) {
                return callback(err, result);
            }, null);


        },
        //*******************************************************************************************            
        function authorize(data, callback) {
            if (Object.keys(data)
                .length > 0 && (contextUser.id == data.customerId ||
                    contextUser.id == data.providerId)) {
                return callback(null, data);
            } else {
                return callback({
                    name: "Not Authorized",
                    message: "Invalid operation."
                }, null);
            }

        },
        //******************************************************************************************* 



    ], function(err, result) {
        reservationData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//Method to Select reservation By Customer Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByCustomerId = function(id, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    mod_vasync.waterfall([
        //*******************************************************************************************            
        function authorize(callback) {
            if (contextUser.id == id) {
                return callback(null);
            } else {
                return callback({
                    name: "Not Authorized",
                    message: "Invalid operation."
                }, null);
            }

        },
        //*******************************************************************************************                        
        function Get(callback) {
            reservationData.getReservationByCustomerId(id, function(err, result) {
                return callback(err, result);
            }, null);

        }
    ], function(err, result) {
        reservationData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//Method to Select reservation By Provider Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByProviderId = function(id, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    mod_vasync.waterfall([
        //*******************************************************************************************            
        function authorize(callback) {
            if (contextUser.id == id) {
                return callback(null);
            } else {
                return callback({
                    name: "Not Authorized",
                    message: "Invalid operation."
                }, null);
            }

        },
        //******************************************************************************************* 


        function Get(callback) {
            reservationData.getReservationByProviderId(id, function(err, result) {
                return callback(err, result);
            }, null);

        }
    ], function(err, result) {
        reservationData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//Method to Select reservation By Customer Id and State
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByCustomerIdStatePaged = function(id,state,offset,limit, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    mod_vasync.waterfall([
        //*******************************************************************************************            
        function authorize(callback) {
            if (contextUser.id == id) {
                return callback(null);
            } else {
                return callback({
                    name: "Not Authorized",
                    message: "Invalid operation."
                }, null);
            }

        },
        //*******************************************************************************************                        
        function Get(callback) {
            reservationData.getReservationByCustomerIdStatePaged(parseInt(id),parseInt(state),parseInt(offset),parseInt(limit), function(err, result) {
                return callback(err, result);
            }, null);

        }
    ], function(err, result) {
        reservationData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//Method to Select reservation By Provider Id and State
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByProviderIdStatePaged = function(id,state,offset,limit, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    mod_vasync.waterfall([
        //*******************************************************************************************            
        function authorize(callback) {
            if (contextUser.id == id) {
                return callback(null);
            } else {
                return callback({
                    name: "Not Authorized",
                    message: "Invalid operation."
                }, null);
            }

        },
        //******************************************************************************************* 


        function Get(callback) {
            reservationData.getReservationByProviderIdStatePaged(parseInt(id),parseInt(state),parseInt(offset),parseInt(limit), function(err, result) {
                return callback(err, result);
            }, null);

        }
    ], function(err, result) {
        reservationData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//Method to Select the pending reservations By Provider Id
//
//*******************************************************************************************
reservationLogic.prototype.getReservationByProviderIdPagedPending = function(id,offset,limit, resultMethod) {
    var contextUser = context.getUser();
    var reservationData = new reservationDAL();
    mod_vasync.waterfall([
        //*******************************************************************************************            
        function authorize(callback) {
            if (contextUser.id == id) {
                return callback(null);
            } else {
                return callback({
                    name: "Not Authorized",
                    message: "Invalid operation."
                }, null);
            }

        },
        //******************************************************************************************* 


        function Get(callback) {
            reservationData.getReservationByProviderIdPagedPending(parseInt(id),parseInt(offset),parseInt(limit), function(err, result) {
                return callback(err, result);
            }, null);

        }
    ], function(err, result) {
        reservationData = null;
        return resultMethod(err, result);
    });
};
//********************************************************************************************
module.exports = reservationLogic;