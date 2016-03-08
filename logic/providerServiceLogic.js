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
var mod_vasync = require("vasync");
var config = require('config');
var providerServiceDAL = require('data/dal/providerServiceDAL');
var logger = require('utilities/logger');
var moment = require('moment');
var uuid = require('node-uuid');
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var context = require('security/context');
var userLogic = require('./userLogic');
//*******************************************************************************************
var providerServiceLogic = function() {

    providerServiceLogic.prototype.self = this;
};


//*******************************************************************************************
//
//Validation for Provider Service
//
//*******************************************************************************************
providerServiceLogic.prototype.validate = function(providerService, callback) {
    var validatorM = new validatorManager();
    if (validator.isNullOrUndefined(providerService.providerId)) {
        validatorM.addException("ProviderId Id is required.");
    }
    if (validator.isNullOrUndefined(providerService.serviceId)) {
        validatorM.addException("ServiceId is required.");
    }
    if (!validator.isNullOrUndefined(providerService.customName) && !validator.isLength(providerService.customName, {
            min: 0,
            max: 125
        })) {
        validatorM.addException("CustomName is invalid.");
    }
    if (validator.isNullOrUndefined(providerService.price) || !validator.isCurrency(String(providerService.price), {
            require_symbol: false
        }) || providerService.price < 0) {
        validatorM.addException("Price is invalid.");
    }
    if (validator.isNullOrUndefined(providerService.currencyCode)) {
        validatorM.addException("CurrencyCode is invalid.");
    }
    if (validator.isNullOrUndefined(providerService.averageTimePerSession) || !validator.isNumberAndIntegerAndRange(providerService.averageTimePerSession, 0, config.get('chameleon.provider.maxtime'))) {
        validatorM.addException("averageTimePerSession is invalid.");
    }
    if ((!validator.isNullOrUndefined(providerService.isCustom) && !validator.isBoolean(providerService.isCustom))) {
        validatorM.addException("IsCustom is invalid.");
    }

    if (validatorM.isValid()) {
        validatorM = null;
        return callback(null, true);
    } else {
        var message = validatorM.GenerateErrorMessage();
        validatorM = null;
        return callback({
            name: "Error in Provider Service Validation",
            message: message
        }, false);
    }
}


