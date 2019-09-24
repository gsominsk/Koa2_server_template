const BaseHandler   = require('./../BaseHandler');
const Book   = require('./../../db/models/Book');

class bookController extends BaseHandler {
    constructor(props) {
        super(props);
    }

    endpoint() {
        return '/book'
    }

    methods() {
        return ['POST', 'PATCH', 'GET']
    }

    async POST (ctx) {
        const data = {...ctx.request.body, ...ctx.request.query};

        const { insertId } = await Book.addBook(data);
        const [book] = await Book.getBooksList({ filter: { id: insertId } });
        this.send(ctx, {
            book: book,
            success: true,
        }, 200);
    }

    async PATCH (ctx) {
        const data = {...ctx.request.body, ...ctx.request.query};

        await Book.editBook(data);
        const [book] = await Book.getBooksList({ filter: { id: data.id } });
        this.send(ctx, {
            book: book,
            success: true,
        }, 200);
    }

    async GET (ctx) {
        const data = {...ctx.request.body, ...ctx.request.query};

        const books = await Book.getBooksList(data);

        return this.send(ctx,{
            limit: data.limit,
            offset: data.offset,
            sort: data.sort,
            filter: data.filter,
            books: books,
        }, 200);
    }
}

module.exports = new bookController;