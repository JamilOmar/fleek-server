module.exports = function(validator) {
validator.isNullOrUndefined = function(str)
{
    return  str === null || str === undefined ||str == "";
};
validator.isNumberAndIntegerAndRange= function(n,min,max)
{
    return Number.isInteger(n) && (n >= min) && (n<=max);
};
validator.isNumberAndInteger =function(number)
{
    return Number.isInteger(number) ;
};

validator.isCoordinate =function(str)
{
    var reg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");
    return reg.exec(str);
};
validator.isBoolean =function(val)
{
    
    return typeof val === 'boolean' || (val == 0 || val ==1);
};

}