//*******************************************************************************************
//
//Create provider service
//
//*******************************************************************************************
providerServiceLogic.prototype.createProviderService = function(providerService, resultMethod) {
    var providerServiceData = new providerServiceDAL();
    var userL = new userLogic();
    var contextUser = context.getUser();
    try {
        //create a connection for the transaction
        providerServiceData.pool.getConnection(function(err, connection) {
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
                            providerServiceLogic.prototype.self.validate(providerService, function(err, result) {
                                return callback(err);
                            })
                        },
                        //validate if is a real user
                        //*******************************************************************************************
                        function validateUser(callback) {
                            userL.checkUser(providerService.providerId, function(err, data) {
                                if (Object.keys(data)
                                    .length == 0) {
                                    return callback({
                                        name: "Error at create the provider service",
                                        message: "Invalid operation."
                                    }, null);
                                } else {

                                    return callback(null, data);
                                }


                            }, connection);
                        },
                        //method to authorize the data
                        //*******************************************************************************************  

                        function authorize(data, callback) {
                            if (contextUser.id == data.id && data.isProvider) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at create provider service",
                                    message: "Invalid operation."
                                }, null);
                            }


                        },

                        //get the previous 
                        //*******************************************************************************************   
                        function getPreviousData(callback) {
                            //Gets the previous day per calendar

                            providerServiceData.getproviderServiceByProviderIdServiceIdActiveNonActive(providerService.providerId, providerService.serviceId, function(err, result) {
                                if (Object.keys(result)
                                    .length > 0 && result.isActive) {
                                    return callback({
                                        name: "Error at create the provider service",
                                        message: "The item already exists."
                                    }, null);
                                } else {
                                    return callback(err, result);
                                }



                            }, connection);


                        },
                        //method to check if the dates are correct
                        //******************************************************************************************* 
                        function prepareData(data, callback) {
                            var localDate = new Date();
                            providerService.modificationDate = localDate;
                            providerService.creationDate = localDate;
                            providerService.isActive = true;
                            if(providerService.customName == undefined)
                            {
                                providerService.customName = null;
                            }
                            if(providerService.isCustom == undefined)
                            {
                                providerService.isCustom = 0;
                            }
                            return callback(null, data);
                        },
                        //method to create the providerService
                        //*******************************************************************************************     
                        function createProviderService(data, callback) {
                            if (Object.keys(data)
                                .length > 0)

                                providerServiceData.updateProviderService(providerService, data.providerId, data.serviceId, function(err, result) {
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
                                    }
                                    logger.log("debug", "commit", providerService);
                                });

                                return callback(null);
                            }, connection);

                            else
                                providerServiceData.createProviderService(providerService, function(err, result) {
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
                                            logger.log("debug", "commit", providerService);
                                            return callback(null);
                                        }
                                    });


                                }, connection);

                        },
                        //get information by provider id and service id
                        //*******************************************************************************************       
                        function getById( callback) {
                            providerServiceData.getproviderServiceByProviderIdServiceId(providerService.providerId, providerService.serviceId, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        }
                    ],
                    function(err, result) {
                        connection.release();
                        providerServiceData = null;
                        userL = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerServiceData = null;
        userL = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
//Update the provider service
//
//*******************************************************************************************
providerServiceLogic.prototype.updateProviderService = function(providerService, resultMethod) {
    var providerServiceData = new providerServiceDAL();
    var userL = new userLogic();
    var contextUser = context.getUser();
    try {
        //create a connection for the transaction
        providerServiceData.pool.getConnection(function(err, connection) {
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
                            providerServiceLogic.prototype.self.validate(providerService, function(err, result) {
                                return callback(err);
                            })
                        },
                        //validate if is a real user
                        //*******************************************************************************************
                        function validateUser(callback) {
                            userL.checkUser(providerService.providerId, function(err, data) {
                                if (Object.keys(data)
                                    .length == 0) {
                                    return callback({
                                        name: "Error at create the provider service",
                                        message: "Invalid operation."
                                    }, null);
                                } else {

                                    return callback(null, data);
                                }


                            }, connection);
                        },
                        //method to authorize the data
                        //*******************************************************************************************  

                        function authorize(data, callback) {
                            if (contextUser.id == data.id && data.isProvider) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at update provider service",
                                    message: "Invalid operation."
                                }, null);
                            }


                        },

                        //get the previous 
                        //*******************************************************************************************   
                        function getPreviousData(callback) {
                            //Gets the previous day per calendar

                            providerServiceData.getproviderServiceByProviderIdServiceId(providerService.providerId, providerService.serviceId, function(err, result) {
                                if (Object.keys(result)
                                    .length <= 0) {
                                    return callback({
                                        name: "Error at update the provider service",
                                        message: "The item does not exists."
                                    }, null);
                                } else {
                                    return callback(null);
                                }
                            }, connection);


                        },
                        //method to check if the dates are correct
                        //******************************************************************************************* 
                        function prepareData( callback) {
                            var localDate = new Date();
                            providerService.modificationDate = localDate;
                            providerService.creationDate = undefined;
                            providerService.isActive = undefined;
                            return callback(null);
                        },
                        //******************************************************************************************* 
                        function updateProviderService(callback) {
                            providerServiceData.updateProviderService(providerService, providerService.providerId, providerService.serviceId, function(err, result) {
                                if (err) {
                                    return connection.rollback(function() {
                                       return callback(err, null);
                                    });
                                }
                                //if no error commit
                                connection.commit(function(err) {
                                    if (err) {
                                        return connection.rollback(function() {
                                            callback(err, null);
                                        });
                                    }
                                    else
                                    {
                                        logger.log("debug", "commit", providerService);
                                           callback(null,providerService);
                                    }
                                });

                                
                            }, connection);

                        },
                         //get information by provider id and service id
                        //*******************************************************************************************       
                        function getById(providerService, callback) {
                            providerServiceData.getproviderServiceByProviderIdServiceId(providerService.providerId, providerService.serviceId, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        }
                    ],
                    function(err, result) {
                        connection.release();
                        providerServiceData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerServiceData = null;
        return resultMethod(err, null);
    }

};

