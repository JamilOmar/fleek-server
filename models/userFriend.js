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

userFriend.prototype.initializer = function (data)
{
           this.id = data.id;
           this.customerId = data.customerId;
           this.friendId = data.friendId;
           this.state = data.state;

}
//********************************************************************************************
        module.exports = userFriend;