'use strict';
require('rootpath')();
const config = require('config');
let mysql     =    require('mysql');
const logger = require('utilities/logger');
let pool      =    mysql.createPool({
    connectionLimit : config.get('chameleon.dbConfig.connectionLimit'), 
    host     : config.get('chameleon.dbConfig.host'),
    user     : config.get('chameleon.dbConfig.user'),
    password : config.get('chameleon.dbConfig.password'),
    database : config.get('chameleon.dbConfig.database'),
    supportBigNumbers : config.get('chameleon.dbConfig.supportBigNumbers'),
});
//Creation of the connection Object
//*******************************************************************************************
class BaseDAL {
    constructor()
    {
      this.pool = pool;
    }

         
//Generic escape method
//*******************************************************************************************
escape(value) 
{
    return mysql.escape(value);
}

//Generic query method
//*******************************************************************************************
query(createUserQuery,data, resultMethod,connection) {
if(connection !=null )
{
               
 // Use the connection
connection.query(createUserQuery ,data, function(err, result) {
                   return resultMethod(err,result);
                });
}
else{
    this.pool.getConnection(function(err, connection) {

     if(connection == null || err) // not connection to database
    {
        return resultMethod(new Error("Error at Connection " + err));   
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
queryWithArgument(createUserQuery,data,argument,resultMethod,connection) {
            if(connection !=null )
            {
                var parameters = [];
                var argumentsList = [];
                //check if it has more than one argument
                if( Object.prototype.toString.call( argument ) === '[object Array]' ) {
                    argument.forEach(function(element) {
                        delete data[Object.keys(element)[0]];
                        argumentsList.push(element); 
                    }, this);
                 }
                 else
                 {
                        delete data[Object.keys(argument)[0]];
                        argumentsList.push(argument); 
                 }  
                  parameters.push(data);
                  parameters =parameters.concat(argumentsList);
                 
                 // Use the connection
                    connection.query(createUserQuery ,parameters, function(err, result) {
                   return resultMethod(err,result);
                });
            }
            else{
                this.pool.getConnection(function(err, connection) {

                    if(connection == null || err) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection " + err));   
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
get( createUserQuery,resultMethod,connection) {
                
            if(connection !=null )
            {
                 // Use the connection 
                connection.query(createUserQuery , function(err, rows) {
                return resultMethod(err,rows);
                });
            }
            else{
                  
                this.pool.getConnection(function(err, connection) {
                    if(connection == null || err) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection " + err));   
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
getByArguments(createUserQuery,argument, resultMethod,connection) {
                
            if(connection !=null )
            {
               
                 // Use the connection 
                connection.query(createUserQuery,argument , function(err, rows) {
                return resultMethod(err,rows);
                });
            }
            else{
                  
                this.pool.getConnection(function(err, connection) {
                    if(connection == null || err) // not connection to database
                    {
                        return resultMethod(new Error("Error at Connection " + err));   
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
nonQueryResult(data)
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
}
        //********************************************************************************************
module.exports = BaseDAL;