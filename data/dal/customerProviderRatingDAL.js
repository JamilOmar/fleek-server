//*******************************************************************************************
//Name: User Friend DAl
//Description: Base class for connectivity with the MySql Database
//Target : Administration of  Customer's Provider Rating
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var customerProviderRatingModel  = require('models/customerProviderRating');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var customerProviderRatingDAL = function()
{
  
   customerProviderRatingDAL.prototype.self = this;
};
  customerProviderRatingDAL.prototype =  new baseDAL();



//get customer provider rating by provider and customer Id
//*******************************************************************************************
customerProviderRatingDAL.prototype.getCustomerProviderRatingByProviderAndCustomerId = function(providerId,customerId ,resultMethod,connection) {
        var getParameters = 
               [
                  providerId,enterpriseId
               ];
    var getCustomerProviderRatingByProviderAndCustomerIdQuery ="SELECT * FROM `chameleon`.`CustomerProviderRating` WHERE  `IsActive` = 1 AND `ProviderId` =? AND `CustomerId` =?";
                customerProviderRatingDAL.prototype.getByArguments(getCustomerProviderRatingByProviderAndCustomerIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getCustomerProviderRatingByProviderAndCustomerId" , result);
                    return resultMethod(err,customerProviderRatingDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to Select the customer provider rating by id
//*******************************************************************************************
customerProviderRatingDAL.prototype.getCustomerProviderRatingById = function(id,resultMethod,connection) {
        var getParameters = 
               [
                  id
               ];
    var getCustomerProviderRatingByIdQuery ="SELECT * FROM `chameleon`.`CustomerProviderRating` WHERE  `IsActive` = 1 AND  `CustomerProviderRatingId` =?";
                customerProviderRatingDAL.prototype.getByArguments(getCustomerProviderRatingByIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getCustomerProviderRatingByIdQuery" , result);
                    return resultMethod(err,customerProviderRatingDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//get all the ratings of a provider
//*******************************************************************************************
customerProviderRatingDAL.prototype.getCustomerProviderRatingByProviderId = function(providerId,resultMethod,connection) {
        var getParameters = 
               [
                  providerId
               ];
    var getCustomerProviderRatingByProviderIdQuery ="SELECT * FROM `chameleon`.`CustomerProviderRating` WHERE  `IsActive` = 1 AND `ProviderId` = ?";
                customerProviderRatingDAL.prototype.getByArguments(getCustomerProviderRatingByProviderIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getCustomerProviderRatingByProviderId" , result);
                    return resultMethod(err,customerProviderRatingDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//get ratings of a customer reservation
//*******************************************************************************************
customerProviderRatingDAL.prototype.getCustomerProviderRatingByCustomerReservationId = function(customeReservationId,resultMethod,connection) {
        var getParameters = 
               [
                  customeReservationId
               ];
    var getCustomerProviderRatingByCustomerReservationIdQuery ="SELECT * FROM `chameleon`.`CustomerProviderRating` WHERE  `IsActive` = 1 AND `CustomerReservationId` = ?";
                customerProviderRatingDAL.prototype.getByArguments(getCustomerProviderRatingByCustomerReservationIdQuery,getParameters,function (err,result)
                {
                    logger.log("debug","getCustomerProviderRatingByCustomerReservationId" , result);
                    return resultMethod(err,customerProviderRatingDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to match enterprises and providers
//*******************************************************************************************
customerProviderRatingDAL.prototype.addCustomerProviderRating = function(data, resultMethod,connection) {
     data = customerProviderRatingDAL.prototype.self.mapperModelToSql(data);
      var addCustomerProviderRatingQuery = "INSERT INTO `chameleon`.`CustomerProviderRating` SET ?;";
             customerProviderRatingDAL.prototype.query(addCustomerProviderRatingQuery,data,function (err,result)
                {
                    logger.log("debug","addCustomerProviderRating",data);
                    return resultMethod(err,customerProviderRatingDAL.prototype.nonQueryResult(result));
                },connection);
};
//deactivate
//*******************************************************************************************
customerProviderRatingDAL.prototype.deactivateCustomerProviderRating = function(data, resultMethod,connection) {
     var disableParameters = 
               [
                   data.modificationDate, data.id
               ];
      var deactivateCustomerProviderRatingQuery = "UPDATE `chameleon`.`CustomerProviderRating` SET `ModificationDate`=?,`IsActive`=0 WHERE `CustomerProviderRatingId`=?;";
             customerProviderRatingDAL.prototype.query(deactivateCustomerProviderRatingQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateCustomerProviderRating",data);
                    return resultMethod(err,customerProviderRatingDAL.prototype.nonQueryResult(result));
                },connection);
};


//Method for transform the information from sql to model
//********************************************************************************************
customerProviderRatingDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
       if(data != null)
        {
            data = data[0];
            var customerProviderRating  = new customerProviderRatingModel();
            customerProviderRating.id = data.id;
            customerProviderRating.providerId = data.CustomerProviderRatingId;
            customerProviderRating.customerId = data.CustomerId;
            customerProviderRating.customeReservationId = data.CustomeReservationId;
            customerProviderRating.description = data.Description;
            customerProviderRating.rating = data.Rating;
            customerProviderRating.date = data.Date;
            customerProviderRating.creationDate = data.CreationDate;
            customerProviderRating.modificationDate = data.ModificationDate;
            customerProviderRating.isActive = data.IsActive
            return customerProviderRating;
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


    customerProviderRatingDAL.prototype.mapperSqlToModelCollection = function(data)
{
    try
    {
        
        if(data != null)
        {
            var customerProviderRatingCollection = [];
            for (var i = 0 ; i < data.length ; i++)
            {
            data = data[i];
            var customerProviderRating  = new customerProviderRatingModel();
            customerProviderRating.id = data.CustomerProviderRatingId;
            customerProviderRating.providerId = data.Provider;
            customerProviderRating.customerId = data.CustomerId;
            customerProviderRating.customeReservationId = data.CustomeReservationId;
            customerProviderRating.description = data.Description;
            customerProviderRating.rating = data.Rating;
            customerProviderRating.date = data.Date;
            customerProviderRating.creationDate = data.CreationDate;
            customerProviderRating.modificationDate = data.ModificationDate;
            customerProviderRating.isActive = data.IsActive
            customerProviderRatingCollection.push(customerProviderRating);
            }
            return customerProviderRatingCollection;
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
customerProviderRatingDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={
    CustomerProviderRatingId : data.id,    
    ProviderId  : data.providerId,
    CustomerId : data.customerId,
    CustomerReservationId : data.customerReservationId,
    Description : data.description,
    Rating : data.rating,
    Date : data.date,
    CreationDate : data.creationDate,
    ModificationDate : data.modificationDate,
    IsActive : data.isActive
    };
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
module.exports =  customerProviderRatingDAL;