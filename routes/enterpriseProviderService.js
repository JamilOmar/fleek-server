//*******************************************************************************************
//Name: Enterprise Provider Logic
//Description: Enterprise provider logic class
//Target : Enterprise provider Creation , Administration of Enterprise Provider 
//Author: Jamil Falconi
//year: 2015
//Version : 1.0
//*******************************************************************************************
require('rootpath')();
var mod_vasync  = require("vasync");
var enterpriseProviderDAL = require('data/dal/enterpriseProviderDAL');
var logger = require('utilities/logger');

//Security Check Token
//******************************************************************************************* 
router.use(securityCheckLogic.checkUserToken);

var enterpriseProviderLogic = function()
{
  
   enterpriseProviderLogic.prototype.self = this;
};

//create
//*******************************************************************************************
enterpriseProviderLogic.prototype.createEnterpriseProvider = function(enterpriseProvider, resultMethod) {
var enterpriseProviderData = new enterpriseProviderDAL();
try
{
    //create a connection for the transaction
    enterpriseProviderData.pool.getConnection(function(err,connection){
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
                    enterpriseProvider.modificationDate = localDate;
                    enterpriseProvider.creationDate = localDate;
                    enterpriseProvider.isActive = true;
                    callback(null,enterpriseProvider);
                },    
                //method to create the enterpriseProvider    
                function createEnterpriseProvider(enterpriseProvider,callback)
                {
                    enterpriseProviderData.createEnterpriseProvider(enterpriseProvider,function (err,result)
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
                            logger.log("debug","commit" , enterpriseProvider);
                        });
                          
                    return callback(null,result );
                    },connection);

        },
        //get information by id            
        function getById (id, callback)
        {
                enterpriseProviderData.getEnterpriseProviderById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                enterpriseProviderData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         enterpriseProviderData = null;
         return callback(err,null );
    }
        
};


//get enterpriseProvider by Id
//*******************************************************************************************
enterpriseProviderLogic.prototype.getEnterpriseProviderById = function(id, resultMethod) {
     var enterpriseProviderData = new enterpriseProviderDAL();
        mod_vasync.waterfall([ function Get (callback){
            enterpriseProviderData.getEnterpriseProviderById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            enterpriseProviderData = null;
            return  resultMethod(err,result);});
};

//get enterprise by provider and enterprise Id
//*******************************************************************************************
enterpriseProviderLogic.prototype.getEnterpriseProviderByProviderAndEnterpriseId = function(providerId,enterpriseId, resultMethod) {
     var enterpriseProviderData = new enterpriseProviderDAL();
        mod_vasync.waterfall([ function Get (callback){
            enterpriseProviderData.getEnterpriseProviderByProviderAndEnterpriseId(providerId,enterpriseId,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            enterpriseProviderData = null;
            return  resultMethod(err,result);});
};
//get enterpriseProvider by provider Id
//*******************************************************************************************
enterpriseProviderLogic.prototype.getEnterpriseProviderByProviderId = function(id, resultMethod) {
     var enterpriseProviderData = new enterpriseProviderDAL();
        mod_vasync.waterfall([ function Get (callback){
            enterpriseProviderData.getEnterpriseProviderByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            enterpriseProviderData = null;
            return  resultMethod(err,result);});
};
//get enterpriseProvider by provider Id
//*******************************************************************************************
enterpriseProviderLogic.prototype.getEnterpriseProviderByProviderId = function(id, resultMethod) {
     var enterpriseProviderData = new enterpriseProviderDAL();
        mod_vasync.waterfall([ function Get (callback){
            enterpriseProviderData.getEnterpriseProviderByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            enterpriseProviderData = null;
            return  resultMethod(err,result);});
};


//remove enterprise providers by provider and enterprise id
//*******************************************************************************************
enterpriseProviderLogic.prototype.removeEnterpriseProviderByProviderAndEnterpriseId = function(enterpriseProvider, resultMethod) {
    var enterpriseProviderData = new enterpriseProviderDAL();
try
{
    //create a connection for the transaction
    enterpriseProviderData.pool.getConnection(function(err,connection){
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
                    enterpriseProvider.modificationDate = new Date();
                    callback(null,enterpriseProvider);
                },
                //Deactivate 
                function removeEnterpriseProviderByProviderAndEnterpriseId(enterpriseProvider,callback)
                {
                    enterpriseProviderData.removeEnterpriseProviderByProviderAndEnterpriseId(enterpriseProvider,function (err,result)
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
                            logger.log("debug","commit" , enterpriseProvider);
                       
                        });
                    return callback(err,result );
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                enterpriseProviderData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
        enterpriseProviderData = null;
         return resultMethod(err,null );
    }
        
};

//deactivate
//*******************************************************************************************
enterpriseProviderLogic.prototype.deactivateEnterpriseProvider = function(enterpriseProvider, resultMethod) {
    var enterpriseProviderData = new enterpriseProviderDAL();
try
{
    //create a connection for the transaction
    enterpriseProviderData.pool.getConnection(function(err,connection){
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
                    enterpriseProvider.modificationDate = new Date();
                    callback(null,enterpriseProvider);
                },
                //Deactivate 
                function deactivate(enterpriseProvider,callback)
                {
                    enterpriseProviderData.deactivateEnterpriseProvider(enterpriseProvider,function (err,result)
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
                            logger.log("debug","commit" , enterpriseProvider);
                       
                        });
                    return callback(err,result );
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                enterpriseProviderData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         enterpriseProviderData = null;
         return resultMethod(err,null );
    }
        
};


//********************************************************************************************
module.exports =  enterpriseProviderLogic;