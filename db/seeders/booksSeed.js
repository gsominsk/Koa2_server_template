const logger = require('./../../modules/Logger');
const Book = require('./../models/Book');

class Fill {
    static execute() {
        const f = new this();
        return f.main();
    }

    constructor() {
        this.books = [];
        this.MAX_BOOKS = 1e5;
        this.logger = logger.getLogger('[I] Filling books table ... ');
        this.logger.level = 'all';
    }

    static generateRandomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    static generateRandomString(length) {
        let string = '';
        for (let i = 0; i < length; i++) {
            const buff = Buffer.alloc(1);
            buff[0] = this.generateRandomNumber(0x41, 0x5A);
            string += buff.toString('utf-8');
        }
        return string;
    }

    fillBooks() {
        for (let i = 0; i < this.MAX_BOOKS; i++) {
            this.books.push({
                autor: this.constructor.generateRandomString(5),
                title: this.constructor.generateRandomString(10),
                description: this.constructor.generateRandomString(20),
                image: 'https://images.app.goo.gl/vYgKRMHpbZpTV4eP9',

                created: new Date(),
                updated: new Date(),

                date: new Date(),
            });
        }
    }

    async main() {
        this.fillBooks();
        await Book.addBooks(this.books);
    }
}


module.exports = () => Fill.execute();