//*******************************************************************************************
//Name: User Friend DAl
//Description: Base class for connectivity with the MySql Database
//Target : Administration of  Customer's Provider Rating
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();
var baseDAL = require('./baseDAL');
var userRatingModel = require('models/userRating');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var userRatingDAL = function () {

    userRatingDAL.prototype.self = this;
};
userRatingDAL.prototype = new baseDAL();




//get rating by Reservation , To and From user
//*******************************************************************************************
userRatingDAL.prototype.getUserRatingByReservationIdToUserIdFromUserId = function (reservationId, toUserId, fromUserId, resultMethod, connection) {
    var getParameters = [
                  reservationId, toUserId, fromUserId
               ];
    var getUserRatingByReservationIdToUserIdFromUserIdQuery = "SELECT userRating.`UserRatingId` , userRating.`FromUserId` , userRating.`ToUserId`  , userRating.`ReservationId` , userRating.`Rating` ,userRating.`Description`, userRating.`IsForProvider` , userRating.`CreationDate` , userRating.`ModificationDate` , userRating.`IsActive` FROM `UserRating` userRating WHERE userRating.`IsActive` = 1 AND userRating.`ReservationId` = ? AND userRating.`ToUserId` = ? AND userRating.`FromUserId` = ? ";
    userRatingDAL.prototype.getByArguments(getUserRatingByReservationIdToUserIdFromUserIdQuery, getParameters, function (err, result) {
        logger.log("debug", "getUserRatingByReservationIdToUserIdFromUserId", result);
        return resultMethod(err, userRatingDAL.prototype.self.mapperSqlToModel(result));
    }, connection);
};
//Method to add User Rating
//*******************************************************************************************
userRatingDAL.prototype.addUserRating = function (data, resultMethod, connection) {
    data = userRatingDAL.prototype.self.mapperModelToSql(data);
    var addUserRatingQuery = "INSERT INTO `chameleon`.`UserRating` SET ?;";
    userRatingDAL.prototype.query(addUserRatingQuery, data, function (err, result) {
        logger.log("debug", "addUserRating", data);
        return resultMethod(err, userRatingDAL.prototype.nonQueryResult(result));
    }, connection);
};


//Method for transform the information from sql to model
//********************************************************************************************
userRatingDAL.prototype.mapperSqlToModel = function (data) {
        try {
            if (data != null && data.length > 0) {
                data = data[0];
                var userRating = new userRatingModel();
                userRating.id = data.UserRatingId;
                userRating.fromUserId = data.FromUserId;
                userRating.toUserId = data.ToUserId;
                userRating.reservationId = data.reservationId;
                userRating.description = data.Description;
                userRating.rating = data.Rating;
                userRating.IsForProvider = data.isForProvider;
                userRating.creationDate = data.CreationDate;
                userRating.modificationDate = data.ModificationDate;
                userRating.isActive = data.IsActive
                return userRating;
            } else {
                return {};
            }

        } catch (err) {
            logger.log("error", "mapperSqlToModel", err);
            return null;
        }



    }
    //Method for transform the information from sql to  a model Collection
    //********************************************************************************************


userRatingDAL.prototype.mapperSqlToModelCollection = function (data) {
        try {

            if (data != null) {
                var userRatingCollection = [];
                for (var i = 0; i < data.length; i++) {
                    data = data[i];
                    var userRating = new userRatingModel();
                    userRating.id = data.UserRatingId;
                    userRating.fromUserId = data.FromUserId;
                    userRating.toUserId = data.ToUserId;
                    userRating.reservationId = data.reservationId;
                    userRating.description = data.Description;
                    userRating.rating = data.Rating;
                    userRating.IsForProvider = data.isForProvider;
                    userRating.creationDate = data.CreationDate;
                    userRating.modificationDate = data.ModificationDate;
                    userRating.isActive = data.IsActive
                    userRatingCollection.push(userRating);
                }
                return userRatingCollection;
            } else {
                return {};
            }

        } catch (err) {
            logger.log("error", "mapperSqlToModel", err);
            return null;
        }



    }
    //Method for transform the information from model to sql
    //********************************************************************************************
userRatingDAL.prototype.mapperModelToSql = function (data) {
    try {
        logger.log("debug", "mapperModelToSql before", data);
        var mysqlModel = {};
        if (data.hasOwnProperty("id") && data.id !== undefined)
            mysqlModel.UserRatingId = data.id;
        if (data.hasOwnProperty("fromUserId") && data.fromUserId !== undefined)
            mysqlModel.FromUserId = data.fromUserId;
        if (data.hasOwnProperty("toUserId") && data.toUserId !== undefined)
            mysqlModel.ToUserId = data.toUserId;
        if (data.hasOwnProperty("reservationId") && data.reservationId !== undefined)
            mysqlModel.ReservationId = data.reservationId;
        if (data.hasOwnProperty("description") && data.description !== undefined)
            mysqlModel.Description = data.description;
        if (data.hasOwnProperty("rating") && data.rating !== undefined)
            mysqlModel.Rating = data.rating;
        if (data.hasOwnProperty("isForProvider") && data.isForProvider !== undefined)
            mysqlModel.IsForProvider = data.isForProvider;
        if (data.hasOwnProperty("creationDate") && data.creationDate !== undefined)
            mysqlModel.CreationDate = data.creationDate;
        if (data.hasOwnProperty("modificationDate") && data.modificationDate !== undefined)
            mysqlModel.ModificationDate = data.modificationDate;
        if (data.hasOwnProperty("isActive") && data.isActive !== undefined)
            mysqlModel.IsActive = data.isActive;

        logger.log("debug", "mapperModelToSql", mysqlModel);
        return mysqlModel;
    } catch (err) {
        logger.log("error", "mapperModelToSql", err);
        return null;
    }

}

//********************************************************************************************
module.exports = userRatingDAL;