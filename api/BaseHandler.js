class BaseHandler {
    constructor() {

    }

    send(ctx, data, status = 200) {
        ctx.status = status;
        ctx.body = data;
    }

    throw(ctx, ...params) {
        return ctx.throw(...params);
    }

    copy (obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

module.exports = BaseHandler;