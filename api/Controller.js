const BaseHandler   = require('./BaseHandler');
const book          =require('./books/controller');

class Controller extends BaseHandler {
    constructor(props) {
        super(props);
    }

    config () {
        return {
            book
        }
    }

    handle (ctx, next) {
        let requestList = this.config();
        let url = ctx.originalUrl.split('?')[0];

        for (let request in requestList) {

            const methods = requestList[request].methods();
            const endpoint = requestList[request].endpoint();

            for (let m = 0; m < methods.length; m++) {
                const method = methods[m];
                if (endpoint === url && method === ctx.request.method) {
                    return requestList[request][method](ctx, next);
                }
            }
        }

        ctx.status = 500;
        ctx.body = { error: { message: 'Bad path request.' } };
    }
}

module.exports = Controller;