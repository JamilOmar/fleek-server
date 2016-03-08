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
var userModel  = require('models/user');
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
    var getReservationByIdQuery ="SELECT  reservation.`ReservationId` ,reservation.`ProviderScheduleId`,  reservation.`Address` , reservation.`CancelationReason` , reservation.`Date` , reservation.`EndTime` , reservation.`StartTime`, reservation.`Latitude` , reservation.`Longitude`, reservation.`State` , reservation.`CreationDate` , reservation.`ModificationDate` , reservation.`IsActive` ,customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl',provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl'  FROM `Reservation` reservation INNER JOIN `User` customer ON customer.`UserId` = reservation.`CustomerId` INNER JOIN `User` provider ON provider.`UserId` = reservation.`ProviderId` WHERE  reservation.`IsActive` = 1 AND customer.`IsActive` =1 AND provider.`IsActive` = 1 AND provider.`IsBlocked` = 0 and customer.`IsBlocked` = 0 and reservation.`ReservationId` =?";
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
    var getReservationByCustomerIdQuery ="SELECT  reservation.`ReservationId` ,reservation.`ProviderScheduleId`,  reservation.`Address` , reservation.`CancelationReason` , reservation.`Date` , reservation.`EndTime` , reservation.`StartTime`, reservation.`Latitude` , reservation.`Longitude`, reservation.`State` , reservation.`CreationDate` , reservation.`ModificationDate` , reservation.`IsActive` ,customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl',provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl'  FROM `Reservation` reservation INNER JOIN `User` customer ON customer.`UserId` = reservation.`CustomerId` INNER JOIN `User` provider ON provider.`UserId` = reservation.`ProviderId` WHERE  reservation.`IsActive` = 1 AND customer.`IsActive` =1 AND provider.`IsActive` = 1 AND provider.`IsBlocked` = 0 and customer.`IsBlocked` = 0 and reservation.`CustomerId` =?";
                reservationDAL.prototype.getByArguments(getReservationByCustomerIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationByCustomerId",id , result);
                    return resultMethod(err,reservationDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method to select the Reservation by Provider Id
//*******************************************************************************************
reservationDAL.prototype.getReservationByProviderId = function(id, resultMethod,connection) {
    var getReservationByProviderIdQuery ="SELECT  reservation.`ReservationId` ,reservation.`ProviderScheduleId`,  reservation.`Address` , reservation.`CancelationReason` , reservation.`Date` , reservation.`EndTime` , reservation.`StartTime`, reservation.`Latitude` , reservation.`Longitude`, reservation.`State` , reservation.`CreationDate` , reservation.`ModificationDate` , reservation.`IsActive` ,customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl',provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl'  FROM `Reservation` reservation INNER JOIN `User` customer ON customer.`UserId` = reservation.`CustomerId` INNER JOIN `User` provider ON provider.`UserId` = reservation.`ProviderId` WHERE  reservation.`IsActive` = 1 AND customer.`IsActive` =1 AND provider.`IsActive` = 1 AND provider.`IsBlocked` = 0 AND customer.`IsBlocked` = 0 AND reservation.`ProviderId` =?";
                reservationDAL.prototype.getByArguments(getReservationByProviderIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationByProviderId",id , result);
                    return resultMethod(err,reservationDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};
//Method to Select providerScheduleException By Schedule Id, Provider , Year  And Month 
//*******************************************************************************************
reservationDAL.prototype.getReservationByProviderScheduleIdYearMonthDay= function(id,year,month,day, resultMethod,connection) {
    var getReservationByProviderScheduleIdYearMonthDayQuery ="SELECT  reservation.`ReservationId` ,reservation.`ProviderScheduleId`,  reservation.`Address` , reservation.`CancelationReason` , reservation.`Date` , reservation.`EndTime` , reservation.`StartTime`, reservation.`Latitude` , reservation.`Longitude`, reservation.`State` , reservation.`CreationDate` , reservation.`ModificationDate` , reservation.`IsActive` ,customer.`UserId` as 'customer_UserId', customer.`Name` as 'customer_Name', customer.`Lastname` as 'customer_Lastname', customer.`Username` as 'customer_Username' , customer.`PictureUrl` as 'customer_PictureUrl',provider.`UserId` as 'provider_UserId', provider.`Name` as 'provider_Name', provider.`Lastname` as 'provider_Lastname', provider.`Username` as 'provider_Username' , provider.`PictureUrl` as 'provider_PictureUrl'  FROM `Reservation` reservation INNER JOIN `User` customer ON customer.`UserId` = reservation.`CustomerId` INNER JOIN `User` provider ON provider.`UserId` = reservation.`ProviderId` WHERE  reservation.`IsActive` = 1 AND customer.`IsActive` =1 AND provider.`IsActive` = 1 AND provider.`IsBlocked` = 0 and customer.`IsBlocked` = 0 AND reservation.`ProviderScheduleId` =? AND YEAR(reservation.`Date`) = ? AND MONTH(reservation.`Date`) = ? AND DAY(reservation.`Date`) = ?";
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
           Reservation.customerId = data.customer_UserId;
           Reservation.providerId = data.provider_UserId;
           Reservation.provider = new userModel();
           Reservation.provider.basicInformation(data.provider_UserId ,data.provider_Name, data.provider_Lastname , data.provider_Username , data.provider_PictureUrl);
           Reservation.customer = new userModel();
           Reservation.customer.basicInformation(data.customer_UserId ,data.customer_Name, data.customer_Lastname , data.customer_Username , data.customer_PictureUrl);

           Reservation.providerScheduleId = data.ProviderScheduleId;
           Reservation.latitude = data.Latitude; 
           Reservation.longitude = data.Longitude;
           Reservation.address = data.Address;
           Reservation.cancelationReason = data.CancelationReason; 
           Reservation.date = data.Date; 
           Reservation.startTime = data.StartTime;
           Reservation.endTime = data.EndTime;
           Reservation.state = data.State;
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
           Reservation.customerId = data.customer_UserId;
           Reservation.providerId = data.provider_UserId;
           Reservation.provider = new userModel();
           Reservation.provider.basicInformation(data.provider_UserId ,data.provider_Name, data.provider_Lastname , data.provider_Username , data.provider_PictureUrl);
           Reservation.customer = new userModel();
           Reservation.customer.basicInformation(data.customer_UserId ,data.customer_Name, data.customer_Lastname , data.customer_Username , data.customer_PictureUrl);
           Reservation.providerScheduleId = data.ProviderScheduleId;
           Reservation.latitude = data.Latitude; 
           Reservation.longitude = data.Longitude;
           Reservation.address = data.Address;
           Reservation.cancelationReason = data.CancelationReason;
           Reservation.date = data.Date;  
           Reservation.startTime = data.StartTime;
           Reservation.endTime = data.EndTime;
           Reservation.state = data.State;
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
     if(data.hasOwnProperty("id")&& data.id != undefined)
    mysqlModel.ReservationId  = data.id;
     if(data.hasOwnProperty("customerId") && data.customerId != undefined)
    mysqlModel.CustomerId = data.customerId;
     if(data.hasOwnProperty("providerId") && data.providerId != undefined)
    mysqlModel.ProviderId = data.providerId;
     if(data.hasOwnProperty("providerScheduleId") && data.providerScheduleId != undefined)
    mysqlModel.ProviderScheduleId = data.providerScheduleId;
     if(data.hasOwnProperty("latitude") && data.latitude != undefined)
    mysqlModel.Latitude = data.latitude;
     if(data.hasOwnProperty("longitude") && data.longitude != undefined)
    mysqlModel.Longitude = data.longitude;
     if(data.hasOwnProperty("address") && data.address != undefined)
    mysqlModel.Address = data.address;
     if(data.hasOwnProperty("cancelationReason") && data.cancelationReason != undefined)
    mysqlModel.CancelationReason = data.cancelationReason;
     if(data.hasOwnProperty("date") && data.date != undefined)
    mysqlModel.Date = data.date;
     if(data.hasOwnProperty("startTime") && data.startTime != undefined)
    mysqlModel.StartTime = data.startTime;
     if(data.hasOwnProperty("endTime") && data.endTime != undefined)
    mysqlModel.EndTime = data.endTime;
     if(data.hasOwnProperty("state") && data.state != undefined)
    mysqlModel.State = data.state;
     if(data.hasOwnProperty("creationDate")&& data.creationDate != undefined)
    mysqlModel.CreationDate = data.creationDate;
     if(data.hasOwnProperty("modificationDate") && data.modificationDate != undefined)
    mysqlModel.ModificationDate = data.modificationDate;
     if(data.hasOwnProperty("isActive")&& data.isActive != undefined)
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