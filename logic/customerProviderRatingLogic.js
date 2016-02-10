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
var customerProviderRatingDAL = require('data/dal/customerProviderRatingDAL');
var logger = require('utilities/logger');
var customerProviderRatingLogic = function()
{
  
   customerProviderRatingLogic.prototype.self = this;
};

//create
//*******************************************************************************************
customerProviderRatingLogic.prototype.createCustomerProviderRating = function(customerProviderRating, resultMethod) {
var customerProviderRatingData = new customerProviderRatingDAL();
try
{
    //create a connection for the transaction
    customerProviderRatingData.pool.getConnection(function(err,connection){
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
                    customerProviderRating.modificationDate = localDate;
                    customerProviderRating.creationDate = localDate;
                    customerProviderRating.isActive = true;
                    callback(null,customerProviderRating);
                },    
                //method to create the customerProviderRating    
                function createCustomerProviderRating(customerProviderRating,callback)
                {
                    customerProviderRatingData.addCustomerProviderRating(customerProviderRating,function (err,result)
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
                            logger.log("debug","commit" , customerProviderRating);
                        });
                          
                    return callback(null,result );
                    },connection);

        },
        //get information by id            
        function getById (id, callback)
        {
                customerProviderRatingData.getCustomerProviderRatingById(id,function (err,result)
                {
                    return  callback(err,result);
                },connection);
        }
        ],
        function(err,result)
        {
                connection.release();
                customerProviderRatingData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         customerProviderRatingData = null;
         return resultMethod(err,null );
    }
        
};


//get customerProviderRating by Id
//*******************************************************************************************
customerProviderRatingLogic.prototype.getCustomerProviderRatingById = function(id, resultMethod) {
     var customerProviderRatingData = new customerProviderRatingDAL();
        mod_vasync.waterfall([ function Get (callback){
            customerProviderRatingData.getCustomerProviderRatingById(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            customerProviderRatingData = null;
            return  resultMethod(err,result);});
};
//get customer provider rating by provider and customer Id
//*******************************************************************************************
customerProviderRatingLogic.prototype.getCustomerProviderRatingByProviderAndCustomerId = function(providerId,customerId , resultMethod) {
     var customerProviderRatingData = new customerProviderRatingDAL();
        mod_vasync.waterfall([ function Get (callback){
            customerProviderRatingData.getCustomerProviderRatingByProviderAndCustomerId(providerId,customerId ,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            customerProviderRatingData = null;
            return  resultMethod(err,result);});
};

//get ratings of a customer reservation
//*******************************************************************************************
customerProviderRatingLogic.prototype.getCustomerProviderRatingByCustomerReservationId = function(customeReservationId, resultMethod) {
     var customerProviderRatingData = new customerProviderRatingDAL();
        mod_vasync.waterfall([ function Get (callback){
            customerProviderRatingData.getCustomerProviderRatingByCustomerReservationId(customeReservationId,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            customerProviderRatingData = null;
            return  resultMethod(err,result);});
};
//get customerProviderRating by provider Id
//*******************************************************************************************
customerProviderRatingLogic.prototype.getCustomerProviderRatingByProviderId = function(id, resultMethod) {
     var customerProviderRatingData = new customerProviderRatingDAL();
        mod_vasync.waterfall([ function Get (callback){
            customerProviderRatingData.getCustomerProviderRatingByProviderId(id,function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
            customerProviderRatingData = null;
            return  resultMethod(err,result);});
};


//deactivate
//*******************************************************************************************
customerProviderRatingLogic.prototype.deactivateCustomerProviderRating = function(customerProviderRating, resultMethod) {
    var customerProviderRatingData = new customerProviderRatingDAL();
try
{
    //create a connection for the transaction
    customerProviderRatingData.pool.getConnection(function(err,connection){
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
                    customerProviderRating.modificationDate = new Date();
                    callback(null,customerProviderRating);
                },
                //Deactivate 
                function deactivate(customerProviderRating,callback)
                {
                    customerProviderRatingData.deactivateCustomerProviderRating(customerProviderRating,function (err,result)
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
                            logger.log("debug","commit" , customerProviderRating);
                       
                        });
                    return callback(err,result );
                    },connection);

        }
        ],
        function(err,result)
        {
                connection.release();
                customerProviderRatingData = null;
                return  resultMethod(err,result);
        });

        });
    });
    }
    catch(err)
    {
         customerProviderRatingData = null;
         return resultMethod(err,null );
    }
        
};


//********************************************************************************************
module.exports =  customerProviderRatingLogic;