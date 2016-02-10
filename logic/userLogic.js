require('rootpath')();
var awsS3 = require('utilities/amazonS3');
var uuid = require('node-uuid');
var mod_vasync  = require("vasync");
var crypto = require('crypto');
var config = require('config');
var userDAL = require('data/dal/userDal');
var cache = require('data/cache/cache.js');
var logger = require('utilities/logger');
var moment = require('moment');
var jwt = require('jwt-simple');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var userLogic = function()
{
   userLogic.prototype.self = this;
};
//encrypt
//*******************************************************************************************
userLogic.prototype.encrypt = function(password) {
  
    if((!password || 0 === password.length))
    {
        throw {name: "Error at encryption", message:"User is empty"};
    }
    else
    {
        return crypto.createHmac('sha256',"Fl33kk@pp2016P@$$w0rdG3n").update(password).digest("base64"); 
    }
}

//compare
//*******************************************************************************************
userLogic.prototype.compare = function(password,hashed){  
    if((!password || 0 === password.length)) 
    {
          return false;
    }
    else
    {
        var  result =crypto.createHmac('sha256',"Fl33kk@pp2016P@$$w0rdG3n").update(password).digest("base64"); 
        return  hashed == result;
     }
}
//generate jwt token
//*******************************************************************************************
userLogic.prototype.generateToken = function(user){  
    var expires = moment().add('days', 15).valueOf();
    var token = jwt.encode({
        id: user.id,
        exp: expires
    }, "Fl33kk@pp2016P@$$w0rdG3n");
  
    return token;
}
//validate jwt token
//*******************************************************************************************
userLogic.prototype.checkToken = function(token){  
    
    try
    {
       var decoded = jwt.decode(token, "Fl33kk@pp2016P@$$w0rdG3n");
       return decoded;
    }
    catch(err)
    {
         logger.log("error","checkToken" , err);
         return null;
    }
}
//signup Users
//*******************************************************************************************
userLogic.prototype.signup = function(user, resultMethod) {
      mod_vasync.waterfall([
//prepare the data
//*******************************************************************************************    
            function prepare(callback)
            {
                userLogic.prototype.self.createUser(user,function (err,data)
                {
                return callback(err,data);
                });
            },
//*******************************************************************************************
            function generateToken(userSaved,callback)
            {
                try
                {
                    var resultObject = null;       
                    var token =  userLogic.prototype.self.generateToken(userSaved);
                    resultObject =  { authenticated:true ,token : token , user: userSaved };
                    return  callback(null,resultObject);
                }
                catch(err)
                {
                        logger.log("error","signup" , err);
                        callback(err,null);
                } 
            }
                 ],
//*******************************************************************************************
            function(err,result)
            {
            
                return  resultMethod(err,result);
            });
}

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
                         return callback({name: "Error at creation", message:"Username already taken"},null);
                    }
                },
//create hash
//******************************************************************************************* 
                function hashPassword(user,callback)
                {
                    try
                    {
                        
                        
                        user.password =   userLogic.prototype.self.encrypt(user.password);
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
userLogic.prototype.updateUser = function(currentUserId,user, resultMethod) {
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
//Validate previous data
//*******************************************************************************************    

                 function validatePreviousData(callback)
                    {
                       userLogic.prototype.self.checkUser(user.id,function (err,result)
                    {
                       
                        return  callback(err,resultMethod);
                    },connection);
                    
                    },
//check if the item can be updated
//*******************************************************************************************    

                function checkExistingItem(existingUser , callback)
                {
                
                    if(Object.keys(existingUser).length <=0 || existingUser.isActive === false || 
                    existingUser.id != currentUserId)
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
userLogic.prototype.updatePassword = function(currentUserId,user, resultMethod) {
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
                    function validatePreviousData(callback)
                    {
                        userLogic.prototype.self.checkUser(user.id,function (err,result)
                    {
                       
                        return  callback(err,resultMethod);
                    },connection);
                    
                    },
//check if the item can be updated
//*******************************************************************************************    

                     function checkExistingItem(existingUser , callback)
                        {
                
                            if(Object.keys(existingUser).length <=0 || existingUser.isActive === false||
                            existingUser.id !=currentUserId)
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
                            user.password =   userLogic.prototype.self.encrypt(user.password);
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
userLogic.prototype.loginUser = function(data, resultMethod) {
     var userData = new userDAL();
        mod_vasync.waterfall([
//*******************************************************************************************
        function Get (callback){
        if(data.username == null || data.username == undefined)
        {
            return callback(new Error("No username provided",null));
            
        }
        userData.getUserByUsername(data.username,function (err,result)
        {
            return  callback(err,result);
        },null);

        },
//*******************************************************************************************
        function checkPassword(user,callback)
         {
           try
           {
                var resultObject = null;                       
                var result =  userLogic.prototype.self.compare(data.password, user.password);
                if(result)
                {
                    var token =  userLogic.prototype.self.generateToken(user);
                    resultObject =  { authenticated:result ,token : token , user: user };
                    return  callback(null,resultObject); 
                }
                else{
                    
                    resultObject =  { authenticated:result ,token : null , user: null };
                      
                }
                    return  callback(null,resultObject); 
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
userLogic.prototype.blockUser = function(currentUserId,user, resultMethod) {
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
//Validate previous data
//*******************************************************************************************    

                function validatePreviousData(callback)
                {
                    userLogic.prototype.self.checkUser(user.id,function (err,result)
                {
                    
                    return  callback(err,resultMethod);
                },null);
                
                },
//check if the item can be updated
//*******************************************************************************************    
                function checkExistingItem(existingUser , callback)
                {
        
                    if(Object.keys(existingUser).length <=0 || existingUser.isActive === false ||
                    existingUser.id != currentUserId)
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
userLogic.prototype.deactivateUser = function(currentUserId,user, resultMethod) {
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
//*******************************************************************************************    

                function validatePreviousData(callback)
                {
                userLogic.prototype.self.checkUser(user.id,function (err,result)
                {
                    
                    return  callback(err,resultMethod);
                },connection);
                
                },
//check if the item can be updated
//*******************************************************************************************    
                function checkExistingItem(existingUser , callback)
                {
        
                    if(Object.keys(existingUser).length <=0 || existingUser.isActive === false ||
                    existingUser.id !=currentUserId)
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
userLogic.prototype.uploadProfilePicture = function(currentUserId,data,id, resultMethod) {
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
    
                if(Object.keys(user).length <=0 || user.isActive === false ||
                id!=currentUserId)
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