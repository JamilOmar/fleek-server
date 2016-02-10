//*******************************************************************************************
//Name: Reservation DAl
//Description: Base class for connectivity with the MySql Database
//Target : Reservation Creation , Administration of Reservation
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var reservationModel  = require('models/reservation');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var reservationDAL = function()
{
  
   reservationDAL.prototype.self = this;
};
  reservationDAL.prototype =  new baseDAL();
//Method to Create Reservation
//*******************************************************************************************
reservationDAL.prototype.createReservation = function(data, resultMethod,connection) {
    data = reservationDAL.prototype.self.mapperModelToSql(data); 
            var createReservationQuery = "INSERT INTO `chameleon`.`Reservation` SET ?;";
             reservationDAL.prototype.query(createReservationQuery,data,function (err,result)
                {
                    logger.log("debug","createReservation",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//Method to Update Reservations
//*******************************************************************************************
reservationDAL.prototype.updateReservation  = function(data,id, resultMethod,connection) {
     data = reservationDAL.prototype.self.mapperModelToSql(data); 
            var updateReservationQuery = "UPDATE `chameleon`.`Reservation` SET ? WHERE ?;";
    console.log(reservationDAL);
             reservationDAL.prototype.queryWithArgument(updateReservationQuery,data,{ReservationId:id},function (err,result)
                {
                    logger.log("debug","updateReservation",data);
                    return resultMethod(err,result);
                },connection);
        };


//Method to Select Reservation By Id
//*******************************************************************************************
reservationDAL.prototype.getReservationById = function(id, resultMethod,connection) {
    var getReservationByIdQuery ="SELECT * FROM `chameleon`.`Reservation` WHERE `IsActive` = 1 AND `ReservationId` =?";
                reservationDAL.prototype.getByArguments(getReservationByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationById" , result);
                    return resultMethod(err,reservationDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to cancel Reservation
//*******************************************************************************************
reservationDAL.prototype.cancelReservation = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 data.cancelationReservation,
                 data.modificationDate,
                 data.id,
                      
               ];
           var deactivateReservationQuery = "UPDATE `chameleon`.`Reservation` SET `IsCanceled`=1,CancelationReason=?,`ModificationDate`=? WHERE `ReservationId`=?;";
             reservationDAL.prototype.query(deactivateReservationQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","cancelReservation",data);
                    return resultMethod(err,reservationDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to deactivate Reservation
//*******************************************************************************************
reservationDAL.prototype.deactivateReservation = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateReservationQuery = "UPDATE `chameleon`.`Reservation` SET `IsActive`=0,`ModificationDate`=? WHERE `ReservationId`=?;";
             reservationDAL.prototype.query(deactivateReservationQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateReservation",data);
                    return resultMethod(err,reservationDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to select the Reservation by Customer Id
//*******************************************************************************************
reservationDAL.prototype.getReservationByCustomerId = function(id, resultMethod,connection) {
    var getReservationByCustomerIdQuery ="SELECT * FROM `chameleon`.`Reservation` r INNER JOIN `User` u on u.`UserId` = r.`CustomerId` WHERE  u.`IsActive` = 1 and u.`UserId` =? and r.`IsActive` =1";
                reservationDAL.prototype.getByArguments(getReservationByCustomerIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationByCustomerId",id , result);
                    return resultMethod(err,reservationDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method to select the Reservation by Provider Id
//*******************************************************************************************
reservationDAL.prototype.getReservationByProviderId = function(id, resultMethod,connection) {
    var getReservationByProviderIdQuery ="SELECT r.* FROM `chameleon`.`Reservation` r INNER JOIN `User` u on u.`UserId` = r.`ProviderId` WHERE  u.`IsActive` = 1 and u.`UserId` =? and r.`IsActive` =1";
                reservationDAL.prototype.getByArguments(getReservationByProviderIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationByProviderId",id , result);
                    return resultMethod(err,reservationDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method to Select providerScheduleException By Schedule Id, Provider , Year  And Month 
//*******************************************************************************************
reservationDAL.prototype.getReservationByProviderScheduleIdYearMonthDay= function(id,year,month,day, resultMethod,connection) {
    var getReservationByProviderScheduleIdYearMonthDayQuery ="SELECT r.* FROM `chameleon`.`Reservation` r INNER JOIN `ProviderSchedule` ps ON ps.`ProviderScheduleId` = r.`ProviderScheduleId` INNER JOIN `User` u on u.`UserId` = r.`ProviderId`  WHERE r.`ProviderScheduleId` =?   AND YEAR(r.`Date`) = ? AND MONTH(r.`Date`) = ? AND DAY(r.`Date`) = ?  AND r.`IsActive` = 1  AND ps.`IsActive` =1 AND u.`IsActive` =1";
                reservationDAL.prototype.getByArguments(getReservationByProviderScheduleIdYearMonthDayQuery,[id,year,month,day],function (err,result)
                {
                    logger.log("debug","getReservationByProviderScheduleIdYearMonthDay" , result);
                    return resultMethod(err,reservationDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method for transform the information from sql to model
//********************************************************************************************
reservationDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
    
        if(data != null && data.length >0)
        {
            data = data[0];
           var Reservation  = new reservationModel();
           Reservation.id = data.ReservationId;
           Reservation.customerId = data.CustomerId;
           Reservation.providerId = data.ProviderId;
           Reservation.providerScheduleId = data.ProviderScheduleId;
           Reservation.latitude = data.Latitude; 
           Reservation.longitude = data.longitude;
           Reservation.address = data.Address;
           Reservation.cancelationReason = data.CancelationReason; 
           Reservation.date = data.Date; 
           Reservation.startTime = data.StartTime;
           Reservation.endTime = data.EndTime;
           Reservation.isCanceled = data.IsCanceled;
           Reservation.creationDate = data.CreationDate;
           Reservation.modificationDate = data.ModificationDate;
           Reservation.isActive = data.IsActive
           data = null;
            return Reservation;
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


reservationDAL.prototype.mapperSqlToModelCollection = function(dataRequested)
{
    try
    {
        
        if(dataRequested != null)
        {
            var ReservationCollection = [];
            for (var i = 0 ; i < dataRequested.length ; i++)
            {
           var data = dataRequested[i];
           var Reservation  = new reservationModel();
           Reservation.id = data.ReservationId;
           Reservation.customerId = data.CustomerId;
           Reservation.providerId = data.ProviderId;
           Reservation.providerScheduleId = data.ProviderScheduleId;
           Reservation.latitude = data.Latitude; 
           Reservation.longitude = data.longitude;
           Reservation.address = data.Address;
           Reservation.cancelationReason = data.CancelationReason;
           Reservation.date = data.Date;  
           Reservation.startTime = data.StartTime;
           Reservation.endTime = data.EndTime;
           Reservation.isCanceled = data.IsCanceled;
           Reservation.creationDate = data.CreationDate;
           Reservation.modificationDate = data.ModificationDate;
           Reservation.isActive = data.IsActive
           data = null;
           ReservationCollection.push(Reservation);
           
              
            }
            return ReservationCollection;
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
reservationDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={};
     if(data.hasOwnProperty("id"))
    mysqlModel.ReservationId  = data.id;
     if(data.hasOwnProperty("customerId"))
    mysqlModel.CustomerId = data.customerId;
     if(data.hasOwnProperty("providerId"))
    mysqlModel.ProviderId = data.providerId;
     if(data.hasOwnProperty("providerScheduleId"))
    mysqlModel.ProviderScheduleId = data.providerScheduleId;
     if(data.hasOwnProperty("latitude"))
    mysqlModel.Latitude = data.latitude;
     if(data.hasOwnProperty("longitude"))
    mysqlModel.Longitude = data.longitude;
     if(data.hasOwnProperty("address"))
    mysqlModel.Address = data.address;
     if(data.hasOwnProperty("cancelationReason"))
    mysqlModel.CancelationReason = data.cancelationReason;
     if(data.hasOwnProperty("date"))
    mysqlModel.Date = data.date;
     if(data.hasOwnProperty("startTime"))
    mysqlModel.StartTime = data.startTime;
     if(data.hasOwnProperty("endTime"))
    mysqlModel.EndTime = data.endTime;
     if(data.hasOwnProperty("isCanceled"))
    mysqlModel.IsCanceled = data.isCanceled;
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
module.exports =  reservationDAL;