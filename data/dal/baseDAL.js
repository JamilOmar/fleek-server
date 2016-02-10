        require('rootpath')();
        var config = require('config');
        var mysql     =    require('mysql');
        var logger = require('utilities/logger');
        var pool      =    mysql.createPool({
            connectionLimit : config.get('chameleon.dbConfig.connectionLimit'), 
            host     : config.get('chameleon.dbConfig.host'),
            user     : config.get('chameleon.dbConfig.user'),
            password : config.get('chameleon.dbConfig.password'),
            database : config.get('chameleon.dbConfig.database'),
            supportBigNumbers : config.get('chameleon.dbConfig.supportBigNumbers'),
        });
//Creation of the connection Object
//*******************************************************************************************
        var baseDAL = function()
        {
           this.pool = pool;
           baseDAL.prototype.self = this;
        };

//Generic query method
//*******************************************************************************************
        baseDAL.prototype.query = function(createUserQuery,data, resultMethod,connection) {
            if(connection !=null )
            {
               
                 // Use the connection
                    connection.query(createUserQuery ,data, function(err, result) {
                   return resultMethod(err,result);
                });
            }
            else{
                baseDAL.prototype.self.pool.getConnection(function(err, connection) {

                     if(connection == null) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection"),null);      
                    }
                    // Use the connection 
                    connection.query(createUserQuery ,data, function(errData, result) {
                    connection.release();
                    return resultMethod(errData,result);
                    });
                });
            };
        };

//Generic method with extra argument
//*******************************************************************************************
        baseDAL.prototype.queryWithArgument = function(createUserQuery,data,argument, resultMethod,connection) {
            if(connection !=null )
            {
               
                 // Use the connection
                    connection.query(createUserQuery ,[data,argument], function(err, result) {
                   return resultMethod(err,result);
                });
            }
            else{
                baseDAL.prototype.self.pool.getConnection(function(err, connection) {

                     if(connection == null) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection"),null);      
                    }
                    // Use the connection 
                    connection.query(createUserQuery ,[data,argument], function(errData, result) {
                    connection.release();
                    return resultMethod(errData,result);
                    });
                });
            };
        };


//Generic Get Method
//*******************************************************************************************
        baseDAL.prototype.get = function( createUserQuery,resultMethod,connection) {
                
            if(connection !=null )
            {
                 // Use the connection 
                connection.query(createUserQuery , function(err, rows) {
                return resultMethod(err,rows);
                });
            }
            else{
                  
                baseDAL.prototype.self.pool.getConnection(function(err, connection) {
                    if(connection == null) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection"),null);   
                    }
                    // Use the connection 
                    connection.query(createUserQuery , function(errData, rows) {
                    connection.release();
                    return resultMethod(errData,rows);
                    });
                });
            };
            
        };
//Generic Get by Arguments Method
//*******************************************************************************************
        baseDAL.prototype.getByArguments = function(createUserQuery,argument, resultMethod,connection) {
                
            if(connection !=null )
            {
               
                 // Use the connection 
                connection.query(createUserQuery,argument , function(err, rows) {
                return resultMethod(err,rows);
                });
            }
            else{
                  
                baseDAL.prototype.self.pool.getConnection(function(err, connection) {
                    if(connection == null) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection"),null);    
                    }
                    // Use the connection 
                    connection.query(createUserQuery,argument , function(errData, rows) {
                    connection.release();
                    return resultMethod(errData,rows);
                    });
                });
            };
            
        };
//Generic Get NonQuery Result
//*******************************************************************************************
        baseDAL.prototype.nonQueryResult = function(data)
        {
         
            if( data!=null )
            {
                 return data.affectedRows > 0;
            }
            else
            {
                return false;

            }
        }
        //********************************************************************************************
module.exports = baseDAL;