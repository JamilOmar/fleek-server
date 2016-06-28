
module.exports = function() {
   
    //creation of the express object
    const express = require('express');
    const config = require('config');
    const passport = require('passport');
    const logger = require('./utilities/logger');
    const notificationsEngine = require('./utilities/notificationsEngine');
    var bodyParser = require('body-parser');
    var app = express();
    var hooks = require('./security/hooks/');
  
    app.disable('x-powered-by');
    app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Auth-Token , Authorization, Accept, Access-Control-Allow-Headers");
  next();
});
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    //global check token if is not authentication service
    app.all(/^((?!authenticationService).)*$/, hooks.tokenValidation);
    //creation of the routes
    var routes = require('./routes/index');
    app.use('/', routes);
    var userService = require('./routes/userService');
    app.use('/v1/userService', userService);
    var serviceTypeService = require('./routes/serviceTypeService');
    app.use('/v1/serviceTypeService', serviceTypeService);
     var serviceService = require('./routes/serviceService');
    app.use('/v1/serviceService', serviceService);
    var userFriendService = require('./routes/userFriendService');
    app.use('/v1/userFriendService', userFriendService);
    var providerScheduleService = require('./routes/providerScheduleService');
    app.use('/v1/providerScheduleService', providerScheduleService);
    var providerServiceService = require('./routes/providerServiceService');
    app.use('/v1/providerServiceService', providerServiceService);
    var providerService = require('./routes/providerService');
    app.use('/v1/providerService', providerService);
     var providerScheduleDayService = require('./routes/providerScheduleDayService');
    app.use('/v1/providerScheduleDayService', providerScheduleDayService);
    var providerScheduleExceptionService = require('./routes/providerScheduleExceptionService');
    app.use('/v1/providerScheduleExceptionService', providerScheduleExceptionService);
    var userRatingService = require('./routes/userRatingService');
    app.use('/v1/userRatingService', userRatingService);
    var reservationService = require('./routes/reservationService');
    app.use('/v1/reservationService', reservationService);
    var authenticationService = require('./routes/authenticationService');
    app.use('/v1/authenticationService', authenticationService);
    //notifications engine
    var notificationsEngineL = new notificationsEngine();
    notificationsEngineL.start();
    
    
    //globar error handler
    app.use(function(err, req, res, next) {
        logger.error("global",err); 
        res.status(500).send(config.get('chameleon.responseWs.codeError'));
    });
   

    return app;
 
}


