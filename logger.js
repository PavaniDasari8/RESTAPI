'use strict';

let winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname, '/logs/all-logs.log'),
            handleExceptions: true,
            json: true,
            maxsize: 5242880, 
            //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
        logger.info(encoding);
    }
};

module.exports = logger;