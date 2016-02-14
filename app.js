
module.exports = function() {
   
    //creation of the express object
    var express = require('express');
    var config = require('config');
    var passport = require('passport');
    var logger = require('./utilities/logger');
    var bodyParser = require('body-parser');
    var app = express();
    var hooks = require('./security/hooks/');
  
    app.disable('x-powered-by');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    //global check token if is not authentication service
    app.all(/^((?!authenticationService).)*$/, hooks.tokenValidation);
    //creation of the routes
    var routes = require('./routes/index');
    app.use('/', routes);
    var userService = require('./routes/userService');
    app.use('/userService', userService);
    var serviceTypeService = require('./routes/serviceTypeService');
    app.use('/serviceTypeService', serviceTypeService);
     var serviceService = require('./routes/serviceService');
    app.use('/serviceService', serviceService);
    var userFriendService = require('./routes/userFriendService');
    app.use('/userFriendService', userFriendService);
    var providerScheduleService = require('./routes/providerScheduleService');
    app.use('/providerScheduleService', providerScheduleService);
     var providerScheduleDayService = require('./routes/providerScheduleDayService');
    app.use('/providerScheduleDayService', providerScheduleDayService);
    var providerScheduleExceptionService = require('./routes/providerScheduleExceptionService');
    app.use('/providerScheduleExceptionService', providerScheduleExceptionService);
    var dummyService = require('./routes/dummyService');
    app.use('/dummyService', dummyService);
    var customerProviderRatingService = require('./routes/customerProviderRatingService');
    app.use('/customerProviderRatingService', customerProviderRatingService);
    var reservationService = require('./routes/reservationService');
    app.use('/reservationService', reservationService);
    var authenticationService = require('./routes/authenticationService');
    app.use('/authenticationService', authenticationService);
    
    
    
    //globar error handler
    app.use(function(err, req, res, next) {
        logger.error("global",err); 
        res.status(500).send(config.get('chameleon.responseWs.codeError'));
    });

    return app;
 
}


