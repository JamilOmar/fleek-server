require('rootpath')();        
var base  = require('./base.js');   
var userFriend = function()
        {
           this.id = null;
           this.customerId = null;
           this.friendId = null;
           this.state = null;
           this.customer = null;
           this.friend = null;
           base.call(this);
        };
userFriend.prototype = new base();
//********************************************************************************************
        module.exports = userFriend;