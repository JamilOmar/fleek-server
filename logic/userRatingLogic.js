//*******************************************************************************************
//Name: UserRating Logic
//Description: User Rating logic class
//Target : User Rating  Creation , Administration of User Rating
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync = require("vasync");
var userRatingDAL = require('data/dal/userRatingDAL');
var logger = require('utilities/logger');
var validator = require('validator');
var moment = require('moment');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var context = require('security/context');
var userLogic = require('./userLogic');
var reservationLogic = require('./reservationLogic');
var providerLogic = require('./providerLogic');
var uuid = require('node-uuid');
var emailT = require("utilities/email/");
var messageHelper = require("utilities/email/models/message");
var templateHelper = require("utilities/email/models/template");
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var userRatingLogic = function() {

    userRatingLogic.prototype.self = this;
};
//*******************************************************************************************
//
//Validation for the user rating
//
//*******************************************************************************************
userRatingLogic.prototype.validate = function(userRating, callback) {
        var validatorM = new validatorManager();
       
        if (validator.isNullOrUndefined(userRating.fromUserId)) {
            validatorM.addException("FromUserId is invalid.");
        }
        if (validator.isNullOrUndefined(userRating.toUserId)) {
            validatorM.addException("ToUserId is invalid.");
        }
        if (validator.isNullOrUndefined(userRating.reservationId)) {
            validatorM.addException("ReservationId is invalid.");
        }

        if ((!validator.isNullOrUndefined(userRating.description) && !validator.isLength(userRating.description, {
                min: 0,
                max: 255
            }))) {
            validatorM.addException("Description is invalid.");
        }

        if (!validator.isNullOrUndefined(userRating.rating) && !validator.isNumberAndIntegerAndRange(userRating.rating, constants.RATING.MIN, constants.RATING.MAX)) {
            validatorM.addException("Rating is invalid.");
        }
        if ((!validator.isNullOrUndefined(userRating.isForProvider) && !validator.isBoolean(userRating.isForProvider))) {
            validatorM.addException("IsForProvider is invalid.");
        }
        if (validatorM.isValid()) {
            validatorM = null;
            return callback(null, true);
        } else {
            var message = validatorM.GenerateErrorMessage();
            validatorM = null;
            return callback({
                name: "Error in User rating Validation",
                message: message
            }, false);
        }
    }
    //*******************************************************************************************
    //
    //create
    //
    //*******************************************************************************************
userRatingLogic.prototype.createUserRating = function(userRating, resultMethod) {
    var userL = new userLogic();
    var providerL = new providerLogic();
    var reservationL = new reservationLogic();
    var userRatingData = new userRatingDAL();
    var contextUser = context.getUser();
    var userL = new userLogic();
    try {
        //create a connection for the transaction
        userRatingData.pool.getConnection(function(err, connection) {
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
                            userRatingLogic.prototype.self.validate(userRating, function(err, result) {
                                return callback(err);
                            })
                        },
                        //*******************************************************************************************
                        function validateUser(callback) {
                            userL.checkUser(userRating.toUserId, function(err, data) {
                                if (Object.keys(data)
                                    .length == 0) {
                                    return callback({
                                        name: "Error at create user rating",
                                        message: "Invalid operation."
                                    }, null);
                                } else {

                                    return callback(null, data);
                                }


                            }, connection);
                        },

                        //method to prepare the data    
                        //authorize
                        //check if the user who is calling is the same user who is being sent
                        //*******************************************************************************************
                        function authorize(data, callback) {
                            if (contextUser.id == userRating.fromUserId) {
                                if (userRating.isForProvider && !data.isProvider) {
                                    return callback({
                                        name: "Error at create user rating",
                                        message: "Invalid operation."
                                    }, null);
                                }
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create user rating",
                                    message: "Invalid operation."
                                }, null);
                            }

                        },
                        //*******************************************************************************************            
                        //method to validate the reservation
                        function checkReservation(callback) {
                            reservationL.getReservationById(userRating.reservationId, function(err, result) {
                                if(Object.keys(data)
                                    .length > 0 && result.state == constants.REQUEST_STATES_RESERVATION.COMPLETED)
                                {
                                     if(userRating.isForProvider)
                                     {
                                         if((userRating.fromUserId == result.customerId) && (originalReservation.toUserId == result.providerId))
                                         {
                                             return callback(null);
                                         }
                                         else
                                         {
                                        return callback({
                                            name: "Error at create user rating",
                                            message: "Invalid operation."
                                            }, null);
                                         }
                                     }
                                     else
                                     {
                                        if((userRating.fromUserId == result.providerId) && (originalReservation.toUserId == result.customerId))
                                        {
                                            return callback(null);
                                        }
                                        else
                                        {
                                        return callback({
                                            name: "Error at create user rating",
                                            message: "Invalid operation."
                                            }, null);
                                        }
                                     }
                                }
                                 else {
                                return callback({
                                    name: "Error at create user rating",
                                    message: "Invalid operation."
                                }, null);
                                }
                                
                                
                            }, connection);

                        },
                        //*******************************************************************************************            
                           //method to validate if the user does not have performed a rating
                        function check(callback) {
                            userRatingData.getUserRatingByReservationIdToUserIdFromUserId(userRating.reservationId, userRating.toUserId, userRating.fromUserId, function(err, result) {
                                return callback(err, result);
                            }, connection);

                        },
                          //*******************************************************************************************            
                        //method to prepare the data    
                        function prepare(data,callback) {
                            if (Object.keys(data)
                                .length > 0) {
                                return callback({
                                      name: "Error at create user rating",
                                        message: "Invalid operation."
                                }, null);
                            } else {
                                var localDate = new Date();
                                userRating.id = uuid.v4();
                                userRating.modificationDate = localDate;
                                userRating.creationDate = localDate;
                                userRating.isActive = true;
                                return callback(null);
                            }
                        },
                          //*******************************************************************************************            
                        //method to create the userRating
                          function createUserRating(callback) {
                            userRatingData.addUserRating(userRating, function(err, result) {
                                
                                        return callback(err, result);
                                    
                                },connection);


                            },
                            //*******************************************************************************************              
                            //method to get the total value of the user rating
                          function getTotalUserRating(callback) {
                            userRatingData.getTotalRatingOfUser(userRating.toUserId, function(err, result) {
                                
                                        return callback(err, result);
                                    
                                },connection);


                            },
                           //*******************************************************************************************                 
                         //method to update the Users value
                          function updateUserRating(callback,data) {

                              if(userRating.isForProvider)
                              {
                                 providerL.updateProviderRating(userRating.toUserId,data.totalCount, function(err, result) {
                                
                                        return callback(err, result);
                                    
                                },connection);
                              }
                              else
                              {
                                  userRatingData.addUserRating(userRating.toUserId,data.totalCount, function(err, result) {
                                
                                        return callback(err, result);
                                    
                                },connection);

                              }
                            


                            },    
                        //*******************************************************************************************                 
                         //commit the process
                        function commitProcess(callback) {
                      
                                //if no error commit
                                connection.commit(function(err) {
                                    if (err) {
                                        return connection.rollback(function() {
                                            callback(err, null);
                                        });
                                    } else {
                                        logger.log("debug", "commit", userRating);
                                        return callback(null, result);
                                    }
                            });
                        }

                        
                    ],
                    function(err, result) {
                        if(err)
                        {
                            connection.rollback(function() {});
                        }
                        connection.release();
                        userRatingData = null;
                        providerL = null;
                        userL = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        userRatingData = null;
         providerL = null;
        userL = null;
        return resultMethod(err, null);
    }

};

//*******************************************************************************************
module.exports = userRatingLogic;