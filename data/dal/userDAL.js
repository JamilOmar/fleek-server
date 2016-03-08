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
    var getUserByFacebookIdQuery ="SELECT usr.`UserId` , usr.`Name` , usr.`Lastname` , usr.`Age` , usr.`Username` , usr.`FacebookId` , usr.`PictureUrl` , usr.`IsBlocked` , usr.`IsProvider` , usr.`CountryId`, usr.`Latitude` , usr.`Longitude` , usr.`CreationDate` , usr.`ModificationDate` , usr.`Email` , usr.`Password` , usr.`Gender` , usr.`Gender`, usr.`Rating` , usr.`Appointments`, usr.`IsOpenForFriendship`   FROM `chameleon`.`User` usr WHERE usr.`IsActive` = 1 AND  usr.`FacebookId` =? ";
                userDAL.prototype.getByArguments(getUserByFacebookIdQuery,facebookId,function (err,result)
                {
                    logger.log("debug","getUserByFacebookId" , result);
                    return resultMethod(err,userDAL.prototype.self.mapperSqlToModel(result));
                },connection);    
};
//Method to Select User By Username 
//*******************************************************************************************
userDAL.prototype.getUserByUsername = function(username, resultMethod,connection) {
    var getUserByUsernameQuery ="SELECT usr.`UserId` , usr.`Name` , usr.`Lastname` , usr.`Age` , usr.`Username` , usr.`FacebookId` , usr.`PictureUrl` , usr.`IsBlocked` , usr.`IsProvider` , usr.`CountryId`, usr.`Latitude` , usr.`Longitude` , usr.`CreationDate` , usr.`ModificationDate` , usr.`Email` , usr.`Password` , usr.`Gender` , usr.`Gender`, usr.`Rating` , usr.`Appointments`, usr.`IsOpenForFriendship`   FROM `chameleon`.`User` usr WHERE usr.`IsActive` = 1  AND usr.`Username` =?" ;
                userDAL.prototype.getByArguments(getUserByUsernameQuery,username,function (err,result)
                {
                    logger.log("debug","getUserByUsername" , result);
                    return resultMethod(err,userDAL.prototype.self.mapperSqlToModel(result));
                },connection);    
};


//Method to Select User By Id
//*******************************************************************************************
userDAL.prototype.getUserById = function(id, resultMethod,connection) {
    var getUserByIdQuery ="SELECT usr.`UserId` , usr.`Name` , usr.`Lastname` , usr.`Age` , usr.`Username` , usr.`FacebookId` , usr.`PictureUrl` , usr.`IsBlocked` , usr.`IsProvider` , usr.`CountryId`, usr.`Latitude` , usr.`Longitude` , usr.`CreationDate` , usr.`ModificationDate` , usr.`Email` , usr.`Password` , usr.`Gender`, usr.`Rating` , usr.`Appointments`, usr.`IsOpenForFriendship`   FROM `chameleon`.`User` usr WHERE usr.`IsActive` = 1  AND usr.`UserId` =? ";
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
           var updateUserQuery = "UPDATE `chameleon`.`User` SET `Password`=?,`ModificationDate`=? WHERE `UserId`=?;";
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
//Method to activate User
//*******************************************************************************************
userDAL.prototype.unblockUser = function(data, resultMethod,connection) {
           var enableParameters = 
               [  
                   data.modificationDate,
                    data.id
               ];
           var unblockUserQuery = "UPDATE `chameleon`.`User` SET `IsBlocked`=0,`ModificationDate`=? WHERE `UserId`=?;";
             userDAL.prototype.query(unblockUserQuery,enableParameters,function (err,result)
                {
                    logger.log("debug","unblockUser",data);
                    return resultMethod(err,userDAL.prototype.nonQueryResult(result));
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
            user.isProvider = data.IsProvider;
            user.countryId = data.CountryId;
            user.latitude = data.Latitude;
            user.longitude = data.Longitude;
            user.gender = data.Gender;
            user.appointments = data.Appointments;
            user.rating = data.Rating;
            user.isOpenForFriendship = data.IsOpenForFriendship;
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
                user.isProvider = data.IsProvider;
                user.countryId = data.CountryId;
                user.latitude = data.Latitude;
                user.longitude = data.Longitude;
                user.gender = data.Gender;
                user.appointments = data.Appointments;
                user.rating = data.Rating;
                user.isOpenForFriendship = data.IsOpenForFriendship;
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
    if(data.hasOwnProperty("id")  && data.id!== undefined)
    mysqlModel.UserId  = data.id;
    if(data.hasOwnProperty("name") && data.name!== undefined)
    mysqlModel.Name = data.name;    
    if(data.hasOwnProperty("lastname") && data.lastname!== undefined)
    mysqlModel.Lastname = data.lastname;
    if(data.hasOwnProperty("age") && data.age!== undefined)
    mysqlModel.Age = data.age;
    if(data.hasOwnProperty("username") && data.username!== undefined)
    mysqlModel.Username = data.username;
    if(data.hasOwnProperty("password") && data.password!== undefined)
    mysqlModel.Password = data.password;
    if(data.hasOwnProperty("email") && data.email!== undefined)
    mysqlModel.Email = data.email;
    if(data.hasOwnProperty("facebookId") && data.facebookId!== undefined)
    mysqlModel.FacebookId = data.facebookId;
    if(data.hasOwnProperty("pictureUrl") && data.pictureUrl!== undefined)
    mysqlModel.PictureUrl = data.pictureUrl;
    if(data.hasOwnProperty("isBlocked") && data.isBlocked!== undefined)
    mysqlModel.IsBlocked = data.isBlocked;
    if(data.hasOwnProperty("isProvider")&& data.isProvider!== undefined)
    mysqlModel.IsProvider = data.isProvider;
    if(data.hasOwnProperty("countryId")&& data.countryId!== undefined)
    mysqlModel.CountryId = data.countryId;
    if(data.hasOwnProperty("latitude")&& data.latitude!== undefined)
    mysqlModel.Latitude = data.latitude;
    if(data.hasOwnProperty("longitude")&& data.longitude!== undefined)
    mysqlModel.Longitude = data.longitude;
    if(data.hasOwnProperty("creationDate")&& data.creationDate!== undefined)
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate")&& data.modificationDate!== undefined)
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive")&& data.isActive!== undefined)
    mysqlModel.IsActive = data.isActive;
     if(data.hasOwnProperty("gender")&& data.gender!== undefined)
    mysqlModel.gender = data.gender;
      if(data.hasOwnProperty("appointments")&& data.appointments!== undefined)
    mysqlModel.Appointments = data.appointments;
      if(data.hasOwnProperty("rating")&& data.rating!== undefined)
    mysqlModel.Rating = data.rating;
      if(data.hasOwnProperty("isOpenForFriendship")&& data.isOpenForFriendship!== undefined)
    mysqlModel.IsOpenForFriendship = data.isOpenForFriendship;
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