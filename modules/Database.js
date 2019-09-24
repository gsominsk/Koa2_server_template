const mysql = require('mysql');
const logger = require('./Logger');
const config = require('../config');

class Database {
    constructor() {
        this.connection = null;
        this.logger = logger.getLogger('Database');

        this.logger.level = config.mysql.debug;
    }

    setLoggerLevel(level) {
        this.logger.level = level;
        return this;
    }

    async init() {
        this.connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            database: config.mysql.database,
            password: config.mysql.password
        });

        await new Promise((resolve, reject) => (
            this.connection.connect(err => (err ? reject(err) : resolve()))
        ));

        this.logger.info('[I] Database connection successfully.');
    }

    async query(...args) {
        this.logger.debug('[I] Sql', ...args);
        return new Promise((resolve, reject) => {
            return this.connection.query(...args, (err, res) => (err ? reject(err) : resolve(res)))
        });
    }
}

module.exports = new Database();