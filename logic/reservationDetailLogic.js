//*******************************************************************************************
//Name: Reservation Detail Logic
//Description: Reservation Detail  logic class
//Target : Reservation Creation , Administration of Reservations Details
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var mod_vasync  = require("vasync");
var reservationDetailDAL = require('data/dal/reservationDetailDAL');
var logger = require('utilities/logger');
var uuid = require('node-uuid');
var moment = require('moment');
var validator = require('validator');
require('utilities/validatorManager/validatorExtender')(validator);
var validatorManager = require('utilities/validatorManager/validatorManager');
//*******************************************************************************************
//constants
var constants = require('global/constants');
//*****************************************************

var reservationDetailLogic = function()
{
  
   reservationDetailLogic.prototype.self = this;
};
//*******************************************************************************************
//
//Validation for Provider Schedule
//
//*******************************************************************************************
reservationDetailLogic.prototype.validate = function (reservation, callback) {
var validatorM = new validatorManager();   
            
        
         
            if(  validator.isNullOrUndefined( reservation.serviceId )) {
                validatorM.addException("ServiceId is invalid.");
           }
              if(  validator.isNullOrUndefined( reservation.duration )) {
                validatorM.addException("Duration is invalid.");
           }
         
                    if (validatorM.isValid()) {
        validatorM = null;
        return callback(null, true);
    } else {
        var message = validatorM.GenerateErrorMessage();
        validatorM = null;
        return callback({
            name: "Error in Reservation Detail Validation",
            message: message
        }, false);
    }}
//validation of the required fields for the reservation detail and reservation creation
//*******************************************************************************************
reservationDetailLogic.prototype.validateTime = function(reservationDetailList) { 
   var totalTime = 0    ;
   if( reservationDetailList.length >0)
   {
      for (var i = 0 ; i < reservationDetailList.length ; i++)
      {
        var durationReservationDetail =  moment(reservationDetailList[i].duration ,'HH:mm:ss');
    
    
        //check if they are valid dates and if the endtime is bigger than the start time , and at          
        if( durationReservationDetail.isValid())
        {
            totalTime +=   moment.duration( durationReservationDetail).asMinutes();
            durationReservationDetail = null;
    
        }
        else
        {
      
            durationReservationDetail = null;
            return {totalTime:0  ,reservationDetailList:null};
        }
    }
    return {totalTime:totalTime , reservationDetailList:reservationDetailList };
   }
    return {totalTime:0 , reservationDetailList: null};
}

//Method to Create an entry to the reservation
//NOTE:this method have a connection because is called from other method with a transaction
//*******************************************************************************************
reservationDetailLogic.prototype.createReservationDetail = function(reservationDetail,reservationId,  resultMethod,connection) {
try
{
                var reservationDetailData = new reservationDetailDAL();

                //mod_vasync , waterfall for better order
                mod_vasync.waterfall([
                 //validate
                        //*******************************************************************************************
                        function validateEntity(callback) {
                            reservationDetailLogic.prototype.self.validate(reservationDetail, function(err, result) {
                                return callback(err);
                            })
                        },    
           
                 //method to prepare the data    
                function prepare(callback)
                {
                    var localDate = new Date();
                    reservationDetail.id =uuid.v4();
                    reservationDetail.reservationId = reservationId;
                    reservationDetail.modificationDate = localDate;
                    reservationDetail.creationDate = localDate;
                    reservationDetail.isActive = true;
                    callback(null);
                },    
                //method to create the reservation    
                function createReservation(callback)
                {
                    reservationDetailData.createReservationDetail(reservationDetail,function (err,result)
                    {
                        
                            logger.log("debug","save" , reservationDetail); 
                            return callback(null,result );
                    },connection);

        }
        ],
        function(err,result)
        {
               
                reservationDetailData = null;
                return  resultMethod(err,result);
        }); 
    }
    catch(err)
    {
         reservationDetailData = null;
         return resultMethod(err,null );
    }
        
};



//Method to Select reservation By Id
//*******************************************************************************************
reservationDetailLogic.prototype.getReservationById = function(id, resultMethod) {
     var reservationDetailData = new reservationDetailDAL();
        mod_vasync.waterfall([ function Get (callback){
            reservationDetailData.getReservationById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            reservationDetailData = null;
            return  resultMethod(err,result);});
};
//Method to Select reservation By Customer Id
//*******************************************************************************************
reservationDetailLogic.prototype.getReservationByCustomerId = function(id, resultMethod) {
     var reservationDetailData = new reservationDetailDAL();
        mod_vasync.waterfall([ function Get (callback){
            reservationDetailData.getReservationByCustomerId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            reservationDetailData = null;
            return  resultMethod(err,result);});
};
//Method to Select reservation By Provider Id
//*******************************************************************************************
reservationDetailLogic.prototype.getReservationByProviderId = function(id, resultMethod) {
     var reservationDetailData = new reservationDetailDAL();
        mod_vasync.waterfall([ function Get (callback){
            reservationDetailData.getReservationByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            reservationDetailData = null;
            return  resultMethod(err,result);});
};



//Method to deactivate reservation
//*******************************************************************************************
reservationDetailLogic.prototype.deactivateReservation = function(reservationDetail, resultMethod) {
    var reservationDetailData = new reservationDetailDAL();
try
{
    //create a connection for the transaction
    reservationDetailData.pool.getConnection(function(err,connection){
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
                    
                //method to prepare the data
                function prepare(callback)
                {
                    reservationDetail.modificationDate =new Date();
                    callback(null);
                },
                //Deactivate 
                function deactivate(callback)
                {
                    reservationDetailData.deactivateReservation(reservationDetail,function (err,result)
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
                                logger.log("debug","commit" , reservationDetail);
                                return callback(err,result );
                            }
                       
                        });
                  
                    },connection);

        }
       
        ],
        function(err,result)
        {
                connection.release();
                reservationDetailData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         reservationDetailData = null;
         return resultMethod(err,null );
    }
        
};



//********************************************************************************************
module.exports = reservationDetailLogic;