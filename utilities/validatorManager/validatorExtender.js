module.exports = function(validator) {
validator.extend ('isNullOrUndefined',function(str)
{
    return str == null || str == undefined;
});
validator.extend ('isNumberAndInteger',function(number)
{
    return Number.isInteger(number);
});
validator.extend ('isCoordinate',function(str)
{
    var reg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");
    return reg.exec(str);
});

}