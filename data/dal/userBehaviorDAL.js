//*******************************************************************************************
//Name: ProviderService DAl
//Description: Base class for connectivity with the MySql Database
//Target : userBehavior Creation , Administration of userBehaviorModel
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var userBehaviorModel  = require('models/userBehavior');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var userBehaviorDAL = function()
{
  
   userBehaviorDAL.prototype.self = this;
};
  userBehaviorDAL.prototype = new  baseDAL();
//Method to Create an user Behavior
//*******************************************************************************************
userBehaviorDAL.prototype.createUserBehavior = function(data, resultMethod,connection) {
    data = userBehaviorDAL.prototype.self.mapperModelToSql(data); 
            var createUserBehaviorQuery = "INSERT INTO `chameleon`.`UserBehavior` SET ?;";
             userBehaviorDAL.prototype.query(createUserBehaviorQuery,data,function (err,result)
                {
                    logger.log("debug","createUserBehavior",result);
                    return resultMethod(err,result );
                },connection);
        };
//Method to Update an user Behavior
//*******************************************************************************************
userBehaviorDAL.prototype.updateUserBehavior  = function(data,userId, resultMethod,connection) {
     data = userBehaviorDAL.prototype.self.mapperModelToSql(data); 
   
            var updateUserBehaviorQuery = "UPDATE `chameleon`.`UserBehavior` SET ? WHERE ?;";
             userBehaviorDAL.prototype.queryWithArgument(updateUserBehaviorQuery,data,{UserId:userId},function (err,result)
                {
                    logger.log("debug","updateUserBehavior",data);
                    return resultMethod(err,result);
                },connection);
        };



//Method to deactivate an user Behavior
//*******************************************************************************************
userBehaviorDAL.prototype.deactivateUserBehavior = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.userId
               ];
           var deactivateUserBehaviorQuery = "UPDATE `chameleon`.`UserBehavior` SET `IsActive`=0,`ModificationDate`=? WHERE `ProviderId`=? AND `ServiceId`=?;";
             userBehaviorDAL.prototype.query(deactivateUserBehaviorQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateUserBehavior",data);
                    return resultMethod(err,userBehaviorDAL.prototype.nonQueryResult(result));
                },connection);
};


//Method to select the userBehavior by User Id
//*******************************************************************************************
userBehaviorDAL.prototype.getUserBehaviorByUserId = function(userID, resultMethod,connection) {
        var getUserBehaviorByUserIdQuery ="SELECT userBehavior.`UserId` , userBehavior.`Analysis` , userBehavior.`CreationDate`, UserBehavior.`ModificationDate`, UserBehavior.`IsActive`  FROM `chameleon`.`UserBehavior` userBehavior INNER JOIN chameleon.`User` user ON user.`UserId` = userBehavior.`UserId`  WHERE   userBehavior.`IsActive` = 1  AND user.`IsActive` = 1 AND user.`UserId` = ?";
                userBehaviorDAL.prototype.getByArguments(getUserBehaviorByUserIdQuery,userID,function (err,result)
                {
                    
                    logger.log("debug","getUserBehaviorByUserId",providerId , result);
                    return resultMethod(err,userBehaviorDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method for transform the information from sql to model
//********************************************************************************************
userBehaviorDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data[0] !=null )
        {
            data = data[0];
            
            
       
           var userBehavior  = new userBehaviorModel();
           userBehavior.id = data.ProviderId;
           userBehavior.analysis = data.ServiceId;
           userBehavior.creationDate = data.CreationDate;
           userBehavior.modificationDate = data.ModificationDate;
           userBehavior.isActive = data.IsActive;

           data = null;
            return userBehavior;
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
userBehaviorDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var userBehaviorCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
                var data = dataRequested[i];
                var userBehavior  = new userBehaviorModel();
                userBehavior.id = data.ProviderId;
                userBehavior.analysis = data.ServiceId;
                userBehavior.creationDate = data.CreationDate;
                userBehavior.modificationDate = data.ModificationDate;
                userBehavior.isActive = data.IsActive;
                data = null;
                userBehaviorCollection.push(userBehavior);
              
            }
            return userBehaviorCollection;
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
userBehaviorDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
    if(data.hasOwnProperty("id") && data.id !== undefined)
    mysqlModel.UserID  = data.id;
    if(data.hasOwnProperty("analysis") && data.analysis !== undefined)
    mysqlModel.Analysis = data.analysis;
    if(data.hasOwnProperty("creationDate") && data.creationDate !== undefined)
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate") && data.modificationDate !== undefined)
    mysqlModel.ModificationDate = data.modificationDate;
    if(data.hasOwnProperty("isActive")&& data.isActive !== undefined)
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
module.exports =  userBehaviorDAL;