//*******************************************************************************************
//Name: User Logic
//Description: User logic class
//Target : User Creation , Administration of Users 
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var awsS3 = require('utilities/amazonS3');
var uuid = require('node-uuid');
var mod_vasync = require("vasync");
var crypto = require('crypto');
var config = require('config');
var userDAL = require('data/dal/userDal');
var cache = require('data/cache/cache.js');
var logger = require('utilities/logger');
var cryptotHelper = require('security/helper/cryptoHelper')
var moment = require('moment');
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
var context = require('security/context');
var emailT = require("utilities/email/");
var messageHelper = require("utilities/email/models/message");
var templateHelper = require("utilities/email/models/template");
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var userLogic = function() {
    userLogic.prototype.self = this;
};
//*******************************************************************************************
//
//Validation for User  
//
//*******************************************************************************************
userLogic.prototype.validate = function(user, withPassword, callback) {
    var validatorM = new validatorManager();


    if (!validator.isLength(user.name, {
            min: 0,
            max: 250
        })) {
        validatorM.addException("Name is invalid.");
    }
    if (!validator.isLength(user.lastname, {
            min: 0,
            max: 250
        })) {
        validatorM.addException("Lastname is invalid.");
    }
    if (!validator.isLength(user.username, {
            min: 6,
            max: 20
        })) {
        validatorM.addException("Username is invalid.");
    }
    if (!validator.isLength(user.password, {
            min: 6,
            max: 64
        }) && withPassword) {
        validatorM.addException("Password is invalid.");
    }
    if (!(validator.isLength(user.email, {
                min: 0,
                max: 254
            }) &&
            validator.isEmail(user.email))) {
        validatorM.addException("Email is invalid.");
    }

    if ((!validator.isNullOrUndefined(user.facebookId) && !validator.isLength(user.facebookId, {
            min: 0,
            max: 255
        }))) {
        validatorM.addException("Facebook Id is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.pictureUrl) && !validator.isLength(user.pictureUrl, {
            min: 0,
            max: 255
        }))) {
        validatorM.addException("Picture is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.countryId) && !validator.isLength(user.countryId, {
            min: 0,
            max: 255
        }))) {
        validatorM.addException("Country is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.latitude) && !validator.isCoordinate(String(user.latitude)))) {
        validatorM.addException("Latitude is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.longitude) && !validator.isCoordinate(String(user.longitude)))) {
        validatorM.addException("Longitude is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.gender) && !validator.isNumberAndIntegerAndRange(user.gender, constants.USER_GENDER.NEUTRAL, constants.USER_GENDER.FEMALE))) {
        validatorM.addException("Gender is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.appointments) && !validator.isNumberAndInteger(user.appointments))) {
        validatorM.addException("Appointments is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.rating) && !validator.isNumberAndIntegerAndRange(user.rating, constants.RATING.MIN, constants.RATING.MAX))) {
        validatorM.addException("Appointments is invalid.");
    }
    if ((!validator.isNullOrUndefined(user.IsOpenForFriendship) && !validator.isBoolean(user.isOpenForFriendship))) {
        validatorM.addException("IsOpenForFriendship is invalid.");
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
//create users
//*******************************************************************************************
userLogic.prototype.createUser = function(user, resultMethod) {
    var userData = new userDAL();
    try {
        //create a connection for the transaction
        userData.pool.getConnection(function(err, connection) {
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
                            userLogic.prototype.self.validate(user, true, function(err, result) {
                                return callback(err);
                            })
                        },

                        //check the username
                        //*******************************************************************************************
                        function check(callback) {
                            userData.getUserByUsername(user.username, function(err, result) {

                                return callback(err, result);
                            });
                        },
                        //create the user
                        //*******************************************************************************************    
                        function createUser(data, callback) {
                            try {
                                if (Object.keys(data)
                                    .length <= 0) {
                                    var localDate = new Date();
                                    user.modificationDate = localDate;
                                    user.creationDate = localDate;
                                    user.isActive = true;
                                    user.isBlocked = false;
                                    user.password = cryptotHelper.encrypt(user.password);
                                    userData.createUser(user, function(err, result) {
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
                                                logger.log("debug", "commit", user);
                                                return callback(null, result);
                                            }
                                        });


                                    }, connection);
                                } else {
                                    return callback({
                                        name: "Error at creation",
                                        message: "Username already exists."
                                    }, null);
                                }
                            } catch (err) {
                                logger.log("error", "createUser", err);
                                callback(err, null);
                            }
                        },

                        //get information by id
                        //*******************************************************************************************            
                        function getById(id, callback) {
                            userLogic.prototype.self.checkUser(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //store the information under cache
                        //******************************************************************************************* 
                        function saveInCache(data, callback) {
                            var cacheL = new cache();
                            cacheL.saveCache(constants.REDIS_USER + user.id, data, function(err, result) {
                                cacheL = null;
                                return callback(err, result);
                            });

                        },
                        //send the email
                        //*******************************************************************************************                 
                        function sendEmail(data, callback) {
                            userLogic.prototype.self.sendEmail(user, "sd", function(err, result) {
                                return callback(err, data);
                            });
                        }
                    ],
                    //*******************************************************************************************
                    function(err, result) {
                        connection.release();
                        userData = null;
                        return resultMethod(err, result);
                    });
            });
        });
    } catch (err) {
        userData = null;
        return resultMethod(err, null);
    }

};
//******************************************************************************************* 
//
//update users but not password
//
//*******************************************************************************************
userLogic.prototype.updateUser = function(user, resultMethod) {
    var contextUser = context.getUser();
    var userData = new userDAL();
    try {
        //create a connection for the transaction
        userData.pool.getConnection(function(err, connection) {
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
                            userLogic.prototype.self.validate(user, false, function(err, result) {

                                return callback(err);
                            })
                        },
                        //*******************************************************************************************   
                        function getById(callback) {

                            userLogic.prototype.self.checkUser(user.id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //update the user
                        //*******************************************************************************************    

                        function updateUser(data, callback) {

                            if (Object.keys(data)
                                .length <= 0 && user.id != contextUser.id) {
                                return callback({
                                    name: "Invalid Update",
                                    message: "User is not allowed."
                                }, null);
                            } else {
                                user.modificationDate = new Date();
                                //no update 
                                user.username = undefined;
                                user.email = undefined;
                                user.password = undefined;
                                user.creationDate = undefined;
                                user.isActive = undefined;
                                userData.updateUser(user, user.id, function(err, result) {
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
                                            logger.log("debug", "commit", user);
                                            return callback(null, user.id);
                                        }
                                    });


                                }, connection);

                            }
                        },

                        //get information by id
                        //*******************************************************************************************            
                        function getById(id, callback) {

                            userLogic.prototype.self.checkUser(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //*******************************************************************************************
                        function saveInCache(data, callback) {
                            try {
                                var cacheL = new cache();
                                cacheL.saveCache(constants.REDIS_USER + user.id, data, function(err, result) {
                                    cacheL = null;
                                    return callback(err, result);
                                });
                            } catch (err) {
                                return callback(err);
                            }
                        }
                    ],
                    function(err, result) {
                        connection.release();
                        userData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        userData = null;
        return resultMethod(err, null);
    }

};
//******************************************************************************************* 
//
//update users with password
//
//*******************************************************************************************
userLogic.prototype.updatePassword = function(userId, password, newPassword, resultMethod) {
    var userData = new userDAL();
    var contextUser = context.getUser();
    try {
        //create a connection for the transaction
        userData.pool.getConnection(function(err, connection) {
            //start the transaction
            if (err) { //if there is an error in the connection
                return resultMethod(err, null);
            }
            connection.beginTransaction(function(err) {
                if (err) { //if there is an error in the transaction return
                    return resultMethod(err, null);
                }
                //*******************************************************************************************                    
                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
                        //validate
                        //*******************************************************************************************
                        function validateEntity(callback) {
                            var validatorM = new validatorManager();
                            if (!validator.isLength(password, {
                                    min: 6,
                                    max: 64
                                })) {
                                validatorM.addException("Password is invalid.");
                            }
                            if (!validator.isLength(newPassword, {
                                    min: 6,
                                    max: 64
                                })) {
                                validatorM.addException("new Password is invalid.");
                            }
                            if (validatorM.isValid()) {
                                validatorM = null;
                                return callback();
                            } else {
                                var message = validatorM.GenerateErrorMessage();
                                validatorM = null;
                                return callback({
                                    name: "Error in User Validation",
                                    message: message
                                }, false);
                            }
                        },
                        //*******************************************************************************************   
                        function getById(callback) {

                            userLogic.prototype.self.checkUser(userId, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //update the user
                        //*******************************************************************************************    

                        function updateUser(data, callback) {
                            try {
                                if (Object.keys(data)
                                    .length <= 0 && contextUser.id != userId) {
                                    return callback({
                                        name: "Invalid Update",
                                        message: "User is not allowed."
                                    }, null);
                                } else {
                                    var pass = cryptotHelper.encrypt(password);
                                    data.modificationDate = new Date();
                                    if (data.password == pass) {
                                        data.password = cryptotHelper.encrypt(newPassword);
                                        userData.updatePassword({
                                            password: data.password,
                                            modificationDate: data.modificationDate,
                                            id: data.id
                                        }, function(err, result) {
                                            if (err) {
                                                return connection.rollback(function() {
                                                    callback(err, null);
                                                });
                                            }
                                            //if no error commit
                                            //*******************************************************************************************
                                            connection.commit(function(err) {
                                                if (err) {
                                                    return connection.rollback(function() {
                                                        callback(err, null);
                                                    });
                                                } else {
                                                    logger.log("debug", "commit", data);
                                                    return callback(null, data.id);
                                                }
                                            });


                                        }, connection);
                                    } else {
                                        return callback({
                                            name: "Invalid Update",
                                            message: "Password Dont Match"
                                        }, null);
                                    }
                                }
                            } catch (err) {
                                logger.log("error", "createUser", err);
                                return callback(err, null);
                            }
                        },
                        //get information by id
                        //*******************************************************************************************            
                        function getById(id, callback) {

                            userLogic.prototype.self.checkUser(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //store the data on cache
                        //******************************************************************************************* 
                        function saveInCache(data, callback) {
                            var cacheL = new cache();
                            cacheL.saveCache(constants.REDIS_USER + data.id, data, function(err, result) {
                                cacheL = null;
                                return callback(err, result);
                            });

                        },
                        //send the email
                        //*******************************************************************************************                     
                        function sendEmail(data, callback) {
                            userLogic.prototype.self.sendEmail(data, "sd", function(err, result) {
                                return callback(err, data);
                            });
                        }
                    ],
                    //******************************************************************************************* 
                    function(err, result) {
                        connection.release();
                        userData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        userData = null;
        return resultMethod(err, null);
    }

};
//select User By Facebook Id
//*******************************************************************************************
userLogic.prototype.getUserByFacebookId = function(facebookId, resultMethod) {
    var userData = new userDAL();
    mod_vasync.waterfall([function Get(callback) {
        userData.getUserByFacebookId(facebookId, function(err, result) {
            return callback(err, result);
        }, null);

    }], function(err, result) {
        userData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
// Method for get the directly from the database
//
//
//*******************************************************************************************
userLogic.prototype.checkUser = function(id, resultMethod, connection) {
    var userData = new userDAL();
    mod_vasync.waterfall([

        function queryData(callback) {

            userData.getUserById(id, function(err, result) {
                return callback(err, result);
            }, connection);

        }
    ], function(err, result) {

        userData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//select User By Id
//from Cache
//
//*******************************************************************************************
userLogic.prototype.getUserById = function(id, resultMethod) {
    var userData = new userDAL();
    var cacheL = new cache();
    mod_vasync.waterfall([
        //*******************************************************************************************
        function Get(callback) {

            cacheL.getCache(constants.REDIS_USER + id, function(err, result) {
                return callback(err, result);
            });
        },
        //*******************************************************************************************
        function queryData(user, callback) {
            if (user) {
                return callback(null, {
                    isNew: false,
                    user: user
                });
            } else {
                userLogic.prototype.self.checkUser(id, function(err, result) {
                    return callback(err, {
                        isNew: true,
                        user: result
                    });
                }, null);
            }
        },
        //*******************************************************************************************

        function getdata(data, callback) {
            if (data.isNew) {
                cacheL.saveCache(constants.REDIS_USER + data.user.id, data.user, function(err, result) {
                    return callback(err, result);
                });
            } else {
                return callback(null, data.user);
            }

        }
    ], function(err, result) {
        cacheL = null;
        userData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//select User By Username
//
//*******************************************************************************************
userLogic.prototype.getUserByUsername = function(username, resultMethod) {
    var userData = new userDAL();
    mod_vasync.waterfall([function Get(callback) {
        userData.getUserByUsername(username, function(err, result) {
            return callback(err, result);
        }, null);

    }], function(err, result) {
        userData = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************
//
//select User By Username
//
//*******************************************************************************************
userLogic.prototype.loginUser = function(username, password, resultMethod) {
    var userData = new userDAL();
    mod_vasync.waterfall([
            //*******************************************************************************************
            function authorize(callback) {
                if (username == null || username == undefined) {
                    return callback(new Error({
                        name: "Error at login user",
                        message: "Invalid parameters."
                    }, null));

                }
                userData.getUserByUsername(username, function(err, result) {
                    return callback(err, result);
                }, null);

            },
            //*******************************************************************************************
            function checkPassword(user, callback) {
                try {

                    var result = cryptotHelper.compare(password, user.password);
                    if (result) {
                        return callback(null, user);
                    } else {
                        return callback({
                            name: "Error at login user",
                            message: "Invalid password."
                        }, null);

                    }

                } catch (err) {
                    logger.log("error", "loginUser", err);
                    callback(err, null);
                }

            }
        ],
        function(err, result) {
            userData = null;
            return resultMethod(err, result);
        });
};
//*******************************************************************************************
//
//block the user
//
//*******************************************************************************************
userLogic.prototype.blockUser = function(user, resultMethod) {

    var userData = new userDAL();
    try {
        //create a connection for the transaction
        userData.pool.getConnection(function(err, connection) {
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
                        //block the user
                        //*******************************************************************************************    
                        function blockUser(callback) {


                            user.modificationDate = new Date();
                            userData.blockUser(user, function(err, result) {
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
                                        logger.log("debug", "commit", user);
                                        return callback(err, user.id);
                                    }

                                });

                            }, connection);

                        },

                        //get information by id            
                        //*******************************************************************************************        

                        function getById(id, callback) {

                            userLogic.prototype.self.checkUser(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //*******************************************************************************************        
                        function saveInCache(data, callback) {
                            var cacheL = new cache();
                            cacheL.saveCache(constants.REDIS_USER + user.id, data, function(err, result) {
                                cacheL = null;
                                return callback(err, result);
                            });

                        }
                        //*******************************************************************************************          
                    ],
                    function(err, result) {
                        connection.release();
                        userData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        userData = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************
//
//unblock the user
//
//*******************************************************************************************
userLogic.prototype.unblockUser = function(user, resultMethod) {
    var userData = new userDAL();
    try {
        //create a connection for the transaction
        userData.pool.getConnection(function(err, connection) {
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
                        //unblock the user
                        //*******************************************************************************************    
                        function unblockUser(callback) {


                            user.modificationDate = new Date();
                            userData.unblockUser(user, function(err, result) {
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
                                        logger.log("debug", "commit", user);
                                        return callback(err, user.id);
                                    }

                                });

                            }, connection);

                        },

                        //get information by id            
                        //*******************************************************************************************        

                        function getById(id, callback) {

                            userLogic.prototype.self.checkUser(id, function(err, result) {
                                return callback(err, result);
                            }, connection);
                        },
                        //*******************************************************************************************        
                        function saveInCache(data, callback) {
                            var cacheL = new cache();
                            cacheL.saveCache(constants.REDIS_USER + user.id, data, function(err, result) {
                                cacheL = null;
                                return callback(err, result);
                            });

                        }
                        //*******************************************************************************************          
                    ],
                    function(err, result) {
                        connection.release();
                        userData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        userData = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************   
//
//deactivate User
//
//*******************************************************************************************
userLogic.prototype.deactivateUser = function(user, resultMethod) {
    var userData = new userDAL();
    var contextUser = context.getUser();
    try {
        //create a connection for the transaction
        userData.pool.getConnection(function(err, connection) {
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

                        //deactivate
                        //*******************************************************************************************    
                        function deactivate(callback) {

                            if (contextUser.id != user.id) {
                                return callback({
                                    name: "Invalid Update",
                                    message: "User is not allowed."
                                }, null);
                            } else {
                                user.modificationDate = new Date();
                                userData.deactivateUser(user, function(err, result) {
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
                                            logger.log("debug", "commit", user);
                                            return callback(err, user);
                                        }

                                    });

                                }, connection);
                            }
                        },

                        //*******************************************************************************************         
                        function removeCache(data, callback) {
                            var cacheL = new cache();
                            cacheL.deleteCache(constants.REDIS_USER + user.id, function(err, result) {
                                cacheL = null;
                                return callback(err, result);
                            });

                        }
                        //******************************************************************************************* 
                    ],
                    function(err, result) {
                        connection.release();
                        userData = null;
                        return resultMethod(err, result);
                    });

            });
        });
    } catch (err) {
        userData = null;
        return resultMethod(err, null);
    }

};
//*******************************************************************************************   
//
//upload profile picture
//
//*******************************************************************************************
userLogic.prototype.uploadProfilePicture = function(data, id, resultMethod) {
    var key = uuid.v1();
    var user = null;
    logger.log("debug", "uploadProfilePicture", data);
    var instance = new awsS3();
    var base64data = new Buffer(data, 'binary');
    mod_vasync.waterfall([
        //*******************************************************************************************
        function prepare(callback) {
            userLogic.prototype.self.checkUser(id, function(err, result) {
                return callback(err, result);
            });
        },
        //*******************************************************************************************
        function checkExistingItem(data, callback) {

            if (context.getUser.id != data.id) {
                return callback({
                    name: "Invalid Update",
                    message: "User is not allowed."
                }, null);
            } else {
                user = data;
                return callback(null);
            }
        },
        //*******************************************************************************************
        function uploadPicture(callback) {
            instance.put({
                    Bucket: 'chameleon-dev',
                    Key: key,
                    Body: base64data,
                },
                function(err, result) {
                    if (err == null) {
                        user.pictureUrl = key;
                    }
                    return callback(err);
                });
        },
        //*******************************************************************************************
        function update(callback) {
            userLogic.prototype.updateUser(user, function(err, result) {

                return callback(err, result);
            });

        }
        //*******************************************************************************************
    ], function(err, result) {
        instance = null;
        base64data = null;
        key = null;
        return resultMethod(err, result);
    });
};
//*******************************************************************************************   
//
//get profile picture
//
//*******************************************************************************************
userLogic.prototype.getImageAWS = function(data, resultMethod) {
    var instance = new awsS3();
    instance.get({
        Bucket: 'chameleon-dev',
        Key: data,
        ResponseContentType: "image/png",
    }, function(err, dataReceived) {
        instance = null;
        return resultMethod(err, dataReceived);
    });

};
//********************************************************************************************
userLogic.prototype.sendEmail = function(user, type, resultMethod) {
    var m = new messageHelper();
    var t = new templateHelper();
    var email = new emailT();
    m.from_email = "no-reply@fleekapp.co";
    m.subject = "test";
    //m.to.push({email:user.email});
    m.recipient_metadata.push({
        userId: user.id
    });
    t.name = "SERVER_REGISTRATION";
    t.content.push({
        name: "username",
        content: user.username
    });
    t.content.push({
        name: "body",
        content: "Esta es una prueba desde fleekapp"
    });


    email.sendEmail(t, m, function(result) {
        m = null;
        t = null;
        email = null;
        return resultMethod(null, result)
    });
}

//********************************************************************************************
module.exports = userLogic;