//*******************************************************************************************
//Name: Provider Schedule Logic
//Description: Provider Schedule logic class
//Target : Provider Schedule  Creation , Administration of Provider Schedule 
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync = require("vasync");
var providerScheduleDAL = require('data/dal/providerScheduleDAL');
var providerScheduleExceptionDAL = require('data/dal/providerScheduleExceptionDAL');
var providerScheduleDayDAL = require('data/dal/providerScheduleDayDAL');
var logger = require('utilities/logger');
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var uuid = require('node-uuid');
var userLogic = require('./userLogic');
var context = require('security/context');
//*******************************************************************************************
//constants
var constants = require('global/constants');
//*******************************************************************************************
var providerScheduleLogic = function() {

    providerScheduleLogic.prototype.self = this;
};

//*******************************************************************************************
//
//Validation for Provider Schedule
//
//*******************************************************************************************
providerScheduleLogic.prototype.validate = function(providerSchedule, callback) {
    var validatorM = new validatorManager();
    if (!validator.isLength(providerSchedule.name, {
            min: 0,
            max: 60
        })) {
        validatorM.addException("Name is invalid.");
    }
    if ((!validator.isNullOrUndefined(providerSchedule.isDefault) && !validator.isBoolean(providerSchedule.isDefault))) {
        validatorM.addException("IsDefault is invalid.");
        
    }
    if ((!validator.isNullOrUndefined(providerSchedule.isMultiple) && !validator.isBoolean(providerSchedule.isMultiple))) {
        validatorM.addException("isMultiple is invalid.");
        
    }
    if (validator.isNullOrUndefined(providerSchedule.providerId)) {
        validatorM.addException("ProviderId is invalid.");
    }
    if (validatorM.isValid()) {
        validatorM = null;
        return callback(null, true);
    } else {
        var message = validatorM.GenerateErrorMessage();
        validatorM = null;
        return callback({
            name: "Error in Provider Schedule Validation",
            message: message
        }, false);
    }
}



