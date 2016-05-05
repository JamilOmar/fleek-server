require('rootpath')();
var base = require('./base.js');
var serviceType = function() {
    this.id = null;
    this.name = null;
    this.pictureUrl = null;
    base.call(this);
};
serviceType.prototype = new base();
//********************************************************************************************
module.exports = serviceType;