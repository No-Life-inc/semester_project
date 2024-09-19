import { DataTypes } from 'sequelize';
import sequelize from '../config/SqlConfig.js';
import Book from './Book.js';
import BookCollection from './BookCollection.js';

const BookHasBookCollection = sequelize.define('BookHasBookCollection', {
    books_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Book,
            key: 'id'
        }
    },
    book_collections_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: BookCollection,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'want to read',
    }
}, {
    tableName: 'books_has_bookcollection',
    timestamps: false
});

export default BookHasBookCollection;