//*******************************************************************************************
//Name: Portafolio DAl
//Description: Base class for connectivity with the MySql Database
//Target : Portafolio Creation , Administration of Portafolio
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL');
var portafolioModel  = require('models/portafolio');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var portafolioDAL = function()
{
  
   portafolioDAL.prototype.self = this;
};
  portafolioDAL.prototype =  new  baseDAL();
//Method to Create Portafolio
//*******************************************************************************************
portafolioDAL.prototype.createPortafolio = function(data, resultMethod,connection) {
    data = portafolioDAL.prototype.self.mapperModelToSql(data); 
            var createPortafolioQuery = "INSERT INTO `chameleon`.`Portafolio` SET ?;";
             portafolioDAL.prototype.query(createPortafolioQuery,data,function (err,result)
                {
                    logger.log("debug","createPortafolio",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//Method to Update Portafolios
//*******************************************************************************************
portafolioDAL.prototype.updatePortafolio  = function(data,id, resultMethod,connection) {
     data = portafolioDAL.prototype.self.mapperModelToSql(data); 
            var updatePortafolioQuery = "UPDATE `chameleon`.`Portafolio` SET ? WHERE ?;";
    console.log(portafolioDAL);
             portafolioDAL.prototype.queryWithArgument(updatePortafolioQuery,data,{UserId:id},function (err,result)
                {
                    logger.log("debug","updatePortafolio",data);
                    return resultMethod(err,result);
                },connection);
        };


//Method to Select Portafolio By Id
//*******************************************************************************************
portafolioDAL.prototype.getPortafolioById = function(id, resultMethod,connection) {
    var getPortafolioByIdQuery ="SELECT * FROM `chameleon`.`Portafolio` WHERE `IsActive` = 1 AND `PortafolioId` =?";
                portafolioDAL.prototype.getByArguments(getPortafolioByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getPortafolioById" , result);
                    return resultMethod(err,portafolioDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};

//Method to deactivate Portafolio
//*******************************************************************************************
portafolioDAL.prototype.deactivatePortafolio = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivatePortafolioQuery = "UPDATE `chameleon`.`Portafolio` SET `IsActive`=0,`ModificationDate`=? WHERE `PortafolioId`=?;";
             portafolioDAL.prototype.query(deactivatePortafolioQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivatePortafolio",data);
                    return resultMethod(err,portafolioDAL.prototype.nonQueryResult(result));
                },connection);
};
//Method to select the portafolio by User Id
//*******************************************************************************************
portafolioDAL.prototype.getPortafolioByCustomerId = function(id, resultMethod,connection) {
    var getPortafolioByCustomerIdQuery ="SELECT * FROM `chameleon`.`Portafolio` p INNER JOIN `User` u on u.`UserId` = p.`CustomerId` WHERE  u.`IsActive` = 1 and u.`UserId` =? and p.`IsActive` =1";
                portafolioDAL.prototype.getByArguments(getPortafolioByCustomerIdQuery,id,function (err,result)
                {
                    logger.log("debug","getPortafolioByCustomerId",id , result);
                    return resultMethod(err,portafolioDAL.prototype.self.mapperSqlToModelCollection(result));
                },connection);  
};

//Method for transform the information from sql to model
//********************************************************************************************
portafolioDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
        
        if(data != null && data[0] !=null )
        {
            data = data[0];
            var portafolio  = new portafolioModel();
           portafolio.id = data.PortafolioId;
           portafolio.reservationId = data.ReservationId;
           portafolio.userId = data.UserId;
           portafolio.customerId = data.CustomerId; 
           portafolio.repositoryId = data.RepositoryId;
           portafolio.description = data.Description;
           portafolio.creationDate = data.CreationDate;
           portafolio.modificationDate = data.ModificationDate;
           portafolio.isActive = data.IsActive
           data = null;
            return portafolio;
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


portafolioDAL.prototype.mapperSqlToModelCollection = function(data)
{
    try
    {
        
        if(data != null)
        {
            var portafolioCollection = [];
            for (var i = 0 ; i < data.length ; i++)
            {
                data = data[i];
           var portafolio  = new portafolioModel();
           portafolio.id = data.PortafolioId;
           portafolio.reservationId = data.ReservationId;
           portafolio.userId = data.UserId;
           portafolio.customerId = data.CustomerId; 
           portafolio.repositoryId = data.RepositoryId;
           portafolio.description = data.Description;
           portafolio.creationDate = data.CreationDate;
           portafolio.modificationDate = data.ModificationDate;
           portafolio.isActive = data.IsActive
           data = null;
            return portafolio;
                portafolioCollection.push(portafolio);
            }
            return portafolioCollection;
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
portafolioDAL.prototype.mapperModelToSql = function(data)
{
    try
    {
     logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={
    PortafolioId  : data.id,
    ReservationId : data.reservationId,
    UserId : data.userId,
    CustomerId : data.customerId,
    RepositoryId : data.repositoryId,
    Description : data.description,
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
module.exports = portafolioDAL;