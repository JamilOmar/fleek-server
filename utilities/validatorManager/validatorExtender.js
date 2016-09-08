module.exports = function(validator) {
validator.isNullOrUndefined = function(str)
{
    return  str === null || str === undefined ||str == "";
};
validator.isNumberAndIntegerAndRange= function(n,min,max)
{
    return Number.isInteger(n) && (n >= min) && (n<=max);
};
validator.isValidByOptions= function(n,validList)
{
   return validList.indexOf(n) != -1;
};
validator.isNumberAndInteger =function(number)
{
    return Number.isInteger(number) ;
};

validator.validateCoordinate= function (min,number,max){
    if ( !isNaN(number) && (number >= min) && (number <= max) ){
        return true;
    } else {
        return false;
    };
}

validator.isCoordinate =function(str)
{
    var reg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");
    var result =  reg.exec(str);
    return str;
};
validator.isBoolean =function(val)
{
    
    return typeof val === 'boolean' || (val == 0 || val ==1);
};

}