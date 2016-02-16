//*******************************************************************************************
//Name: User Logic
//Description: User logic class
//Target : User Creation , Administration of Users 
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var awsS3 = require('utilities/amazonS3');
var uuid = require('node-uuid');
var mod_vasync  = require("vasync");
var crypto = require('crypto');
var config = require('config');
var userDAL = require('data/dal/userDal');
var cache = require('data/cache/cache.js');
var logger = require('utilities/logger');
var cryptotHelper = require('security/helper/cryptoHelper') 
var moment = require('moment');
var validator =require('validator');
var context = require('security/context');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var userLogic = function()
{
   userLogic.prototype.self = this;
};




//*******************************************************************************************
//
//create users
//*******************************************************************************************
userLogic.prototype.createUser = function(user, resultMethod) {
var userData = new userDAL();
try
{
    //create a connection for the transaction
       userData.pool.getConnection(function(err,connection){
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
//check the username
//*******************************************************************************************
                function check(callback)
                {
                    userData.getUserByUsername(user.username, function (err,result) {
                        
                           return callback(err,result);
                    });
                },
//method to prepare the data
//*******************************************************************************************    
                function prepare(existingUser,callback)
                {
                    if( Object.keys(existingUser).length <=0)
                    {
                        var localDate = new Date();
                        user.modificationDate = localDate;
                        user.creationDate = localDate;
                        user.isActive = true;
                        user.isBlocked =false;
                        return callback(null,user);
                    }
                    else
                    {
                         return callback({name: "Error at creation", message:"Username already exists."},null);
                    }
                },
//create hash
//******************************************************************************************* 
                function hashPassword(user,callback)
                {
                    try
                    {
                        
                        
                        user.password =   cryptotHelper.encrypt(user.password);
                        return callback(null,user);
                    }
                    catch (err)
                    {
                           logger.log("error","createUser" , err);
                           callback(err,null);
                    }
                },    
//method to create the user
//*******************************************************************************************    
                function createUser(user,callback)
                {
                    userData.createUser(user,function (err,result)
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
                                logger.log("debug","commit" , user);
                                return callback(null,result );
                            }
                        });
                          
                  
                    },connection);

                },
//get information by id
//*******************************************************************************************            
                function getById (id, callback)
                {
                     userLogic.prototype.self.checkUser(id,function (err,result)
                    {
                        return  callback(err,result);
                    },connection);
                },
//store the information under cache
//******************************************************************************************* 
                function saveInCache(user,callback)
                {
                    var cacheL =new cache();
                    cacheL.saveCache(constants.REDIS_USER+user.id,user,function(err,result)
                    {
                        cacheL = null; 
                        return callback(err,result);
                    });
          
                }
                ],
//*******************************************************************************************
                function(err,result)
                {
                    connection.release();
                    userData = null;
                    return  resultMethod(err,result);
                });
        });
    });
    }
    catch(err)
    {
         userData = null;
         return resultMethod(err,null );
    }
        
};
//******************************************************************************************* 
//
//update users but not password
//
//*******************************************************************************************
userLogic.prototype.updateUser = function(user, resultMethod) {
var userData = new userDAL();
try
{
    //create a connection for the transaction
    userData.pool.getConnection(function(err,connection){
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
//check if the item can be updated
//*******************************************************************************************    

                function checkExistingItem( callback)
                {
                
                    if(user.id != context.getUser.id)
                    {
                    return callback({name: "Invalid Update", message:"User is not allowed."},null); 
                    }
                    else
                    {
                            return callback(null,user); 
                    } 
                },
//method to prepare the data        
 //*******************************************************************************************                  
      
                function prepare(user,callback)
                {
                    user.modificationDate =new Date();
                    //no update password
                    delete user.password;
                    delete user.creationDate;
                    delete user.isActive;
                    callback(null,user);
                },
//update
//*******************************************************************************************    
                function updateUser(user,callback)
                {
                    userData.updateUser(user,user.id,function (err,result)
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
                                logger.log("debug","commit" , user);
                                return callback(null,user );
                            }
                        });
                     
                 
                    },connection);

        },
