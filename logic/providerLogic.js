//*******************************************************************************************
//Name: Provider  Logic
//Description: Provider  class
//Target : Provider Creation , Administration of Providers
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync = require("vasync");
var providerDAL = require('data/dal/providerDAL');
var logger = require('utilities/logger');
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var config = require('config');
var context = require('security/context');
var userLogic = require('./userLogic');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************

var providerLogic = function () {

    providerLogic.prototype.self = this;
};
//*******************************************************************************************
//
//Validation for the provider
//
//*******************************************************************************************
providerLogic.prototype.validate = function (provider, callback) {
    var validatorM = new validatorManager();
    if (validator.isNullOrUndefined(provider.id)) {
        validatorM.addException("ProviderId is invalid.");
    }


    if ((!validator.isNullOrUndefined(provider.telephone) && !validator.isLength(provider.telephone, {
            min: 0,
            max: 25
        }))) {
        validatorM.addException("Picture is invalid.");
    }

    if ((!validator.isNullOrUndefined(provider.latitude) && !validator.isCoordinate(String(provider.latitude)))) {
        validatorM.addException("Latitude is invalid.");
    }
    if ((!validator.isNullOrUndefined(provider.longitude) && !validator.isCoordinate(String(provider.longitude)))) {
        validatorM.addException("Longitude is invalid.");
    }

    if ((!validator.isNullOrUndefined(provider.appointments) && !validator.isNumberAndInteger(provider.appointments))) {
        validatorM.addException("Appointments is invalid.");
    }
    if ((!validator.isNullOrUndefined(provider.rating) && !validator.isNumberAndIntegerAndRange(provider.rating, constants.RATING.MIN, constants.RATING.MAX))) {
        validatorM.addException("Rating is invalid.");
    }
    if ((!validator.isNullOrUndefined(provider.allowsKids) && !validator.isBoolean(provider.allowsKids))) {
        validatorM.addException("AllowsKids is invalid.");
    }
    if ((!validator.isNullOrUndefined(provider.isForMale) && !validator.isBoolean(provider.isForMale))) {
        validatorM.addException("IsForMale is invalid.");
    }
    if ((!validator.isNullOrUndefined(provider.isForFemale) && !validator.isBoolean(provider.isForFemale))) {
        validatorM.addException("IsForFemale is invalid.");
    }
    if (validatorM.isValid()) {
        validatorM = null;
        return callback(null, true);
    } else {
        var message = validatorM.GenerateErrorMessage();
        validatorM = null;
        return callback({
            name: "Error in User Validation",
            message: message
        }, false);
    }
}

