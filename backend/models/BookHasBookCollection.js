import { DataTypes } from 'sequelize';
import sequelize from '../config/SqlConfig.js';
import Book from './Book.js';
import BookCollection from './BookCollection.js';

const BookHasBookCollection = sequelize.define('BookHasBookCollection', {
    books_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'id'
        }
    },
    book_collections_id: {
        type: DataTypes.INTEGER,
        references: {
            model: BookCollection,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'books_has_bookcollection',
    timestamps: false
});

export default BookHasBookCollection;