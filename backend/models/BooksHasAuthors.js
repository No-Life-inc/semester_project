import { DataTypes } from 'sequelize';
import sequelize from '../config/SqlConfig.js';
import Book from './Book.js';
import Author from './Author.js';

const BooksHasAuthors = sequelize.define('BooksHasAuthors', {
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Book,
            key: 'id'
        },
    },
    author_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Author,
            key: 'id'
        },
    }
}, {
    tableName: 'books_has_authors',
    timestamps: false
});

export default BooksHasAuthors;
