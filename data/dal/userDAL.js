//*******************************************************************************************
//Name: User DAl
//Description: Base class for connectivity with the MySql Database
//Target : User Creation , Administration of users
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var userModel  = require('models/user');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************
var userDAL = function()
{
   userDAL.prototype.self = this;
};
  userDAL.prototype =   new baseDAL();
//Method to Create Users
//*******************************************************************************************
userDAL.prototype.createUser = function(data, resultMethod,connection) {
    data = userDAL.prototype.self.mapperModelToSql(data); 
            var createUserQuery = "INSERT INTO `chameleon`.`User` SET ?;";
             userDAL.prototype.query(createUserQuery,data,function (err,result)
                {
                    logger.log("debug","createUser",result.insertId);
                    return resultMethod(err,userDAL.prototype.nonQueryResult(result) );
                },connection);
        };
//Method to Update Users
//*******************************************************************************************
userDAL.prototype.updateUser  = function(data,id, resultMethod,connection) {
     data = userDAL.prototype.self.mapperModelToSql(data); 
            var updateUserQuery = "UPDATE `chameleon`.`User` SET ? WHERE ?;";
             userDAL.prototype.queryWithArgument(updateUserQuery,data,{UserId:id},function (err,result)
                {
                    logger.log("debug","updateUser",data);
                    return resultMethod(err,userDAL.prototype.nonQueryResult(result));
                },connection);
        };
//Method to Select User By Facebook Id
//*******************************************************************************************
userDAL.prototype.getUserByFacebookId = function(facebookId, resultMethod,connection) {
    var getUserByFacebookIdQuery ="SELECT * FROM `chameleon`.`User` WHERE `IsActive` = 1 AND `FacebookId` =?";
                userDAL.prototype.getByArguments(getUserByFacebookIdQuery,facebookId,function (err,result)
                {
                    logger.log("debug","getUserByFacebookId" , result);
                    return resultMethod(err,userDAL.prototype.self.mapperSqlToModel(result));
                },connection);    
};
//Method to Select User By Username 
//*******************************************************************************************
userDAL.prototype.getUserByUsername = function(username, resultMethod,connection) {
    var getUserByUsernameQuery ="SELECT * FROM `chameleon`.`User` WHERE `IsActive` = 1 AND `Username`=?";
                userDAL.prototype.getByArguments(getUserByUsernameQuery,username,function (err,result)
                {
                    logger.log("debug","getUserByUsername" , result);
                    return resultMethod(err,userDAL.prototype.self.mapperSqlToModel(result));
                },connection);    
};


