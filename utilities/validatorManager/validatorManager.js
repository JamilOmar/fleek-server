 var validatorManager = function()
        {
           this.errorList =[];
            validatorManager.prototype.self = this;
        };
        
validatorManager.prototype.addException = function (ex) {
      validatorManager.prototype.self.errorList.push(ex);
}        
validatorManager.prototype.isValid = function () {
    return  validatorManager.prototype.self.errorList == 0 ;
}
validatorManager.prototype.GenerateErrorMessage = function () {
    return  validatorManager.prototype.self.errorList.join();
}
//********************************************************************************************
module.exports = validatorManager;