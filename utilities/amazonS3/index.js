
var config = require('config');
var aws = require('aws-sdk'); 
aws.config.accessKeyId     = config.get('chameleon.amazonS3.accessKeyId');
aws.config.secretAccessKey = config.get('chameleon.amazonS3.secretAccessKey');



//Create the object
//*******************************************************************************************
function AwsS3()
{
    this.s3 = new aws.S3();
    AwsS3.prototype.self = this;
    
    
}

//Method to create objects in bucket
//*******************************************************************************************
AwsS3.prototype.put = function(params,callback )
{
    
    AwsS3.prototype.self.s3.putObject(params, function(err,data)   
    {
        callback(err,data);
    });
};

//Method to delete objects in bucket
//*******************************************************************************************
AwsS3.prototype.delete = function(params,callback )
{
    
    AwsS3.prototype.self.s3.deleteObject (params, function(err,data)   
    {
        callback(err,data);
    });
};

//Method to get object from bucket
//*******************************************************************************************
AwsS3.prototype.get = function(params,callback )
{
    
    AwsS3.prototype.self.s3.getObject(params, function(err,data)   
    {
        callback(err,data);
    });
};
//********************************************************************************************
    module.exports =  AwsS3;

