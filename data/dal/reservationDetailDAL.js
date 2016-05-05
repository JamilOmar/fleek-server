//*******************************************************************************************
//Name: reservationDetail DAl
//Description: Base class for connectivity with the MySql Database
//Target : reservationDetail Creation , Administration of reservationDetail
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var reservationDetailModel  = require('models/reservationDetail');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var reservationDetailDAL = function()
{
  
   reservationDetailDAL.prototype.self = this;
};
  reservationDetailDAL.prototype = new baseDAL();
//Method to Create reservationDetail
//*******************************************************************************************
reservationDetailDAL.prototype.createReservationDetail = function(data, resultMethod,connection) {
    data = reservationDetailDAL.prototype.self.mapperModelToSql(data); 
            var createReservationDetailQuery = "INSERT INTO `chameleon`.`ReservationDetail` SET ?;";
             reservationDetailDAL.prototype.query(createReservationDetailQuery,data,function (err,result)
                {
                    logger.log("debug","createReservationDetail",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//Method to Update reservationDetails
//*******************************************************************************************
reservationDetailDAL.prototype.updateReservationDetail  = function(data,id, resultMethod,connection) {
     data = reservationDetailDAL.prototype.self.mapperModelToSql(data); 
            var updateReservationDetailQuery = "UPDATE `chameleon`.`ReservationDetail` SET ? WHERE ?;";
             reservationDetailDAL.prototype.queryWithArgument(updateReservationDetailQuery,data,{ReservationDetailId:id},function (err,result)
                {
                    logger.log("debug","updateReservationDetail",data);
                    return resultMethod(err,result);
                },connection);
        };


//Method to Select reservationDetail By Id
//*******************************************************************************************
reservationDetailDAL.prototype.getReservationDetailById = function(id, resultMethod,connection) {
    var getReservationDetailByIdQuery ="SELECT reservationDetail.`ReservationDetailId` , reservationDetail.`ReservationId` , reservationDetail.`RequestInfo` , reservationDetail.`Duration` , reservationDetail.`ServiceId`, reservationDetail.`CreationDate` , reservationDetail.`ModificationDate` ,reservationDetail.`IsActive`  FROM `chameleon`.`ReservationDetail` reservationDetail  INNER JOIN `Reservation` reservation ON reservation.`ReservationId` = reservationDetail.`ReservationId` INNER JOIN `Service` service ON service.`ServiceId` = reservationDetail.`ServiceId` WHERE reservation.`IsActive` = 1 AND reservationDetail.`IsActive` = 1 AND service.`IsActive` =1 AND reservationDetail.`ReservationDetailId` =?";
                reservationDetailDAL.prototype.getByArguments(getReservationDetailByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationDetailById" , result);
                    return resultMethod(err,reservationDetailDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};
//Method to Select reservationDetail By Reservation Id
//*******************************************************************************************
reservationDetailDAL.prototype.getReservationDetailByReservationId = function(id, resultMethod,connection) {
    var getReservationDetailByReservationIdQuery ="SELECT reservationDetail.`ReservationDetailId` , reservationDetail.`ReservationId` , reservationDetail.`RequestInfo` , reservationDetail.`Duration` , reservationDetail.`ServiceId`, reservationDetail.`CreationDate` , reservationDetail.`ModificationDate` ,reservationDetail.`IsActive`  FROM `chameleon`.`ReservationDetail` reservationDetail  INNER JOIN `Reservation` reservation ON reservation.`ReservationId` = reservationDetail.`ReservationId` INNER JOIN `Service` service ON service.`ServiceId` = reservationDetail.`ServiceId` WHERE reservation.`IsActive` = 1 AND reservationDetail.`IsActive` = 1 AND service.`IsActive` =1 AND reservationDetail.`ReservationId` =?";
                reservationDetailDAL.prototype.getByArguments(getReservationDetailByReservationIdQuery,id,function (err,result)
                {
                    logger.log("debug","getReservationDetailByReservationId" , result);
                    return resultMethod(err,reservationDetailDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};

//Method to cancel reservationDetail by Reservation Id
//*******************************************************************************************
reservationDetailDAL.prototype.cancelReservationDetailByReservationId = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 data.modificationDate,
                 data.CustomerReservationId,
                      
               ];
           var deactivatereservationDetailQuery = "UPDATE `chameleon`.`ReservationDetail` SET `IsCanceled`=1,`ModificationDate`=? WHERE `CustomerReservationId`=?;";
             reservationDetailDAL.prototype.query(deactivatereservationDetailQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","cancelReservationDetailByReservationId",data);
                    return resultMethod(err,reservationDetailDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to deactivate reservationDetail
//*******************************************************************************************
reservationDetailDAL.prototype.deactivateReservationDetail = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateReservationDetailQuery = "UPDATE `chameleon`.`reservationDetail` SET `IsActive`=0,`ModificationDate`=? WHERE `ReservationDetailId`=?;";
             reservationDetailDAL.prototype.query(deactivateReservationDetailQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateReservationDetail",data);
                    return resultMethod(err,reservationDetailDAL.prototype.nonQueryResult(result));
                },connection);
};

//Method for transform the information from sql to model
//********************************************************************************************
reservationDetailDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
     
        if(data != null && data[0] !=null )
        {
            data = data[0];
           var reservationDetail  = new reservationDetailModel();
           reservationDetail.id = data.ReservationDetailId;
           reservationDetail.reservationId = data.ReservationId;
           reservationDetail.serviceId = data.ServiceId;
           reservationDetail.requestInfo = data.RequestInfo; 
           reservationDetail.duration = data.Duration;
           reservationDetail.creationDate = data.CreationDate;
           reservationDetail.modificationDate = data.ModificationDate;
           reservationDetail.isActive = data.IsActive
           data = null;
            return reservationDetail;
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


reservationDetailDAL.prototype.mapperSqlToModelCollection = function(data)
{
    try
    {
        
        if(data != null)
        {
            var reservationDetailCollection = [];
            for (var i = 0 ; i < data.length ; i++)
            {
                data = data[i];
           var reservationDetail  = new reservationDetailModel();
           reservationDetail.id = data.ReservationDetailId;
           reservationDetail.reservationId = data.ReservationId;
           reservationDetail.serviceId = data.ServiceId;
           reservationDetail.requestInfo = data.RequestInfo; 
           reservationDetail.duration = data.Duration;
           reservationDetail.creationDate = data.CreationDate;
           reservationDetail.modificationDate = data.ModificationDate;
           reservationDetail.isActive = data.IsActive
           data = null;
           reservationDetailCollection.push(reservationDetail);
            }
            return reservationDetailCollection;
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
reservationDetailDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);

      var mysqlModel  ={};
     if(data.hasOwnProperty("id")&& data.id != undefined)
    mysqlModel.ReservationDetailId  = data.id;
    if(data.hasOwnProperty("reservationId")&& data.reservationId != undefined)
    mysqlModel.ReservationId = data.reservationId;
    if(data.hasOwnProperty("serviceId")&& data.serviceId != undefined)
    mysqlModel.ServiceId = data.serviceId;
    if(data.hasOwnProperty("requestInfo")&& data.requestInfo != undefined)
    mysqlModel.RequestInfo = data.requestInfo;
    if(data.hasOwnProperty("duration")&& data.duration != undefined)
    mysqlModel.Duration = data.duration;

    if(data.hasOwnProperty("creationDate")&& data.creationDate != undefined)
    mysqlModel.CreationDate = data.creationDate;
    if(data.hasOwnProperty("modificationDate")&& data.modificationDate != undefined)
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
module.exports = reservationDetailDAL;