const Koa               = require('koa');
const router            = require('koa-router')();
const qs                = require('koa-qs');
const bodyParse         = require('koa-body');
const gracefulShutdown  = require('http-graceful-shutdown');

const logger        = require('./modules/Logger').getLogger('Server');
const database      = require('./modules/Database');
const Controller    = require('./api/Controller');
const config        = require('./config');

async function start() {
    await database.init();
    const app = new Koa();

    qs(app, 'extended');
    app.use(bodyParse({json: true}));

    const controller = new Controller;

    router.post('*', (ctx, next) => controller.handle(ctx, next));
    router.patch('*', (ctx, next) => controller.handle(ctx, next));
    router.get('*', (ctx, next) => controller.handle(ctx, next));

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            logger.error('[!] ERR : ', err);
            logger.error({ ...ctx.request.body, ...ctx.request.query });
            logger.error('----------------------------------------------');

            ctx.status = err.statusCode || err.status || 500;
            ctx.body = { error: { message: err.message } };
        }
    });

    app.use(router.routes());

    app.use((ctx) => {
        ctx.body = 'Bad path request.';
    });

    await app.listen(config.api.port);
}

module.exports = {start};