//Method to Select User By Id
//*******************************************************************************************
userDAL.prototype.getUserById = function(id, resultMethod,connection) {
    var getUserByIdQuery ="SELECT * FROM `chameleon`.`User` WHERE `IsActive` = 1 AND `UserId` =?";
                userDAL.prototype.getByArguments(getUserByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getUserById" , result);
                    return resultMethod(err,userDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};

//Method to update Password
//*******************************************************************************************
userDAL.prototype.updatePassword = function(data, resultMethod,connection) {
           var updateParameters = 
               [
                 data.password,
                  data.modificationDate,
                      data.id,
               ];
           var updateUserQuery = "UPDATE `chameleon`.`User` SET `IsActive`=0,`Password`=?,`ModificationDate`=? WHERE `UserId`=?;";
             userDAL.prototype.query(updateUserQuery,updateParameters,function (err,result)
                {
                    logger.log("debug","updatePassword",data);
                    return resultMethod(err,userDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to deactivate User
//*******************************************************************************************
userDAL.prototype.deactivateUser = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateUserQuery = "UPDATE `chameleon`.`User` SET `IsActive`=0,`ModificationDate`=? WHERE `UserId`=?;";
             userDAL.prototype.query(deactivateUserQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateUser",data);
                    return resultMethod(err,userDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to deactivate User
//*******************************************************************************************
userDAL.prototype.blockUser = function(data, resultMethod,connection) {
           var disableParameters = 
               [  
                   data.modificationDate,
                    data.id
               ];
           var blockUserQuery = "UPDATE `chameleon`.`User` SET `IsBlocked`=1,`ModificationDate`=? WHERE `UserId`=?;";
             userDAL.prototype.query(blockUserQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","blockUser",data);
                    return resultMethod(err,userDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to select all Friends
//*******************************************************************************************
userDAL.prototype.getUserFriends = function(id, resultMethod,connection) {
     var getUserFriendsQuery ="SELECT `chameleon`.`User`.*  FROM `chameleon`.`User`   INNER JOIN `chameleon`.`CustomerFriend` on `chameleon`.`User`.`UserId` = `chameleon`.`CustomerFriend`.`FriendId`  WHERE `chameleon`.`User`.`IsActive` = 1 and `chameleon`.`CustomerFriend`.`IsActive` =1  AND `chameleon`.`CustomerFriend`.`CustomerId` =?";
                userDAL.prototype.getByArguments(getUserFriendsQuery,id,function (err,result)
                {
                    logger.log("debug","getUserFriends",id , result);
                    return resultMethod(err,userDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method for transform the information from sql to model
//********************************************************************************************
userDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
        
        if(data != null && data.length >0)
        {
            data = data[0];
            var user  = new userModel();
            user.id = data.UserId;
            user.name = data.Name;
            user.lastname = data.Lastname;
            user.age = data.Age;
            user.username = data.Username;
            user.password = data.Password;
            user.email = data.Email;
            user.facebookId = data.FacebookId;
            user.pictureUrl = data.PictureUrl;
            user.isBlocked = data.IsBlocked;
            user.isCustomer = data.IsCustomer;
            user.isProvider = data.IsProvider;
            user.countryId = data.CountryId;
            user.latitude = data.Latitude;
            user.longitude = data.Longitude;
            user.creationDate = data.CreationDate;
            user.modificationDate = data.ModificationDate;
            user.isActive = data.IsActive
            data = null;
            return user;
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
userDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var userCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var user  = new userModel();
                user.id = data.UserId;
                user.name = data.Name;
                user.lastname = data.Lastname;
                user.age = data.Age;
                user.username = data.Username;
                user.email = data.Email;
                user.facebookId = data.FacebookId;
                user.pictureUrl = data.PictureUrl;
                user.isBlocked = data.IsBlocked;
                user.isCustomer = data.IsCustomer;
                user.isProvider = data.IsProvider;
                user.countryId = data.CountryId;
                user.latitude = data.Latitude;
                user.longitude = data.Longitude;
                user.creationDate = data.CreationDate;
                user.modificationDate = data.ModificationDate;
                user.isActive = data.IsActive
                data = null;
                userCollection.push(user);
            }
            return userCollection;
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
userDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id") )
    mysqlModel.UserId  = data.id;
    if(data.hasOwnProperty("name"))
    mysqlModel.Name = data.name;    
    if(data.hasOwnProperty("lastname"))
    mysqlModel.Lastname = data.lastname;
    if(data.hasOwnProperty("age"))
    mysqlModel.Age = data.age;
    if(data.hasOwnProperty("username"))
    mysqlModel.Username = data.username;
    if(data.hasOwnProperty("password"))
    mysqlModel.Password = data.password;
    if(data.hasOwnProperty("email"))
    mysqlModel.Email = data.email;
    if(data.hasOwnProperty("facebookId"))
    mysqlModel.FacebookId = data.facebookId;
    if(data.hasOwnProperty("pictureUrl"))
    mysqlModel.PictureUrl = data.pictureUrl;
    if(data.hasOwnProperty("isBlocked"))
    mysqlModel.IsBlocked = data.isBlocked;
    if(data.hasOwnProperty("isCustomer"))
    mysqlModel.IsCustomer = data.isCustomer;
    if(data.hasOwnProperty("isProvider"))
    mysqlModel.IsProvider = data.isProvider;
    if(data.hasOwnProperty("countryId"))
    mysqlModel.CountryId = data.countryId;
    if(data.hasOwnProperty("latitude"))
    mysqlModel.Latitude = data.latitude;
    if(data.hasOwnProperty("longitude"))
    mysqlModel.Longitude = data.longitude;
    if(data.hasOwnProperty("creationDate"))
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate"))
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive"))
    mysqlModel.IsActive = data.isActive;
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
module.exports =userDAL;