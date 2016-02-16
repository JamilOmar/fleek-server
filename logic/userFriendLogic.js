//*******************************************************************************************
//Name: User Friend Logic
//Description: User logic class
//Target : User Friends Creation , Administration of Users Friends
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************

require('rootpath')();
var mod_vasync  = require("vasync");
var uuid = require('node-uuid');
var config = require('config');
var cache = require('data/cache/cache.js');
var userLogic = require('./userLogic');
var userFriendDAL = require('data/dal/userFriendDal');
var logger = require('utilities/logger');
var moment = require('moment');
var context = require('security/context');

//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************
var userFriendLogic = function()
{
   userFriendLogic.prototype.self = this;
};
//*******************************************************************************************
//
// Method for get all the user's friends
//
//
//*******************************************************************************************
userFriendLogic.prototype.getUserFriendByUserId = function(id, resultMethod) {
     var userFriendData = new userFriendDAL();
        mod_vasync.waterfall([ function Get (callback){
//********************************************************************************************
        userFriendData.getUserFriendByUserId(id,function (err,result)
        {
            return  callback(err,result);
        },null);
        }], 
        function(err,result)
        {
            userFriendData = null;
            return  resultMethod(err,result);
        });
};
//*******************************************************************************************
//
// Method for get the all the approved user's friends
//
//
//*******************************************************************************************
userFriendLogic.prototype.getUserFriendApprovedByUserId = function(id, resultMethod) {
     var userFriendData = new userFriendDAL();
        mod_vasync.waterfall([ function Get (callback){
            userFriendData.getUserFriendByUserIdState(id,constants.REQUEST_STATES.APPROVED,function (err,result)
            {
              return  callback(err,result);
            },null);
        }],
        function(err,result)
        {
            userFriendData = null;
            return  resultMethod(err,result);
        });
};
//*******************************************************************************************
//
// Method for get the all the in-process user's friends
//
//
//*******************************************************************************************
userFriendLogic.prototype.getUserFriendInProcessByUserId = function(id, resultMethod) {
     var userFriendData = new userFriendDAL();
        mod_vasync.waterfall([ function Get (callback){
            userFriendData.getUserFriendByUserIdState(id,constants.REQUEST_STATES.REQUESTED,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],
        function(err,result)
        {
            userFriendData = null;
            return  resultMethod(err,result);
        });
};
//*******************************************************************************************
//
// Method for get the userfriend by id
//
//
//*******************************************************************************************
userFriendLogic.prototype.getUserFriendById = function(id, resultMethod) {
     var userFriendData = new userFriendDAL();
        mod_vasync.waterfall([ function Get (callback){
            userFriendData.getUserFriendById(id,function (err,result)
            {
              return  callback(err,result);
            },null);
        },
        ],function(err,result)
        {
            userFriendData = null;
            return  resultMethod(err,result);
        });
};

//*******************************************************************************************
//
// Method for add a friend
//
//
//*******************************************************************************************
userFriendLogic.prototype.addUserFriend = function( userFriend, resultMethod) {
       var userFriendData = new userFriendDAL();
try
{
    var userL = new userLogic();
    //create a connection for the transaction
    userFriendData.pool.getConnection(function(err,connection){
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
        mod_vasync.waterfall([
//authorize
//*******************************************************************************************
            function authorize(callback)
            {
                if(context.getUser.id == userFriend.customerId && !(context.getUser.id  == userFriend.friendId))
                {
                    return callback(null,userFriend);
                }
                else
                {
                     return callback({name: "Error at create friendship", message:"Invalid operation."},null);
                }
                
            },
//validate if is a real user
//*******************************************************************************************
             function validateFriend(userFriend,callback)
             {
                 userL.checkUser(userFriend.friendId,function(err,data)
                 {
                    if( Object.keys(data).length ==0)
                    {
                        return callback({name: "Error at create friendship", message:"Invalid operation."},null);
                    }
                    else
                    {
                        return callback(null,data);
                    }
                     
                     
                 },connection);
             },
//check if they are already friends
//*******************************************************************************************
             function checkExistingItem (data, callback){
  
                userFriendData.getUserFriendByCustomerIdFriendId(userFriend.customerId,userFriend.friendId,function (err,result)
                {
                    return  callback(err,result);
                },connection);

          },
//prepare the data for create the friendship
//*******************************************************************************************

            function prepare(data, callback)
            {
                if( Object.keys(data).length >0)
                {
                        callback({name: "Error at create friendship", message:"They are already friends"},null);
                }
                else
                {
                      
                        userFriend.id =uuid.v4();
                        var localDate =new Date();
                        userFriend.modificationDate = localDate;
                        userFriend.creationDate = localDate;
                        userFriend.state = constants.REQUEST_STATES.REQUESTED;
                        userFriend.isActive = true;
                        callback(null,userFriend);
                }
            },
//add the friend in the database
//*******************************************************************************************            
            function addFriend (userfriend , callback){    
                userFriendData.addUserFriend(userfriend,function (err,result)
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
                                logger.log("debug","commit" , result);
                                return callback(null,result );
                            }
                        });
                },connection);

            }
            ],function(err,result){
            connection.release();    
            userFriendData = null;
            userL = null;
            return  resultMethod(err,result);});
             });
        });
    }
    catch(err)
    {
         userFriendData = null;
         userL = null;
         return resultMethod(err,null );
    }
    
};
//*******************************************************************************************
//
// Method to validate the approval or denial  a friend
//
//
//*******************************************************************************************
userFriendLogic.prototype.approvalUserFriendValidation = function (  userFriend, originalUserFriend)
{
var  verification = false;    
//firts validation
//*******************************************************************************************
if( originalUserFriend.state == constants.REQUEST_STATES.REQUESTED && originalUserFriend.isActive
&& ((originalUserFriend.customerId == userFriend.customerId)&&(originalUserFriend.friendId == userFriend.friendId)))
    {
        switch (userFriend.state) {
            case constants.REQUEST_STATES.APPROVED:
            // the person who is accepting is the customer's friend
            verification = ( originalUserFriend.friendId == context.getUser.id );
            break;
  
        case constants.REQUEST_STATES.REJECTED:
          // the person who is accepting is the customer's friend
            verification = ( originalUserFriend.friendId == context.getUser.id  || originalUserFriend.customerId == context.getUser.id  );
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
// Method for approva or deny a friend
//
//
//*******************************************************************************************
userFriendLogic.prototype.approvalUserFriend = function(userFriend, resultMethod) {
       var userFriendData = new userFriendDAL();
try
{
    //create a connection for the transaction
    userFriendData.pool.getConnection(function(err,connection){
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
        mod_vasync.waterfall([
//get User friend 
//*******************************************************************************************            
        function getUserFriend ( callback){    
        userFriendData.getUserFriendById(userFriend.id,function (err,result)
        {
            return  callback(err,result);
        },connection);

        }, 
//validate if the user Friend Exists
//*******************************************************************************************    
        function checkExistingItem(data, callback)
        {
            if( Object.keys(data).length <=0)
            {
                    return callback({name: "Error at create friendship", message:"Invalid operation."},null);
            }
            else
            {
                if (userFriendLogic.prototype.self.approvalUserFriendValidation(context.getUser.id , userFriend, data))
                {
                    //prepare data
                    userFriend.modificationDate =new Date();
                    delete userFriend.customerId;
                    delete userFriend.friendId;
                    delete userFriend.creationDate;
                    if(userFriend.state == constants.REQUEST_STATES.REJECTED)
                    {
                        userFriend.isActive =false;
                    }
                    else
                    {
                        delete userFriend.isActive;
                    }
                    return callback(null,userFriend);
                }
                else
                {
                     return callback({name: "Error at create friendship", message:"Invalid operation."},null);
                }
                
            }
        },
//update the data
//*******************************************************************************************            
        function updateFriend (userfriend , callback){    
            userFriendData.updateUserFriend(userfriend,userfriend.id,function (err,result)
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
                        logger.log("debug","commit" , result);
                        return callback(err,result );
                    }
                
                });
            },connection);

            }],function(err,result){
            connection.release();    
            userFriendData = null;
            return  resultMethod(err,result);});
        });
        });
    }
    catch(err)
    {
         userFriendData = null;
         return resultMethod(err,null );
    }
};

