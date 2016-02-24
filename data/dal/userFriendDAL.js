//*******************************************************************************************
//Name: User Friend DAl
//Description: Base class for connectivity with the MySql Database
//Target : Administration of user's friends
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var userFriendModel  = require('models/userFriend');
var userModel  = require('models/user');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var userFriendDAL = function()
{
  
   userFriendDAL.prototype.self = this;
};
  userFriendDAL.prototype =  new baseDAL();




//Method to add friends
//*******************************************************************************************
userFriendDAL.prototype.addUserFriend = function(data, resultMethod,connection) {
     data = userFriendDAL.prototype.self.mapperModelToSql(data);
      var addUserFriendQuery = "INSERT INTO `chameleon`.`CustomerFriend` SET ?;";
             userFriendDAL.prototype.query(addUserFriendQuery,data,function (err,result)
                {
                    logger.log("debug","addUserFriend",data);
                    return resultMethod(err, userFriendDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to Update friends
//*******************************************************************************************
userFriendDAL.prototype.updateUserFriend  = function(data,id, resultMethod,connection) {
     data = userFriendDAL.prototype.self.mapperModelToSql(data); 
            var updateUserFriendQuery = "UPDATE `chameleon`.`CustomerFriend` SET ? WHERE ?;";
             userFriendDAL.prototype.queryWithArgument(updateUserFriendQuery,data,{CustomerFriendId:id},function (err,result)
                {
                    logger.log("debug","updateUserFriend",data);
                    return resultMethod(err, userFriendDAL.prototype.nonQueryResult(result));
                },connection);
        };
//Method to Select User By friend Id
//*******************************************************************************************
userFriendDAL.prototype.getUserFriendByUserId = function(id, resultMethod,connection) {
    var getUserFriendByUserIdQuery ="SELECT customerFriend.`CustomerFriendId` , customerFriend.`CustomerId` , customerFriend.`FriendId` , customerFriend.`State` , customerFriend.`ModificationDate` ,customerFriend.`CreationDate` , customerFriend.`IsActive` , friend.`UserId` as 'friend_UserId', friend.`Name` as 'friend_Name', friend.`Lastname` as 'friend_Lastname', friend.`Username` as 'friend_Username' , friend.`PictureUrl` as 'friend_PictureUrl',  customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl'  FROM `chameleon`.`CustomerFriend` customerFriend INNER JOIN User friend on friend.`UserId` = customerFriend.`FriendId` INNER JOIN `User` customer on customer.`UserId` = customerFriend.`CustomerId` WHERE  customer.`IsActive` =1 AND  customer.`IsBlocked` =0  AND friend.`IsActive` = 1 AND friend.`IsBlocked` = 0  AND customerFriend.`IsActive`=1 AND customerFriend.`CustomerId` = ? order by  friend.`Lastname`";
                
                userFriendDAL.prototype.getByArguments(getUserFriendByUserIdQuery,id,function (err,result)
                {
                    
                    logger.log("debug","getUserFriendByUserId" , result);
                    return resultMethod(err,  userFriendDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method to Select User By friend Id and State
//*******************************************************************************************
userFriendDAL.prototype.getUserFriendByUserIdState = function(id,state, resultMethod,connection) {
    var getUserFriendByUserIdStateQuery ="SELECT customerFriend.`CustomerFriendId` , customerFriend.`CustomerId` , customerFriend.`FriendId` , customerFriend.`State` , customerFriend.`ModificationDate` ,customerFriend.`CreationDate` , customerFriend.`IsActive` , friend.`UserId` as 'friend_UserId', friend.`Name` as 'friend_Name', friend.`Lastname` as 'friend_Lastname', friend.`Username` as 'friend_Username' , friend.`PictureUrl` as 'friend_PictureUrl',  customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl'  FROM `chameleon`.`CustomerFriend` customerFriend INNER JOIN User friend on friend.`UserId` = customerFriend.`FriendId` INNER JOIN `User` customer on customer.`UserId` = customerFriend.`CustomerId` WHERE  customer.`IsActive` =1 AND  customer.`IsBlocked` =0 AND friend.`IsActive` = 1  AND friend.`IsBlocked` = 0 AND customerFriend.`IsActive`=1 AND customerFriend.`CustomerId` = ? AND customerFriend.`State` = ? order by  friend.`Lastname`";
                
                userFriendDAL.prototype.getByArguments(getUserFriendByUserIdStateQuery,id,function (err,result)
                {
                    
                    logger.log("debug","getUserFriendByUserIdState" , result);
                    return resultMethod(err,  userFriendDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method to Select UserFriend by Id
//*******************************************************************************************
userFriendDAL.prototype.getUserFriendById = function(id, resultMethod,connection) {
    var getUserFriendByIdQuery ="SELECT customerFriend.`CustomerFriendId` , customerFriend.`CustomerId` , customerFriend.`FriendId` , customerFriend.`State` , customerFriend.`ModificationDate` ,customerFriend.`CreationDate` , customerFriend.`IsActive` , friend.`UserId` as 'friend_UserId', friend.`Name` as 'friend_Name', friend.`Lastname` as 'friend_Lastname', friend.`Username` as 'friend_Username' , friend.`PictureUrl` as 'friend_PictureUrl',  customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl'  FROM `chameleon`.`CustomerFriend` customerFriend INNER JOIN User friend on friend.`UserId` = customerFriend.`FriendId` INNER JOIN `User` customer on customer.`UserId` = customerFriend.`CustomerId` WHERE  customer.`IsActive` =1 AND  customer.`IsBlocked` = 0 AND friend.`IsActive` = 1  AND friend.`IsBlocked` = 0 AND  customerFriend.`IsActive`=1 AND customerFriend.`CustomerFriendId` = ?";
                
                userFriendDAL.prototype.getByArguments(getUserFriendByIdQuery,id,function (err,result)
                {
                    
                    logger.log("debug","getUserFriendById" , result);
                    
                    return resultMethod(err,   userFriendDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to Select User friend by Customer Id and Friend Id
//*******************************************************************************************
userFriendDAL.prototype.getUserFriendByCustomerIdFriendId = function(customerId,friendId, resultMethod,connection) {
    var getUserFriendByCustomerIdFriendIdQuery ="SELECT customerFriend.`CustomerFriendId` , customerFriend.`CustomerId` , customerFriend.`FriendId` , customerFriend.`State` , customerFriend.`ModificationDate` ,customerFriend.`CreationDate` , customerFriend.`IsActive` , friend.`UserId` as 'friend_UserId', friend.`Name` as 'friend_Name', friend.`Lastname` as 'friend_Lastname', friend.`Username` as 'friend_Username' , friend.`PictureUrl` as 'friend_PictureUrl',  customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl'  FROM `chameleon`.`CustomerFriend` customerFriend INNER JOIN User friend on friend.`UserId` = customerFriend.`FriendId` INNER JOIN `User` customer on customer.`UserId` = customerFriend.`CustomerId` WHERE customer.`IsActive` =1 AND  customer.`IsBlocked` = 0 AND  friend.`IsActive` = 1  AND friend.`IsBlocked` = 0 AND customerFriend.`IsActive`=1 AND customerFriend.`CustomerId` =? AND customerFriend.`FriendId` =?";
                
                userFriendDAL.prototype.getByArguments(getUserFriendByCustomerIdFriendIdQuery,[customerId,friendId],function (err,result)
                {
                    
                    logger.log("debug","getUserFriendByCustomerIdFriendId" , result);
                    
                    return resultMethod(err,  userFriendDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to remove friends
//*******************************************************************************************
userFriendDAL.prototype.removeUserFriend = function(data, resultMethod,connection) {
     var disableParameters = 
               [
                 
                      data.modificationDate,
                      data.id,
               ];
      var removeUserFriendQuery = "UPDATE `chameleon`.`CustomerFriend` SET `ModificationDate`=?,`IsActive`=0 WHERE `CustomerFriendId`=?;";
             userFriendDAL.prototype.query(removeUserFriendQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","removeUserFriend",data);
                    return resultMethod(err, userFriendDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method for transform the information from sql to model
//********************************************************************************************
userFriendDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
       if(data != null && data.length >0)
        {
            data = data[0];
            var userFriend  = new userFriendModel();
            userFriend.id = data.CustomerFriendId;
            userFriend.customerId = data.CustomerId;
            userFriend.friendId = data.FriendId;
            userFriend.creationDate = data.CreationDate;
            userFriend.modificationDate = data.ModificationDate;
            userFriend.state = data.State;
            userFriend.isActive = data.IsActive
            userFriend.friend = new userModel();
            userFriend.friend.basicInformation(data.friend_UserId ,data.friend_Name, data.friend_Lastname , data.friend_Username , data.friend_PictureUrl);
            userFriend.customer = new userModel();
            userFriend.customer.basicInformation(data.customer_UserId ,data.customer_Name, data.customer_Lastname , data.customer_Username , data.customer_PictureUrl);
            data = null;
            return userFriend;
        }
         else
        {
            return {};
        }
   
    }
    catch(err)
    {
         logger.log("error","mapperSqlToModel",err);
        return null;
    }
    
        

}
//Method for transform the information from sql to  a model Collection
//********************************************************************************************


userFriendDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var userFriendCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var userFriend  = new userFriendModel();
                userFriend.id = data.CustomerFriendId;
                userFriend.customerId = data.CustomerId;
                userFriend.friendId = data.FriendId;
                userFriend.creationDate = data.CreationDate;
                userFriend.modificationDate = data.ModificationDate;
                userFriend.state = data.State;
                userFriend.isActive = data.IsActive
                userFriend.friend = new userModel();
                userFriend.friend.basicInformation(data.friend_UserId ,data.friend_Name, data.friend_Lastname , data.friend_Username , data.friend_PictureUrl);
                userFriend.customer = new userModel();
                userFriend.customer.basicInformation(data.customer_UserId ,data.customer_Name, data.customer_Lastname , data.customer_Username , data.customer_PictureUrl);
                data = null;
                userFriendCollection.push(userFriend);
            }
            return userFriendCollection;
        }
        else
        {
            return {};
        }
   
    }
    catch(err)
    {
         logger.log("error","mapperSqlToModel",err);
        return null;
    }    

}

//Method for transform the information from model to sql
//********************************************************************************************
userFriendDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id") && data.id != undefined)
    mysqlModel.CustomerFriendId = data.id;
     if(data.hasOwnProperty("customerId")  && data.customerId != undefined)    
    mysqlModel.CustomerId  = data.customerId;
     if(data.hasOwnProperty("friendId") && data.friendId != undefined)
    mysqlModel.FriendId = data.friendId;
     if(data.hasOwnProperty("creationDate") && data.creationDate != undefined)
    mysqlModel.CreationDate = data.creationDate;
     if(data.hasOwnProperty("modificationDate" ) && data.modificationDate != undefined)
    mysqlModel.ModificationDate = data.modificationDate;
     if(data.hasOwnProperty("state") && data.state != undefined)
    mysqlModel.State = data.state;
     if(data.hasOwnProperty("isActive") && data.isActive != undefined)
    mysqlModel.IsActive = data.isActive
     logger.log("debug","mapperModelToSql",mysqlModel);
      return mysqlModel;    
    }
    catch (err)
    {
         logger.log("error","mapperModelToSql",err);
        return null;
    }
  
}

//********************************************************************************************
module.exports =  userFriendDAL;