//*******************************************************************************************
//
//create
//
//*******************************************************************************************
providerLogic.prototype.createProvider = function (provider, resultMethod) {
    var providerData = new providerDAL();
    var contextUser = context.getUser();
    var userL = new userLogic();
    try {
        //create a connection for the transaction
        providerData.pool.getConnection(function (err, connection) {
            //start the transaction
            if (err) { //if there is an error in the connection
                return resultMethod(err, null);
            }
            connection.beginTransaction(function (err) {
                if (err) { //if there is an error in the transaction return
                    return resultMethod(err, null);
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
//validate
//*******************************************************************************************
                function validateEntity(callback)
                        {
                            providerLogic.prototype.self.validate(provider, function (err, result) {
                                return callback(err);
                            })
                },
//*******************************************************************************************
                    function validateUser(callback) {
                            userL.checkUser(provider.id, function (err, data) {
                                if (Object.keys(data)
                                    .length == 0) {
                                    return callback({
                                        name: "Error at create the provider",
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
                            if (contextUser.id == data.id && data.isProvider) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create provider Schedule",
                                    message: "Invalid operation."
                                }, null);
                            }

                        },
//*******************************************************************************************            
                        function check(callback) {
                            providerData.getProviderById(provider.id, function (err, result) {
                                return callback(err, result);
                            }, null);

                        },
//Prepare the data for insertion
//*******************************************************************************************                     
                        function prepare(data, callback) {

                            if (Object.keys(data)
                                .length > 0) {
                                return callback({
                                    name: "Error at create the provider",
                                    message: "There provider already exists."
                                }, null);
                            } else {
                                var localDate = new Date();
                                provider.modificationDate = localDate;
                                provider.creationDate = localDate;
                                provider.state = constants.USER_PROVIDER_STATES.APPROVED;
                                provider.isActive = true;
                                return callback(null);

                            }
                        },
//method to create the provider
//*******************************************************************************************    
                function createProvider(callback)
                        {
                            providerData.createProvider(provider, function (err, result) {
                                if (err) {
                                    return connection.rollback(function () {
                                        callback(err, null);
                                    });
                                }
                                //if no error commit
                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            callback(err, null);
                                        });
                                    } else {
                                        logger.log("debug", "commit", provider)
                                        return callback(null, provider.id);
                                    };
                                });


                            }, connection);

        },
//get information by 
//*******************************************************************************************  
        function getById(id, callback)
                        {
                            providerData.getProviderById(id, function (err, result) {
                                return callback(err, result);
                            }, connection);
        }
        ],
                    function (err, result) {
                        connection.release();
                        providerData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerData = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
//update
//
//*******************************************************************************************
providerLogic.prototype.updateProvider = function (provider, resultMethod) {
    var providerData = new providerDAL();
    var contextUser = context.getUser();
    var userL = new userLogic();
    try {
        //create a connection for the transaction
        providerData.pool.getConnection(function (err, connection) {
            //start the transaction
            if (err) { //if there is an error in the connection
                return resultMethod(err, null);
            }
            connection.beginTransaction(function (err) {
                if (err) { //if there is an error in the transaction return
                    return resultMethod(err, null);
                }
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
//validate
//*******************************************************************************************
                function validateEntity(callback)
                        {
                            providerLogic.prototype.self.validate(provider, function (err, result) {
                                return callback(err);
                            })
                },
   //*******************************************************************************************
                    function validateUser(callback) {
                            userL.checkUser(provider.id, function (err, data) {
                                if (Object.keys(data)
                                    .length == 0) {
                                    return callback({
                                        name: "Error at create the provider",
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
                            if (contextUser.id == data.id && data.isProvider) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create provider Schedule",
                                    message: "Invalid operation."
                                }, null);
                            }

                        },
                        //*******************************************************************************************            
                        function check(callback) {
                            providerData.getProviderById(provider.id, function (err, result) {
                                return callback(err, result);
                            }, null);

                        },
                        //Prepare the data for insertion
                        //*******************************************************************************************                     
                        function prepare(data, callback) {

                            if (Object.keys(data)
                                .length <= 0) {
                                return callback({
                                    name: "Error at create the provider",
                                    message: "There provider does not exists."
                                }, null);
                            } else {
                                var localDate = new Date();
                                provider.modificationDate = localDate;
                                provider.isActive = undefined;
                                provider.creationDate = undefined;
                                return callback(null);

                            }
                        },

//method to update the provider
//*******************************************************************************************    
                function updateProvider(callback)
                        {
                            providerData.updateProvider(provider, provider.id, function (err, result) {
                                if (err) {
                                    return connection.rollback(function () {
                                        callback(err, null);
                                    });
                                }
                                //if no error commit
                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            callback(err, null);
                                        });
                                    } else {
                                        logger.log("debug", "commit", provider);
                                        return callback(null, provider.id);
                                    }
                                });


                            }, connection);

        },
//get information by id
//*******************************************************************************************       
        function getById(id, callback)
                        {
                            providerData.getProviderById(id, function (err, result) {
                                return callback(err, result);
                            }, connection);
        }
        ],
                    function (err, result) {
                        connection.release();
                        providerData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerData = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
//get provider by Id
//
//*******************************************************************************************
providerLogic.prototype.getProviderById = function (id, resultMethod) {
    var providerData = new providerDAL();
    mod_vasync.waterfall([function Get(callback) {
        providerData.getProviderById(id, function (err, result) {
            return callback(err, result);
        }, null);

        }], function (err, result) {
        providerData = null;
        return resultMethod(err, result);
    });
};
//********************************************************************************************
module.exports = providerLogic;