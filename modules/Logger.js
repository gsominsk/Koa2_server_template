const log4js = require('log4js');
const path = require('path');
const config = require('../config');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'file',
            filename: path.join(config.logger.path, config.logger.fileName)
        },
    },
    categories: {
        default: {
            appenders: ['file'],
            level: config.logger.level
        },
    },
});

module.exports = log4js;