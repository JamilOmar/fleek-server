//*******************************************************************************************
//Name: Enterprise DAl
//Description: Base class for connectivity with the MySql Database
//Target : Enterprise Creation , Administration of enterprises
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
require('rootpath')();        
var baseDAL  = require('./baseDAL.js');
var enterpriseModel  = require('models/enterprise');
var util = require('util');
var logger = require('utilities/logger');
//*******************************************************************************************

var enterpriseDAL = function()
{
  
   enterpriseDAL.prototype.self = this;
};
  enterpriseDAL.prototype =  new baseDAL();
//create
//*******************************************************************************************
enterpriseDAL.prototype.createEnterprise = function(data, resultMethod,connection) {
    data = enterpriseDAL.prototype.self.mapperModelToSql(data); 
            var createEnterpriseQuery = "INSERT INTO `chameleon`.`Enterprise` SET ?;";
             enterpriseDAL.prototype.query(createEnterpriseQuery,data,function (err,result)
                {
                    logger.log("debug","createEnterprise",result.insertId);
                    return resultMethod(err,result.insertId );
                },connection);
        };
//update
//*******************************************************************************************
enterpriseDAL.prototype.updateEnterprise  = function(data,id, resultMethod,connection) {
     data = enterpriseDAL.prototype.self.mapperModelToSql(data); 
            var updateEnterpriseQuery = "UPDATE `chameleon`.`Enterprise` SET ? WHERE ?;";
    console.log(enterpriseDAL);
             enterpriseDAL.prototype.queryWithArgument(updateEnterpriseQuery,data,{EnterpriseId:id},function (err,result)
                {
                    logger.log("debug","updateEnterprise",data);
                    return resultMethod(err,result);
                },connection);
        };



//select enterprise By Id
//*******************************************************************************************
enterpriseDAL.prototype.getEnterpriseById = function(id, resultMethod,connection) {
    var getEnterpriseByIdQuery ="SELECT * FROM `chameleon`.`Enterprise` WHERE `IsActive` = 1 AND `EnterpriseId` =?";
                enterpriseDAL.prototype.getByArguments(getEnterpriseByIdQuery,id,function (err,result)
                {
                    logger.log("debug","getEnterpriseById" , result);
                    return resultMethod(err,enterpriseDAL.prototype.self.mapperSqlToModel(result));
                },connection);  
};


//deactivate
//*******************************************************************************************
enterpriseDAL.prototype.deactivateEnterprise = function(data, resultMethod,connection) {
           var disableParameters = 
               [
                 
                  data.modificationDate,
                      data.id,
               ];
           var deactivateEnterpriseQuery = "UPDATE `chameleon`.`Enterprise` SET `IsActive`=0,`ModificationDate`=? WHERE `EnterpriseId`=?;";
             enterpriseDAL.prototype.query(deactivateEnterpriseQuery,disableParameters,function (err,result)
                {
                    logger.log("debug","deactivateEnterprise",data);
                    return resultMethod(err,enterpriseDAL.prototype.nonQueryResult(result));
                },connection);
};

//Method for transform the information from sql to model
//********************************************************************************************
enterpriseDAL.prototype.mapperSqlToModel = function(data)
{
    try
    {
        
        if(data != null && data[0] !=null )
        {
            data = data[0];
            var enterprise  = new enterpriseModel();
            enterprise.id = data.EnterpriseId;
            enterprise.countryId = data.CountryId;
            enterprise.latitude = data.Latitude;
            enterprise.longitude = data.Longitude;
            enterprise.name = data.Name;
            enterprise.telephone = data.Telephone;
            enterprise.address = data.Address;
            enterprise.contactEmail = data.ContactEmail;
            enterprise.activeEmployees = data.ActiveEmployees;
            enterprise.creationDate = data.CreationDate;
            enterprise.modificationDate = data.ModificationDate;
            enterprise.isActive = data.IsActive;
            data = null;
            return enterprise;
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


enterpriseDAL.prototype.mapperSqlToModelCollection = function(data)
{
    try
    {
        
        if(data != null)
        {
            var userCollection = [];
            for (var i = 0 ; i < data.length ; i++)
            {
                data = data[i];
                var enterprise  = new enterpriseModel();
                enterprise.id = data.EnterpriseId;
                enterprise.countryId = data.CountryId;
                enterprise.latitude = data.Latitude;
                enterprise.longitude = data.Longitude;
                enterprise.name = data.Name;
                enterprise.telephone = data.Telephone;
                enterprise.address = data.Address;
                enterprise.contactEmail = data.ContactEmail;
                enterprise.activeEmployees = data.ActiveEmployees;
                enterprise.creationDate = data.CreationDate;
                enterprise.modificationDate = data.ModificationDate;
                enterprise.isActive = data.IsActive;
                data = null;
                userCollection.push(enterprise);
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
enterpriseDAL.prototype.mapperModelToSql = function(data)
{
    try
    {    
    logger.log("debug","mapperModelToSql before",data);   
    var mysqlModel  ={
    EnterpriseId  : data.id,
    Name : data.name,
    CountryId : data.countryId,
    Latitude : data.latitude,
    Longitude : data.longitude,
    Address : data.address,
    Telephone : data.telephone,
    ContactEmail : data.contactEmail,
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
module.exports = enterpriseDAL;