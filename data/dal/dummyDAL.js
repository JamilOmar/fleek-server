        require('rootpath')();        
        var baseDAL  = require('./baseDAL.js');
        var util = require('util');
        var logger = require('utilities/logger');
        var dummyDAL = function()
        {
            dummyDAL.prototype.self = this; 
        };
        dummyDAL.prototype =  new baseDAL();
        //Method to Create Users
//*******************************************************************************************
        dummyDAL.prototype.createDummy = function(data, resultMethod,connection) {
            var createUserQuery = "INSERT INTO `chameleon`.`Dummy` (`text`) VALUES (?);"
             dummyDAL.prototype.query(createUserQuery,function (err,result)
                {
                    logger.log("debug","createDummy",data);
                    return resultMethod(err,result);
                },null);
        };
//*******************************************************************************************
        dummyDAL.prototype.getDummy = function( resultMethod,connection) {
            
                var createUserQuery ="SELECT * FROM `chameleon`.`Dummy`";
                dummyDAL.prototype.get("SELECT * FROM `chameleon`.`Dummy`",function (err,result)
                {
                    logger.log("debug","getDummy" , result);
                    return resultMethod(err,result);
                },null);  
        };
  //*******************************************************************************************
        dummyDAL.prototype.getById = function(id, resultMethod,connection) {
            
                var createUserQuery ="SELECT * FROM `chameleon`.`Dummy` where idDummy = ? ";
                dummyDAL.prototype.get("SELECT * FROM `chameleon`.`Dummy`",function (err,result)
                {
                    logger.log("debug","getById", result);
                    return resultMethod(err,result);
                },null);    
        };
 //********************************************************************************************
        module.exports =  dummyDAL;