//get information by id
//*******************************************************************************************            
        function getById (user, callback)
        {
           
                userLogic.prototype.self.checkUser(user.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        },
//*******************************************************************************************
        function saveInCache(user,callback)
        {
            var cacheL =new cache();
            cacheL.saveCache(constants.REDIS_USER+user.id,user,function(err,result)
            {
                cacheL = null; 
                return callback(err,result);
            });
          
        }
        ],
        function(err,result)
        {
                connection.release();
                userData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
          userData = null;
         return resultMethod(err,null );
    }
        
};
//******************************************************************************************* 
//
//update users with password
//
//*******************************************************************************************
userLogic.prototype.updatePassword = function(user, resultMethod) {
var userData = new userDAL();
try
{
    //create a connection for the transaction
    userData.pool.getConnection(function(err,connection){
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
//*******************************************************************************************                    
                    //mod_vasync , waterfall for better order
                    mod_vasync.waterfall([
                    
 
//check if the item can be updated
//*******************************************************************************************    

                     function checkExistingItem(callback)
                        {
                
                            if(context.getUser.id != user.id)
                            {
                            return callback({name: "Invalid Update", message:"User is not allowed."},null); 
                            }
                            else
                            {
                                    return callback(null,user); 
                            } 
                        }, 
                
//method to prepare the data
//*******************************************************************************************    
                    function prepare(user,callback)
                    {
                        user.modificationDate =new Date();
                        delete user.creationDate;
                        delete user.isActive;
                        callback(null,user);
                    },
//create hash
//******************************************************************************************* 
                    function hashPassword(user,callback)
                    {
                        try
                        {
                            user.password =   cryptotHelper.encrypt(user.password);
                            return callback(null,user);
                        }
                        catch (err)
                        {
                           logger.log("error","createUser" , err);
                           callback(err,null);
                        }
                    },    
//update
//******************************************************************************************* 
                    function updatePassword(user,callback)
                    {
                        userData.updatePassword({password:user.password, modificationDate:user.modificationDate ,id: user.id},function (err,result)
                        {
                            if(err)
                            {
                                return connection.rollback(function() {
                                    callback(err,null);});
                            }
//if no error commit
//*******************************************************************************************
                            connection.commit(function(err) 
                            {
                                if(err)
                                {
                                    return connection.rollback(function() {
                                        callback(err,null);});
                                }
                                else
                                {
                                    logger.log("debug","commit" , user);
                                    return callback(null,user );
                                }
                            });
                     
                           
                            },connection);

                    },
//get information by id
//*******************************************************************************************            
                    function getById (user, callback)
                    {
           
                        userLogic.prototype.self.checkUser(user.id,function (err,result)
                        {
                            return  callback(err,result);
                        },connection);
                    },
//store the data on cache
//******************************************************************************************* 
                    function saveInCache(user,callback)
                    {
                        var cacheL =new cache();
                        cacheL.saveCache(constants.REDIS_USER+user.id,user,function(err,result)
                        {
                            cacheL = null;
                            return callback(err,result);
                        });
          
                    }
        ],
//******************************************************************************************* 
        function(err,result)
        {
                connection.release();
                userData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         userData = null;
         return resultMethod(err,null );
    }
        
};
//select User By Facebook Id
//*******************************************************************************************
userLogic.prototype.getUserByFacebookId = function(facebookId, resultMethod) {
     var userData = new userDAL();
        mod_vasync.waterfall([ function Get (callback){
         userData.getUserByFacebookId(facebookId,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            userData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
// Method for get the directly from the database
//
//
//*******************************************************************************************
userLogic.prototype.checkUser = function(id, resultMethod,connection) {
     var userData = new userDAL();
        mod_vasync.waterfall([

            function queryData (callback)
            {
                
                    userData.getUserById(id,function (err,result)
                    {
                      return callback(err,result);
                    },connection);
                
            }],function(err,result){
           
            userData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
//select User By Id
//from Cache
//
//*******************************************************************************************
userLogic.prototype.getUserById = function(id, resultMethod) {
     var userData = new userDAL();
     var cacheL =new cache();
        mod_vasync.waterfall([
//*******************************************************************************************
            function Get (callback){
            
            cacheL.getCache(constants.REDIS_USER+id,function(err,result)
            {
                return callback(err,result);
            });
            }, 
//*******************************************************************************************
            function queryData (user,callback)
            {
                if( user)
                {
                    return  callback(null,{isNew:false, user:user});
                }
                else
                {
                    userLogic.prototype.self.checkUser(id,function (err,result)
                    {
                        return  callback(err,{isNew:true, user:result});
                    },null);
                }
            },
//*******************************************************************************************

            function getdata(data, callback)
            {
                if(data.isNew)
                {
                    cacheL.saveCache(constants.REDIS_USER+data.user.id,data.user,function(err,result)
                        {
                            return callback(err,result);
                        });
                }
                else
                {
                    return callback(null, data.user);
                }
                
            }],function(err,result){
            cacheL = null; 
            userData = null;
            return  resultMethod(err,result);});
};
//*******************************************************************************************
//
//select User By Username
//
//*******************************************************************************************
userLogic.prototype.getUserByUsername = function(username, resultMethod) {
     var userData = new userDAL();
        mod_vasync.waterfall([ function Get (callback){
            userData.getUserByUsername(username,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            userData = null;
            return  resultMethod(err,result);});
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
        function authorize (callback){
        if(username == null || username == undefined)
        {
            return callback(new Error({name: "Error at login user", message:"Invalid parameters."},null));
            
        }
        userData.getUserByUsername(username,function (err,result)
        {
            return  callback(err,result);
        },null);

        },
//*******************************************************************************************
        function checkPassword(user,callback)
         {
           try
           {
                       
                var result =  cryptotHelper.compare(password, user.password);
                if(result)
                {
                    return  callback(null,user); 
                }
                else
                {
                    return  callback({name: "Error at login user", message:"Invalid password."},null); 
                      
                }
                   
           }
          catch (err)
           {
                    logger.log("error","loginUser" , err);
                    callback(err,null);
           }
                                                   
         }],
         function(err,result){
            userData = null;
            return  resultMethod(err,result);
            });
};
//*******************************************************************************************
//
//block the user
//
//*******************************************************************************************
userLogic.prototype.blockUser = function(user, resultMethod) {
var userData = new userDAL();
try
{
    //create a connection for the transaction
    userData.pool.getConnection(function(err,connection){
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
//check if the item can be updated
//*******************************************************************************************    
                function checkExistingItem( callback)
                {
        
                    if(context.getUser.id != user.id)
                    {
                    return callback({name: "Invalid Update", message:"User is not allowed."},null); 
                    }
                    else
                    {
                            return callback(null,user); 
                    } 
                }, 
//method to prepare the data
//*******************************************************************************************  
                function prepare(user,callback)
                {
                    user.modificationDate =new Date();
                    callback(null,user);
                },
//method to deactivate the user
//*******************************************************************************************      
                function deactivate(user,callback)
                {
                    userData.blockUser(user,function (err,result)
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
                                 logger.log("debug","commit" , user);
                                 return callback(err,user );
                            }
                          
                        });
                   
                    },connection);

        },
//get information by id            
//*******************************************************************************************        
           
                function getById (user, callback)
                {
                
                        userLogic.prototype.self.checkUser(user.id,function (err,result)
                        {
                            return  callback(err,result);
                        },connection);
                },
//*******************************************************************************************        
                function saveInCache(user,callback)
                {
                    var cacheL =new cache();
                    cacheL.saveCache(constants.REDIS_USER+user.id,user,function(err,result)
                    {
                        cacheL = null;
                        return callback(err,result);
                    });
                
                }
//*******************************************************************************************          
        ],
        function(err,result)
        {
                connection.release();
                userData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         userData = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************   
//
//deactivate User
//
//*******************************************************************************************
userLogic.prototype.deactivateUser = function(user, resultMethod) {
    var userData = new userDAL();
try
{
    //create a connection for the transaction
    userData.pool.getConnection(function(err,connection){
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

//check if the item can be updated
//*******************************************************************************************    
                function checkExistingItem(callback)
                {
        
                    if(context.getUser.id != user.id)
                    {
                    return callback({name: "Invalid Update", message:"User is not allowed."},null); 
                    }
                    else
                    {
                            return callback(null,user); 
                    } 
                }, 
//method to prepare the data
//*******************************************************************************************  
                function prepare(user,callback)
                {
                    user.modificationDate =new Date();
                    callback(null,user);
                },
//method to create the user
//*******************************************************************************************     
                function deactivate(user,callback)
                {
                    userData.deactivateUser(user,function (err,result)
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
                                logger.log("debug","commit" , user);
                                return callback(err,user );
                            }
                       
                        });
                  
                    },connection);

        },
//get information by id
//*******************************************************************************************             
        function getById (user, callback)
        {
           
                userLogic.prototype.self.checkUser(user.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        },

//*******************************************************************************************         
        function removeCache(data,callback)
        {
            var cacheL =new cache();
            cacheL.deleteCache(constants.REDIS_USER+user.id,function(err,result)
            {
                cacheL = null;
                return callback(err,result);
            });
          
        }
//******************************************************************************************* 
        ],
        function(err,result)
        {
                connection.release();
                userData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         userData = null;
         return resultMethod(err,null );
    }
        
};
//*******************************************************************************************   
//
//upload profile picture
//
//*******************************************************************************************
userLogic.prototype.uploadProfilePicture = function(data,id, resultMethod) {
        var key =  uuid.v1();
        logger.log("debug","uploadProfilePicture",data);
        var instance = new awsS3();
        var base64data = new Buffer(data, 'binary');
        mod_vasync.waterfall([ 
//*******************************************************************************************
            function prepare(callback)
            {
                 userLogic.prototype.self.checkUser(id, function(err,result ){
                    return callback (err,result);    
                }); 
            },
//*******************************************************************************************
            function checkExistingItem(user , callback)
            {
    
                if(context.getUser.id != user.id)
                {
                return callback({name: "Invalid Update", message:"User is not allowed."},null); 
                }
                else
                {
                        return callback(null,user); 
                } 
            },
//*******************************************************************************************
            function uploadPicture (user , callback)
            {    
                instance.put(
                {
                Bucket: 'chameleon-dev', 
                Key: key, 
                Body: base64data,    
                },
                function(err,result)
                {
                    if(err == null )
                    {
                        user.pictureUrl=key;
                    }
                    return  callback(err,user);    
                });
            },
//*******************************************************************************************
            function update(user,callback)
            {
              userLogic.prototype.updateUser(user, function(err,result ){
                  
                 return callback (err,result); 
              }); 
               
            }
//*******************************************************************************************
            ],function(err,result){
                instance = null;    
                base64data = null;
                key = null;
                return  resultMethod(err,result);});
};
//*******************************************************************************************   
//
//get profile picture
//
//*******************************************************************************************
userLogic.prototype.getImageAWS = function( data, resultMethod) {
        var instance = new awsS3();
        instance.get({
        Bucket: 'chameleon-dev', 
        Key: data,
        ResponseContentType :"image/png",   
        },function(err,dataReceived)
        {
            instance = null;
            return  resultMethod(err,dataReceived);
        });

};


//********************************************************************************************
module.exports = userLogic;