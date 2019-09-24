const database = require('./../../modules/Database');

class Book {
    static get table() {
        return 'books';
    }

    static get sortFilterParams() {
        return ['id', 'title', 'description', 'image', 'date', 'created', 'updated', 'autor'];
    }

    static addBooks(books) {
        const sql = `INSERT INTO ${this.table} (title, description, image, date, autor, created) VALUES ?`;
        const data = books.map(book => [
            book.title,
            book.description,
            book.image,
            book.date || new Date(),
            book.autor,

            book.created || new Date()
        ]);
        return database.query(sql, [data]);
    }

    static getValueForWhere(value) {
        return typeof value === 'number' ? `${value}` : `"${value}"`;
    }

    static getBooksList(params = {}) {

        const offset = params.offset || 0;
        const limit = params.limit || 100;
        let sort = params.sort || {};
        let filter = params.filter || {};

        if (params.filter && typeof params.filter === 'string')
            filter = JSON.parse(params.filter);

        if (params.sort && typeof params.sort === 'string')
            sort = JSON.parse(params.sort);

        let where = `${this.table}.deleted IS NULL`;
        let order = '';

        for (const key in filter) {
            if (!filter.hasOwnProperty(key)) continue;
            if (!this.sortFilterParams.find(k => k === key)) continue;
            where += ` ${where.length ? 'AND' : ''} ${this.table}.${key} = ${this.getValueForWhere(filter[key])}`;
        }

        for (const key in sort) {
            if (!sort.hasOwnProperty(key)) continue;
            if (!this.sortFilterParams.find(k => k === key)) continue;
            order += `${order.length ? ',' : ''} ${this.table}.${key} ${sort[key].toUpperCase()}`;
        }

        let sql = `SELECT ${this.table}.* FROM ${this.table} `;
        if (where.length) sql += ` WHERE ${where}`;
        if (order.length) sql += ` ORDER BY ${order}`;
        sql += ` LIMIT ${limit}`;
        sql += ` OFFSET ${offset}`;
        return database.query(sql);
    }

    static addBook(params) {
        return this.addBooks([params]);
    }

    static editBook(params) {
        const FIELDS = ['autor', 'title', 'description', 'image'];
        let set = '';
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            if (!FIELDS.find(f => f === key)) continue;
            set += `${set.length ? ',' : ''} ${key}=${this.getValueForWhere(params[key])}`;
        }
        if (!set.length) return true;
        const sql = `UPDATE ${this.table} SET ${set}, updated=current_timestamp WHERE id=${Number(params.id)}`;
        return database.query(sql);
    }
}

module.exports = Book;