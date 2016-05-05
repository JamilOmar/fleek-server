//*******************************************************************************************
//Name: Facebook Logic
//Description: Facebook logic class
//Target : Facebook Functionalities
//Author: Jamil Falconi
//year: 2016
//Version : 1.0
//*******************************************************************************************
"user strict";
require('rootpath')();

//*******************************************************************************************
//constants
var constants = require('global/constants.js');
//*******************************************************************************************

var facebookLogic = function () {

    facebookLogic.prototype.self = this;
};
//Method to get the user information
//*******************************************************************************************
facebookLogic.prototype.getUserInformationForProcess = function(facebookToken, resultMethod) {
    var FB = require('fb');
    FB.api('me',{ fields: constants.FACEBOOK_INFORMATION, access_token: facebookToken }, function (res) {
   });
    
}
//********************************************************************************************
module.exports = facebookLogic;