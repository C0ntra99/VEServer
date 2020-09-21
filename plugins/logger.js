const config = require('../config/config.js');
require('winston-daily-rotate-file');
const { createLogger, format, transports } = require('winston');
const os = require('os');

const loggingDir = config.globals.logging.path || './logs';
const level = config.globals.logging.level || 'verbose';

const maxSize = config.globals.logging.maxSize || '5m';
const maxFiles = config.globals.logging.maxFiles || "100";

const logFormat = format.printf( (info) => {
    if (info.label){
        log_format=`${info.timestamp} [${os.hostname()}] [${info.label}] [${info.level}] ${info.message}`;
    } else {
        log_format=`${info.timestamp} [${os.hostname()}] [${info.level}] ${info.message}`;
    };

    return log_format;
});

const logger = createLogger({
    level: level,
    format: format.combine(
        format.timestamp({
            format: 'YYY-MM-DD HH:mm:ss.SSS'
        }),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: loggingDir + '/VibeEngine_server_%DATE%.log',
            datePattern: 'YYY-MM-DD',
            maxSize: maxSize,
            mazFiles: maxFiles,
            level: level
        }),
        new transports.DailyRotateFile({
            filename: loggingDir + '/VibeEngine_server_error_%DATE%.log',
            datePattern: 'YYY-MM-DD',
            maxSize: maxSize,
            mazFiles: maxFiles,
            level: 'error'
        })
    ]
});

module.exports = logger;