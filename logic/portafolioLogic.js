//*******************************************************************************************
//Name: Portafolio Logic
//Description: Portafolio logic class
//Target : Portafolio Creation , Administration of Portafolio
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var portafolioDAL = require('data/dal/portafolioDAL');
var logger = require('utilities/logger');
var portafolioLogic = function()
{
  
   portafolioLogic.prototype.self = this;
};

//create
//*******************************************************************************************
portafolioLogic.prototype.createPortafolio = function(portafolio, resultMethod) {
var portafolioData = new portafolioDAL();
try
{
    //create a connection for the transaction
    portafolioData.pool.getConnection(function(err,connection){
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
                    portafolio.modificationDate = localDate;
                    portafolio.creationDate = localDate;
                    portafolio.isActive = true;
                    callback(null,portafolio);
                },    
                //method to create the portafolio    
                function createportafolio(portafolio,callback)
                {
                    portafolioData.createPortafolio(portafolio,function (err,result)
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
                            logger.log("debug","commit" , portafolio);
                        });
                          
                    return callback(null,result );
                    },connection);

        },
        //get information by id            
        function getById (id, callback)
        {
                portafolioData.getPortafolioById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                portafolioData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
        portafolioData = null;
         return resultMethod(err,null );
    }
        
};
//update
//*******************************************************************************************
portafolioLogic.prototype.updatePortafolio = function(portafolio, resultMethod) {
var portafolioData = new portafolioDAL();
try
{
    //create a connection for the transaction
    portafolioData.pool.getConnection(function(err,connection){
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
                    portafolio.modificationDate =new Date();
                    callback(null,portafolio);
                },
                //update   
                function updatePortafolio(portafolio,callback)
                {
                    portafolioData.updatePortafolio(portafolio,portafolio.id,function (err,result)
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
                            logger.log("debug","commit" , portafolio);
                        });
                     
                    return callback(null,portafolio );
                    },connection);

        },
        //get information by id            
        function getById (portafolio, callback)
        {
           
                portafolioData.getPortafolioById(portafolio.id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                portafolioData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         portafolioData = null;
         return resultMethod(err,null );
    }
        
};
//portafolio by Id
//*******************************************************************************************
portafolioLogic.prototype.getPortafolioById = function(id, resultMethod) {
     var portafolioData = new portafolioDAL();
        mod_vasync.waterfall([ function Get (callback){
            portafolioData.getPortafolioById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            portafolioData = null;
            return  resultMethod(err,result);});
};
//get portafolio by customer Id
//*******************************************************************************************
portafolioLogic.prototype.getPortafolioByCustomerId = function(id, resultMethod) {
     var portafolioData = new portafolioDAL();
        mod_vasync.waterfall([ function Get (callback){
            portafolioData.getPortafolioByCustomerId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            portafolioData = null;
            return  resultMethod(err,result);});
};
//deactivate
//*******************************************************************************************
portafolioLogic.prototype.deactivatePortafolio = function(portafolio, resultMethod) {
    var portafolioData = new portafolioDAL();
try
{
    //create a connection for the transaction
    portafolioData.pool.getConnection(function(err,connection){
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
                    portafolio.modificationDate = new Date();
                    callback(null,portafolio);
                },
                //Deactivate 
                function deactivate(portafolio,callback)
                {
                    portafolioData.deactivatePortafolio(portafolio,function (err,result)
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
                            logger.log("debug","commit" , portafolio);
                       
                        });
                    return callback(err,result );
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                portafolioData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         portafolioData = null;
         return resultMethod(err,null );
    }
        
};

//********************************************************************************************
module.exports =portafolioLogic;