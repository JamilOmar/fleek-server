var winston = require('winston');
//********************************************************************************************  
var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
        timestamp :true,
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }),
    new winston.transports.File({ 
        filename: __dirname + '../../logs/log.log',
        level :'error',
        json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '../../logs/exceptions.log', json: false })
  ],
  exitOnError: false
});
//********************************************************************************************
//to set the log level
logger.debugLevel = 'error';
module.exports = logger;