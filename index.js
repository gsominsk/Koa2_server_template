const database      = require('./modules/Database');
const logger        = require('./modules/Logger').getLogger('Server');
const {start}       = require('./app');

start()
    .then(() => logger.info('[I] Server started.'))
    .catch((reason) => {
        logger.fatal(reason);
        if (database.connection) database.connection.end();
    });