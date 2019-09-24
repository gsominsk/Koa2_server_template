const axios     = require('axios');
const assert    = require('assert');
const logger    = require('./../modules/Logger').getLogger('Server');
const {start}   = require('../app');

start().catch((reason) => logger.fatal(reason));

const validators = {
    book(book) {
        assert.strictEqual(typeof book, 'object');
        assert.strictEqual(typeof book.title, 'string');
        assert.strictEqual(typeof book.description, 'string');
        assert.strictEqual(typeof book.image, 'string');
        assert.strictEqual(typeof book.autor, 'string');
        assert.strictEqual(typeof new Date(book.date).toLocaleString(), 'string');
    },
    errorBase(data) {
        assert.strictEqual(typeof data, 'object', 'Response must be object');
        assert.strictEqual(typeof data.error, 'object', 'Error must be object');
        assert.strictEqual(typeof data.error.message, 'string', 'Message must be string');
        assert.strictEqual(data.error.message.length > 0, true, 'Empty message');
    },
    errorMessage(data, message) {
        this.errorBase(data);
        assert.strictEqual(data.error.message, message);
    },
    successBooks(data) {
        assert.strictEqual(typeof data, 'object', 'Response must be object');
        assert.strictEqual(typeof data.books, 'object', 'Books must be array');
        assert.strictEqual(Array.isArray(data.books), true, 'Books must be array');
        for (const book of data.books) {
            this.book(book);
        }
    }
};

describe('API test.', () => {
    describe('Get books.', () => {
        it('Empty request should return - all books.', async () => {
            const {data} = await axios.get('http://localhost:3001/book');

            validators.successBooks(data);
        });

        it('Get request with offset == 100 should return books with offset.', async () => {
            const [offset, defaultD] = await Promise.all([
                axios.get('http://localhost:3001/book?', {params:{offset:100}}),
                axios.get('http://localhost:3001/book')
            ]);

            validators.successBooks(offset.data);
            validators.successBooks(defaultD.data);
        });

        it('Get request with offset and limit should return books with offset 100 and limit 1', async () => {
            const {data} = await axios.get('http://localhost:3001/book', {params:{offset:100,limit:1}});
            validators.successBooks(data);
        });

        it('Get request with filter title', async () => {
            const {data} = await axios.get('http://localhost:3001/book', {params: {limit: 10}});
            validators.successBooks(data);
            if (!data.books.length) throw new Error('Empty database');

            const {title} = data.books[0];

            const list = await axios.get('http://localhost:3001/book', {
                params: {
                    filter: {
                        title
                    }
                }
            });

            validators.successBooks(list.data);
            assert.strictEqual(!!list.data.books.length, true);
            assert.strictEqual(list.data.books[0].autor, data.books[0].autor);
            assert.strictEqual(list.data.books[0].title, data.books[0].title);
        });


        it('Get request with sort title desc', async () => {
            const [sort, orig] = await Promise.all([
                axios.get('http://localhost:3001/book?', {params:{sort:{title: 'desc'}}}),
                axios.get('http://localhost:3001/book')
            ]);

            validators.successBooks(sort.data);
            validators.successBooks(orig.data);
            assert.notDeepStrictEqual(sort.data, orig.data);
        });

    });

    describe('Edit books.', () => {
        it('Edit one book and check list', async () => {
            const {data} = await axios.get('http://localhost:3001/book');
            const {books} = data;

            const list = await axios.patch('http://localhost:3001/book', {
                id: books[0].id,
                autor: books[0].autor,
                title: 'New title title',
                description: 'New description',
                image: 'some new image',
            });

            validators.book(list.data.book);
        });
    });

    describe('Add books.', () => {
        it('Should add book and find in list ', async () => {

            const {data} = await axios.post('http://localhost:3001/book', {
                autor: 'New autor',
                title: 'New title title',
                description: 'New description',
                image: 'some new image',
            });

            assert.strictEqual(data.success, true);
            validators.book(data.book);

            const list = await axios.get('http://localhost:3001/book', {
                params: {
                    filter: {
                        title: data.book.title,
                        description: data.book.description,
                        image: data.book.image,
                        author: data.book.autor
                    },
                }
            });

            assert.notStrictEqual(list.length, 0);
        });
    });
});