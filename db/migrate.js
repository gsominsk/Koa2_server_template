const database = require('./../modules/Database');
const books = require('./migrations/books');
const booksSeed = require('./seeders/booksSeed');

database.setLoggerLevel('info');
database.init()
    .then(() => books())
    .then(() => booksSeed())
    .then(() => database.logger.info('DONE'))
    .catch(r => database.logger.error(r))
    .then(() => database.connection.end());