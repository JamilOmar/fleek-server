    require('rootpath')();
    var express = require('express');
    var dummyLogic = require('logic/dummyLogic.js');
    var router = express.Router();
    var Busboy = require('busboy');
    var config = require('config');
    var logger = require('utilities/logger');

    
    /* GET users listing. */
    router.get('/', function(req, res) {
      /*
        var dummyL = new dummyLogic();
        dummyL.test(function(err,result){  
           dummyL =null;
              res.send(result);

        });*/
          res.send("test");
    }
    );
    //create a new user into the Sql Engine
    router.get('/get', function(req, res) {

        var dummyL = new dummyLogic();
        dummyL.getDummy(function(err,result){  
              dummyL = null;
              if(err)
                {
                logger.log("error","get",err); 
                res.json(config.get('chameleon.responseWs.codeError'));
                }
            else
                {
                res.json(result);
                }
        });
    });


    //create a new user into the Sql Engine
    router.get('/getImage/:key', function(req, res) {

        console.log(req.param);
        var dummyL = new dummyLogic();
        dummyL.getImageAWS(req.params.key,function(err,result){  
             dummyL = null;
            if(result)
            {
              res.set('Content-Type', result.ContentType);
              res.send(result.Body);
            }
            else{
               logger.log("error","get",err); 
                res.json(config.get('chameleon.responseWs.codeError'));
            }
        });
    });


    /* Method to upload the image to the server */
    //create a new user into the Sql Engine
    router.post('/newDummy', function(req, res) {

        var dummyL = new dummyLogic();
        dummyL.createDummy(req.body,function(err,result){  
              dummyL = null;
              if(err)
                {
                logger.log("error","newDummy",err); 
                res.json(config.get('chameleon.responseWs.codeError'));
                }
            else
                {
                res.json(result);
                }


        });


    });
    /* Method to upload the image to the server */
    //create a new user into the Sql Engine
    router.post('/saveNewImage', function(req, res) {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('error', function(err) {
            busboy = null;
             if(err)
                {
                logger.log("error","saveNewImage",err); 
                res.json(config.get('chameleon.errorMessage'));
                }
        });

        var fileData = null;
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            //setting the file for the data upload 
            file.fileRead = [];
            // Creating the chunks of data
            file.on('data', function (data) {
                this.fileRead.push(data);
                });

            // Completed streaming the file.
            file.on('end', function () {
                fileData = Buffer.concat(this.fileRead);
            });
        });

        busboy.on('finish', function() {
            if(fileData != null)
            {
            var dummyL = new dummyLogic();
            dummyL.uploadImageAWS(fileData,function(err,result){  
                busboy = null;
                dummyL = null;
                res.json(result);
            });
            }
            else
            {
                busboy = null;
                res.json(null);
            }
              
        });
        req.on("close", function(err) {
           if(err)
                {
                logger.log("error","saveNewImage",err); 
                res.json(config.get('chameleon.responseWs.codeCancel'));
                }
        });
        return req.pipe(busboy);
    });






    module.exports = router;
