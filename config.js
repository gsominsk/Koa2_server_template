const config = {
    mysql: {
        user: 'root',
        password: 'password',
        host: 'localhost',
        database: 'test',
        debug: 'all', //'info'
    },
    api: {
        port: 3001,
    },
    logger: {
        path: __dirname,
        fileName: 'logs.log',
        level: 'all'
    }
};

module.exports = config;