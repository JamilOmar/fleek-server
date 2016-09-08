//*******************************************************************************************
//Name: Personality Logic
//Description: Personality logic class
//Target : Facebook Functionalities
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();
var logger = require('utilities/logger');
var userBehaviorDAL = require('data/dal/userBehaviorDAL');
var personalityEngine =  require('utilities/personalityEngine');
var mod_vasync = require("vasync");
var context = require('security/context');
//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************

var PersonalityLogic = function () {

    PersonalityLogic.prototype.self = this;
};
//Method to get the user information from facebook
//*******************************************************************************************
PersonalityLogic.prototype.getUserInformationForProcess = function(facebookToken, resultMethod) {
    var FB = require('fb');
    FB.api('me',{ fields: constants.FACEBOOK_INFORMATION, access_token: facebookToken }, function (res) {
        
     return resultMethod(res.error,res);
    
  });  
}

//*******************************************************************************************
//
// Method for add a friend
//
//
//*******************************************************************************************
PersonalityLogic.prototype.savePersonality = function(userBehavior, resultMethod) {
    var userBehaviorData = new userBehaviorDAL();
    try {
      
        //create a connection for the transaction
        userBehaviorData.pool.getConnection(function(err, connection) {
            //start the transaction
            if (err) { //if there is an error in the connection
                return resultMethod(err, null);
            }
            connection.beginTransaction(function(err) {

                if (err) { //if there is an error in the transaction return
                    return resultMethod(err, null);
                }
                mod_vasync.waterfall([

                    //check if the information exists
                    //*******************************************************************************************
                    function checkExistingItem(callback) {

                        userBehaviorData.getUserBehaviorByUserId(userBehavior.id, function(err, result) {
                            return callback(err, result);
                        }, connection);

                    },
                    //prepare the data for create the userBehavior
                    //*******************************************************************************************
                    function prepare(data, callback) {

                       
                        if (Object.keys(data)
                            .length > 0) {
                        userBehaviorData.updateUserBehavior(userFriend,userFriend.id, function(err, result) {
                            
                                return  callback(err, result);
                             
                        }, connection);
                        } else {
                                  userBehaviorData.createUserBehavior(userFriend, function(err, result) {
                            
                                return  callback(err, result);
                             
                        }, connection);    

                            
                        }
                    },
                    //add the friend in the database
                    //*******************************************************************************************            
                    function Commit(commitData,callback) {                  
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback(err, null);
                            });
                        } else {
                            logger.log("debug", "commit", userFriend);
                            return callback(null, userFriend);
                        }
                    });
                    }
                ], function(err, result) {
                    if(err)
                    connection.rollback(function() {
                            connection.release();
                            userBehaviorData = null;
                    
                     return resultMethod(err, null);
                                });
                    else            
                    connection.release();
                    userBehaviorData = null;
                 
                    return resultMethod(err, result);
                });
            });
        });
    } catch (err) {
        userBehaviorData = null;
        return resultMethod(err, null);
    }

};
//Method for process the facebook data
//*******************************************************************************************
PersonalityLogic.prototype.processSocialMediaInformation = function(data, resultMethod) {

    process.nextTick(function(){

try {
    var dataResult;
    if(data)
    {
        if(data.feed && data.feed.data )
        {
            data.feed.data.forEach(function(element) {
            if(element.story)    
              dataResult+=" " +  element.story;
            }, this);

        }
         if(data.likes && data.likes.data )
        {
            data.likes.data.forEach(function(element) {
              if(element.about)  
              dataResult+=" " +  element.about;
            }, this)
        }
         if(data.posts && data.posts.data )
        {
            data.posts.data.forEach(function(element) {
                if(element.message)
              dataResult+=" " +  element.message;
            }, this)
        }
        if(data.quotes)
        {
        dataResult+= " "+data.quotes;
        }

        return resultMethod(null,dataResult);

    }

} catch (error) {
      return resultMethod(error,null);
    
}
    })
}

//Method for evaluate the personality analysis
//*******************************************************************************************


PersonalityLogic.prototype.evaluate= function(callback)
{
    var personalityE = new personalityEngine();
     var contextUser = context.getUser();
     mod_vasync.waterfall([

        function getData(callback) {

            PersonalityLogic.prototype.self.getUserInformationForProcess( contextUser.refreshToken ,function(err,result)
            {
                  return callback(err, result);
            });
        },
       function analyzeData(socialData,callback) {

            PersonalityLogic.prototype.self.processSocialMediaInformation(socialData ,function(err,result)
            {
                  return callback(err, result);
            });
        },

         function processData(data,callback) {
             personalityE.analyze(data,'es',function(err,result)
             {
                 return callback(err,result);
             })
          
        },
        function saveData(socialData,callback) {            
            var localDate = new Date();
            userBehavior.id = contextUser.id;
            userBehavior.analysis = socialData;
            userBehavior.modificationDate = localDate;
            userBehavior.creationDate = localDate;
            PersonalityLogic.prototype.self.savePersonality(userBehavior ,function(err,result)
            {
                  return callback(err, result);
            });
        },
    ], function(err, result) {

        personalityE = null;
        return resultMethod(err, result);
    });
}
//********************************************************************************************
module.exports = PersonalityLogic;