//*******************************************************************************************
//
//Get providerService by Provider Id and Service Id
//
//*******************************************************************************************
providerServiceLogic.prototype.getproviderServiceByProviderId = function(providerId, resultMethod) {
    var providerServiceData = new providerServiceDAL();
    mod_vasync.waterfall([function Get(callback) {
        providerServiceData.getproviderServiceByProviderId(providerId, function(err, result) {
            return callback(err, result);
        }, null);

    }], function(err, result) {
        providerServiceData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//Get providerService by provider Id
//
//*******************************************************************************************
providerServiceLogic.prototype.getproviderServiceByProviderIdServiceId = function(providerId, serviceId, resultMethod) {
    var providerServiceData = new providerServiceDAL();
    mod_vasync.waterfall([function Get(callback) {
        providerServiceData.getProviderServiceByProviderScheduleId(providerId, serviceId, function(err, result) {
            return callback(err, result);
        }, null);

    }], function(err, result) {
        providerServiceData = null;
        return resultMethod(err, result);
    });
}



//*******************************************************************************************
//
//Deactivate
//
//*******************************************************************************************
providerServiceLogic.prototype.deactivateProviderService = function(providerService, resultMethod) {
    var providerServiceData = new providerServiceDAL();
    var contextUser = context.getUser();
    var userL = new userLogic();
    try {
        //create a connection for the transaction
        providerServiceData.pool.getConnection(function(err, connection) {
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
                        //validate if is a real user
                        //*******************************************************************************************
                        function validateUser(callback) {
                            userL.checkUser(providerService.providerId, function(err, data) {
                                if (Object.keys(data)
                                    .length == 0) {
                                    return callback({
                                        name: "Error at deactivate the provider service",
                                        message: "Invalid operation."
                                    }, null);
                                } else {

                                    return callback(null, data);
                                }


                            }, connection);
                        },
                        //method to authorize the data
                        //*******************************************************************************************  

                        function authorize(data, callback) {
                            if (contextUser.id == data.id && data.isProvider) {
                                return callback(null);
                            } else {
                                return callback({
                                    name: "Error at deactivate provider service",
                                    message: "Invalid operation."
                                }, null);
                            }


                        },

                        //get the previous 
                        //*******************************************************************************************   
                        function getPreviousData(callback) {
                            //Gets the previous day per calendar

                            providerServiceData.getproviderServiceByProviderIdServiceId(providerService.providerId, providerService.serviceId, function(err, result) {
                                if (Object.keys(result)
                                    .length <= 0) {
                                    return callback({
                                        name: "Error at deactivate the provider service",
                                        message: "The item does not exists."
                                    }, null);
                                } else {
                                    return callback(err, result);
                                }
                            }, connection);


                        },

                        //method to prepare the data
                        //*******************************************************************************************    
                        function prepare(data, callback) {
                            providerServiceData.modificationDate = Date.now();
                            return callback(null);
                        },
                        //Deactivate
                        //*******************************************************************************************     
                        function deactivate(callback) {
                            providerServiceData.deactivateProviderService(providerService, function(err, result) {
                                if (err) {
                                    return connection.rollback(function() {
                                        callback(err, null);
                                    });
                                }
                                //if no error commit
                                connection.commit(function(err) {
                                    if (err) {
                                        return connection.rollback(function() {
                                            //Refresh the list cache
                                            callback(err, providerService);
                                        });
                                    }
                                    logger.log("debug", "commit", providerService);

                                });
                                return callback(err, result);
                            }, connection);

                        }
                    ],
                    function(err, result) {
                        connection.release();
                        providerServiceData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        providerServiceData = null;
        return resultMethod(err, null);
    }

};

//********************************************************************************************
module.exports = providerServiceLogic;