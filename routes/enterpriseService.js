//*******************************************************************************************
//Name: Enterprise Logic
//Description: Enterprise logic class
//Target : Enterprise Creation , Administration of Enterprises
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var enterpriseDAL = require('data/dal/enterpriseDAL');
var logger = require('utilities/logger');
var enterpriseLogic = function()
{
  
   enterpriseLogic.prototype.self = this;
};

//create
//*******************************************************************************************
enterpriseLogic.prototype.createEnterprise = function(enterprise, resultMethod) {
var enterpriseData = new enterpriseDAL();
try
{
    //create a connection for the transaction
    enterpriseData.pool.getConnection(function(err,connection){
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
                    var localDate = new Date();
                    enterprise.modificationDate = localDate;
                    enterprise.creationDate = localDate;
                    enterprise.isActive = true;
                    enterprise.isCanceled =false;
                    callback(null,enterprise);
                },    
                //method to create the enterprise    
                function createEnterprise(enterprise,callback)
                {
                    enterpriseData.createEnterprise(enterprise,function (err,result)
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
                            logger.log("debug","commit" , enterprise);
                        });
                          
                    return callback(null,result );
                    },connection);

        },
        //get information by id            
        function getById (id, callback)
        {
                enterpriseData.getEnterpriseById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                enterpriseData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         enterpriseData = null;
         return resultMethod(err,null );
    }
        
};
//update
//*******************************************************************************************
enterpriseLogic.prototype.updateEnterprise = function(enterprise, resultMethod) {
var enterpriseData = new enterpriseDAL();
try
{
    //create a connection for the transaction
    enterpriseData.pool.getConnection(function(err,connection){
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
                    enterprise.modificationDate = new Date();
                    callback(null,enterprise);
                },
                //update   
                function updateEnterprise(enterprise,callback)
                {
                    enterpriseData.updateEnterprise(enterprise,enterprise.id,function (err,result)
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
                            logger.log("debug","commit" , enterprise);
                        });
                     
                    return callback(null,enterprise );
                    },connection);

        },
        //get information by id            
        function getById (enterprise, callback)
        {
           
                enterpriseData.getEnterpriseById(enterprise.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                enterpriseData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         enterpriseData = null;
         return resultMethod(err,null );
    }
        
};


//select enterprise by Id
//*******************************************************************************************
enterpriseLogic.prototype.getEnterpriseById = function(id, resultMethod) {
     var enterpriseData = new enterpriseDAL();
        mod_vasync.waterfall([ function Get (callback){
            enterpriseData.getEnterpriseById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            enterpriseData = null;
            return  resultMethod(err,result);});
};

//deactivate
//*******************************************************************************************
enterpriseLogic.prototype.deactivateEnterprise = function(enterprise, resultMethod) {
    var enterpriseData = new enterpriseDAL();
try
{
    //create a connection for the transaction
    enterpriseData.pool.getConnection(function(err,connection){
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
                    enterprise.modificationDate = new Date();
                    callback(null,enterprise);
                },
                //Deactivate 
                function deactivate(enterprise,callback)
                {
                    enterpriseData.deactivateEnterprise(enterprise,function (err,result)
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
                            logger.log("debug","commit" , enterprise);
                       
                        });
                    return callback(err,result );
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                enterpriseData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         enterpriseData = null;
         return resultMethod(err,null );
    }
        
};


//********************************************************************************************
module.exports =  enterpriseLogic;