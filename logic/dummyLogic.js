require('rootpath')();
var awsS3 = require('utilities/amazonS3');
var uuid = require('node-uuid');
var mod_vasync  = require("vasync");
var dummyDAL = require('data/dal/dummyDAL');
var logger = require('utilities/logger');
var dummyLogic = function()
{

   dummyLogic.prototype.self = this;
};

//Method to Create Users
//*******************************************************************************************
dummyLogic.prototype.createDummy = function(dummy, resultMethod) {
    var dummyData = new dummyDAL();
    try
    {
         dummyData.pool.getConnection(function(err, connection) 
        {
            connection.beginTransaction(function(err) 
            {  
                if (err) 
                { 
                    return resultMethod(err,null );
                }
            mod_vasync.waterfall([ 
            function createDummy(callback)
            {
                    dummyData.createDummy(dummy.text,function (err,result)
                    {
                        if(err)
                        {
                            return connection.rollback(function() {
                                callback(err,null);});
                        }
                        connection.commit(function(err) 
                        {
                            if(err)
                            {
                                return connection.rollback(function() {
                                    callback(err,null);});
                            }
                            logger.log("debug","commit" , dummy);
                        });
                    return callback(err,result );
                    },connection);

        },
        function getById (id, callback)
            {
                dummyData.getById(id,function (err,result)
                {
                return  callback(err,result);
                },connection);
            }
            ],
        function(err,result)
            {
                connection.release();
                dummyData = null;
            return  resultMethod(err,result);
            });

        });
    });
    }catch(err)
    {
         dummyData = null;
         return resultMethod(err,null );
    }

    
};
//Method to Update Users

//*******************************************************************************************
dummyLogic.prototype.getDummy = function( resultMethod) {

     var dummyData = new dummyDAL();
        mod_vasync.waterfall([ function Get (callback){
            dummyData.getDummy(function (err,result)
            {
              return  callback(err,result);
            },null);

        }],function(err,result){
             dummyData = null;
            return  resultMethod(err,result);});
};


//Method to Update Users

//*******************************************************************************************
dummyLogic.prototype.uploadImageAWS = function( data, resultMethod) {


        var key =  uuid.v1();
        logger.log("debug","uploadImageAWS",data);
        var instance = new awsS3();
        var base64data = new Buffer(data, 'binary');
        instance.put({
        Bucket: 'chameleon-dev', 
        Key: key, 
        Body: base64data,    

        },function(err,dataReceived)
        {
            instance = null;
            if(err == null )
            {
                var newData = {
                objKey:key
                }
                return  resultMethod(err,newData);
            }
            else
            {
                return  resultMethod(err,dataReceived);
            }
        });

};
//*******************************************************************************************
dummyLogic.prototype.getImageAWS = function( data, resultMethod) {
        var instance = new awsS3();
        instance.get({
        Bucket: 'chameleon-dev', 
        Key: data,
        ResponseContentType :"image/png",   
        },function(err,dataReceived)
        {
            instance = null;
            return  resultMethod(err,dataReceived);
        });

};



//*******************************************************************************************
    dummyLogic.prototype.test = function( resultMethod) {
                return resultMethod(null,"yes");
};
//********************************************************************************************
module.exports = dummyLogic;