//*******************************************************************************************
//
// Method for remove the friendship of a user
//
//
//*******************************************************************************************
userFriendLogic.prototype.removeUserFriend = function(userFriend, resultMethod) {
       var userFriendData = new userFriendDAL();
try
{
    //create a connection for the transaction
    userFriendData.pool.getConnection(function(err,connection){
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
        mod_vasync.waterfall([
            
//get User friend 
//*******************************************************************************************            
            function getUserFriend ( callback){    
                userFriendData.getUserFriendById(userFriend.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);

            }, 
//validate if the user Friend Exists
//*******************************************************************************************    
            function checkExistingItem(data, callback)
            {
                if( Object.keys(data).length <=0)
                {
                    return callback({name: "Error at create friendship", message:"Invalid operation."},null);
                }
                else
                {

                    if(context.getUser.id  == data.customerId || context.getUser.id  == data.friendId)
                    {
                        userFriend.modificationDate =new Date();
                        return callback(null,userFriend);
                    }
                    else
                    {
                            return callback({name: "Error at create friendship", message:"Invalid operation."},null);

                    }
                }
                    
                },
//remove the user friend
//*******************************************************************************************  
            function removeFriend (userfriend , callback){    
            userFriendData.removeUserFriend(userfriend,function (err,result)
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
                        logger.log("debug","commit" , result);
                        return callback(err,result );
                    }
                
                });
            },connection);

        }],function(err,result){
            userFriendData = null;
            return  resultMethod(err,result);});
        });
        });
    }
    catch(err)
    {
         userFriendData = null;
         return resultMethod(err,null );
    }
};    
//********************************************************************************************
module.exports = userFriendLogic;