//*******************************************************************************************
//
// Method for create the provider Schedule
//
//
//*******************************************************************************************
providerScheduleLogic.prototype.createProviderSchedule = function(providerSchedule, resultMethod) {
    var contextUser = context.getUser();
    var providerScheduleData = new providerScheduleDAL();
    var userL = new userLogic();
    try {
        //create a connection for the transaction
        providerScheduleData.pool.getConnection(function(err, connection) {
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
                            providerScheduleLogic.prototype.self.validate(providerSchedule, function(err, result) {
                                return callback(err);
                            })
                        },
                         //validate if is a real user
                    //*******************************************************************************************
                    function validateUser(callback) {
                        userL.checkUser(providerSchedule.providerId, function(err, data) {
                            if (Object.keys(data)
                                .length == 0) {
                                return callback({
                                    name: "Error at create the provider schedule",
                                    message: "Invalid operation."
                                }, null);
                            } else {
                               
                                return callback(null,data);
                            }


                        }, connection);
                    },

                        //method to prepare the data    
                        //authorize
                        //check if the user who is calling is the same user who is being send
                        //*******************************************************************************************
                        function authorize(data,callback) {
                            if (contextUser.id == data.id && data.isProvider) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create provider Schedule",
                                    message: "Invalid operation."
                                }, null);
                            }

                        },

                        //Check if the user has an schedule , version 1 will only accept on schedule per user             
                        //*******************************************************************************************            
                        function check(callback) {
                            providerScheduleData.getProviderScheduleByProviderId(providerSchedule.providerId, function(err, result) {
                                return callback(err, result);
                            }, null);

                        },
                        //Prepare the data for insertion
                        //*******************************************************************************************                     
                        function prepare(data, callback) {

                            if (Object.keys(data)
                                .length > 0) {
                                return callback({
                                    name: "Error at create schedule",
                                    message: "There is already an schedule"
                                }, null);
                            } else {
                                var localDate = new Date();
                                providerSchedule.id = uuid.v4();
                                providerSchedule.modificationDate = localDate;
                                providerSchedule.creationDate = localDate;
                                //for future use
                                providerSchedule.isActive = true;
                                providerSchedule.isDefault = true;
                                return callback(null);

                            }
                        },
                        //method to create the providerSchedule
                        //*******************************************************************************************         
                        function createProviderSchedule(callback) {
                            providerScheduleData.createProviderSchedule(providerSchedule, function(err, result) {
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
                                        logger.log("debug", "commit", providerSchedule);
                                        return callback(null, providerSchedule.id);
                                    }

                                });


                            }, connection);

                        },
                        //get information by id
                        //*******************************************************************************************                
                        function getById(id, callback) {
                            providerScheduleData.getProviderScheduleById(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                    ],
                    function(err, result) {
                        connection.release();
                        providerScheduleData = null;
                        userL = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerScheduleData = null;
        userL = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
// Method for update the provider Schedule
//
//
//*******************************************************************************************
providerScheduleLogic.prototype.updateProviderSchedule = function(providerSchedule, resultMethod) {
    var contextUser = context.getUser();
    var userL = new userLogic();
    var providerScheduleData = new providerScheduleDAL();
    try {
        //create a connection for the transaction
        providerScheduleData.pool.getConnection(function(err, connection) {
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
                            providerScheduleLogic.prototype.self.validate(providerSchedule, function(err, result) {
                                return callback(err);
                            })
                        },
                        function validateUser(callback) {
                        userL.checkUser(providerSchedule.providerId, function(err, data) {
                            if (Object.keys(data)
                                .length == 0) {
                                return callback({
                                    name: "Error at update the provider schedule",
                                    message: "Invalid operation."
                                }, null);
                            } else {
                               
                                return callback(null);
                            }


                        }, connection);
                    },

                        //check if previous data exists
                        //*******************************************************************************************
                        function checkExistingItem(callback) {
                            providerScheduleData.getProviderScheduleById(providerSchedule.id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //authorize
                        //check if the user who is calling is the same user who created the provider schedule
                        //*******************************************************************************************
                        function authorize(data, callback) {
                            //Validate if the object exists and has the same provider
                            if (Object.keys(data)
                                .length == 0 || data.providerId != providerSchedule.providerId ||
                                contextUser.id != providerSchedule.providerId ) {
                                return callback({
                                    name: "Error at update the provider Schedule",
                                    message: "Invalid operation."
                                }, null);
                            } else {

                                return callback(null);

                            }
                        },
                        //prepare the data 
                        //*******************************************************************************************
                        //method to prepare the data    
                        function prepare(callback) {
                            providerSchedule.modificationDate = new Date();
                            providerSchedule.isDefault =undefined;
                            providerSchedule.isActive = undefined;
                            providerSchedule.creationDate =undefined;
                            providerSchedule.providerId= undefined;
                            callback(null);
                        },
                        //update
                        //*******************************************************************************************   
                        function updateProviderSchedule(callback) {
                            providerScheduleData.updateProviderSchedule(providerSchedule, providerSchedule.id, function(err, result) {
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
                                        logger.log("debug", "commit", providerSchedule);
                                        return callback(null, providerSchedule.id);
                                    }
                                });
                            }, connection);

                        },
                        //*******************************************************************************************        
                        //
                        //Get information by id
                        //
                        //*******************************************************************************************      
                        function getById(id, callback) {

                            providerScheduleData.getProviderScheduleById(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        }
                    ],
                    function(err, result) {
                        connection.release();
                        providerScheduleData = null;
                        userL =null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerScheduleData = null;
        userL = null;
        return resultMethod(err, null);
    }

};

//*******************************************************************************************
//
//get providerSchedule by Id
//
//*******************************************************************************************
providerScheduleLogic.prototype.getProviderScheduleById = function(id, resultMethod) {
    var providerScheduleData = new providerScheduleDAL();
    mod_vasync.waterfall([function Get(callback) {
        providerScheduleData.getProviderScheduleById(id, function(err, result) {
            return callback(err, result);
        }, null);

    }], function(err, result) {
        providerScheduleData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//get providerSchedule by provider Id
//
//*******************************************************************************************
providerScheduleLogic.prototype.getProviderScheduleByProviderId = function(id, resultMethod) {
    var providerScheduleData = new providerScheduleDAL();
    mod_vasync.waterfall([function Get(callback) {
        providerScheduleData.getProviderScheduleByProviderId(id, function(err, result) {
            return callback(err, result);
        }, null);

    }], function(err, result) {
        providerScheduleData = null;
        return resultMethod(err, result);
    });
};

//*******************************************************************************************
//
// Method for remove the provider Schedule
//
//*******************************************************************************************
providerScheduleLogic.prototype.deactivateProviderSchedule = function(providerSchedule, resultMethod) {
    var providerScheduleData = new providerScheduleDAL();
    var providerScheduleDayData= new providerScheduleDayDAL();
    var userL = new userLogic();
    var contextUser = context.getUser();
    var providerScheduleExceptionData = new providerScheduleExceptionDAL();
    try {
        //create a connection for the transaction
        providerScheduleData.pool.getConnection(function(err, connection) {
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
                     function validateUser(callback) {
                        userL.checkUser(providerSchedule.providerId, function(err, data) {
                            if (Object.keys(data)
                                .length == 0) {
                                return callback({
                                    name: "Error at update the provider schedule",
                                    message: "Invalid operation."
                                }, null);
                            } else {
                               
                                return callback(null);
                            }


                        }, connection);
                    },
                        //check if previous data exists
                        //*******************************************************************************************
                        function checkExistingItem(callback) {
                            providerScheduleData.getProviderScheduleById(providerSchedule.id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //authorize
                        //check if the user who is calling is the same user who created the provider schedule
                        //*******************************************************************************************
                        function authorize(data, callback) {
                            //Validate if the object exists and has the same provider
                            if (Object.keys(data)
                                .length == 0 || data.providerId != providerSchedule.providerId || contextUser.id != providerSchedule.providerId) {
                                return callback({
                                    name: "Error at create provider Schedule",
                                    message: "Invalid operation."
                                }, null);
                            } else {

                                return callback(null);

                            }
                        },
                        //method to prepare the data
                        //*******************************************************************************************
                        function prepare(callback) {
                            providerSchedule.modificationDate =Date.now();
                            return callback(null);
                        },
                        //method to deactivate all the provider schedule days
                        //*******************************************************************************************
                        function deactivateScheduleDay( callback) {
                            providerScheduleDayData.deactivateProviderScheduleDayByProviderScheduleId(providerSchedule, function(err, result) {

                                return callback(err);
                            });
                        },
                        //method to deactivate all the provider schedule Exceptions 
                        //*******************************************************************************************
                        function deactivateException(callback) {
                            providerScheduleExceptionData.deactivateProviderScheduleExceptionByProviderScheduleId(providerSchedule, function(err, result) {

                                return callback(err);
                            });
                        },
                        //Deactivate
                        //******************************************************************************************* 
                        function deactivate(callback) {
                            providerScheduleData.deactivateProviderSchedule(providerSchedule,function(err, result) {
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
                                        logger.log("debug", "commit", providerSchedule);
                                        return callback(err, result);
                                    }


                                });

                            }, connection);

                        }
                    ],
                    function(err, result) {
                        connection.release();
                        providerScheduleData = null;
                        userL = null;
                        providerScheduleDayData = null;
                        providerScheduleExceptionData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerScheduleData = null;
        userL = null;
        providerScheduleDayData = null;
        providerScheduleExceptionData = null;
        return resultMethod(err, null);
    }

};
//********************************************************************************************
module.exports = providerScheduleLogic;